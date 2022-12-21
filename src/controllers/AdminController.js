const httpStatus = require("http-status");
const BranchService = require("../service/BranchService");
const BusinessService = require("../service/BusinessService");
const BusinesstypeService = require("../service/BusinesstypeService");
const UserService = require("../service/UserService");
const PlanService = require("../service/PlanService");
const AddonService = require("../service/AddonService");
const parse = require("date-fns/parse");
const differenceInCalendarDays = require("date-fns/differenceInCalendarDays");

const PlanbranchService = require("../service/PlanbranchService");

const PlanvalidityService = require("../service/PlanvalidityService");
const { basicCrudOperations } = require("../helper/utilHelper");
const addDays = require("date-fns/addDays");

const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
class AdminController {
  constructor() {
    this.userService = new UserService();
    this.businessService = new BusinessService();
    this.branchService = new BranchService();
    this.planService = new PlanService();
    this.businesstypeService = new BusinesstypeService();
    this.planvalidityService = new PlanvalidityService();
    this.planbranchService = new PlanbranchService();
    this.addonService = new AddonService();
  }

  subscribeToPlan = async (req, res) => {
    const { plan_id, branch_id } = req.query;
    const {
      start_date,
      plan_validity: { id: plan_validity_id },
      addons,
      screenshot,
      transaction_id,
      received_amount,
    } = req.body;
    const branch = await this.branchService.branchDao.findById(branch_id);
    const plan = await this.planService.planDao.findById(plan_id);
    const planValidity = (
      await plan.getPlanvalidities({ where: { id: plan_validity_id } })
    )[0];

    const start_date_formatted = parse(start_date, "dd/MM/yyyy", new Date());

    const expiryDate = addDays(start_date_formatted, planValidity.validity);
    let plan_charges_per_day = 0;
    let plan_tax_per_day = 0;
    let total_plan_charges = 0;
    const discountDifference = differenceInCalendarDays(
      parse(planValidity.discount_expiry, "yyyy-MM-dd", new Date()),
      new Date()
    );
    const price= planValidity.price - (discountDifference > 0 ? planValidity.discount : 0);
    if (plan.tax_inclusive) {
      plan_tax_per_day =
        (price - price * (100 / (100 + plan.tax))) /
        planValidity.validity;
      plan_charges_per_day =
      price / planValidity.validity - plan_tax_per_day;
    } else {
      plan_charges_per_day = price / planValidity.validity;
      plan_tax_per_day =
        (price * (plan.tax / 100)) / planValidity.validity;
    }
    total_plan_charges =
      plan_charges_per_day * planValidity.validity +
      plan_tax_per_day * planValidity.validity;

    const branchPlanId = await branch.addPlan(plan, {
      through: {
        start_date: start_date_formatted,
        end_date: expiryDate,
        tax: plan.tax,
        price,
        plan_validity_id,
        validity: planValidity.validity,
        screenshot,
        transaction_id,
        received_amount,
        plan_tax_per_day,
        plan_charges_per_day,
      },
    });

    const branchPlan = (
      await this.planbranchService.planbranchDao.findByWhere({
        plan_id,
        branch_id,
      })
    )[0];


    const promises = addons.map(async (tt) => {
      const addon = await this.addonService.addonDao.findById(tt.id);
      const totalValue = addon.price * tt.value * planValidity.validity;
      const total_addon_charges = plan.tax_inclusive
        ? totalValue * (100 / (addon.tax + 100))
        : totalValue + totalValue * (addon.tax / 100);
      return await branchPlan.addAddon(addon, {
        through: {
          value: tt.value,
          price: addon.price,
          validity: planValidity.validity,
          tax: addon.tax,
          total_addon_charges,
        },
      });
    });
    await Promise.all(promises);

    console.log(branchPlan);
    res.json(
      responseHandler.returnSuccess(httpStatus.OK, "Success", branchPlan)
    );
  };

  getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
      props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
    });
  }

  getSubscribedPlans = async (req, res) => {
    const { branch_id } = req.query;

    const branch = await this.branchService.branchDao.findById(branch_id);
    let planbranch = await this.planbranchService.planbranchDao.findByWhere({
      branch_id: branch.id,
    });

    const promises = planbranch.map(async (tt) => {
      const addons = await tt.getAddons();
      let details = tt.dataValues;
      console.log(details["end_date"]);
      const start_date_formatted = parse(
        details["end_date"],
        "yyyy-MM-dd",
        new Date()
      );
      console.log(start_date_formatted);
      const dateDiff = differenceInCalendarDays(
        start_date_formatted,
        new Date()
      );
      let total_addons_charges = 0;
      let total_addons_tax = 0;

      addons.forEach((addon) => {
        const { planbranchaddon } = addon;
        const { total_addon_charges, tax } = planbranchaddon;

        const totalValue = addon.price * tt.value * dateDiff;
        let total_balance_addon_charges = 0;
        let total_balance_addon_tax = 0;

        if (addon.tax_inclusive) {
          total_balance_addon_tax =
            addon.price - addon.price * (100 / (100 + tax));
          total_balance_addon_charges = addon.price - total_balance_addon_tax;
        } else {
          total_balance_addon_charges = totalValue;
          total_balance_addon_tax = totalValue * (tax / 100);
        }

        total_addons_charges += total_balance_addon_charges;
        total_addons_tax += total_balance_addon_tax;
      });

      if (dateDiff > details.validity) {
        details["status"] = "NOT_ACTIVATED";
      } else {
        details["status"] = "ACTIVATED";

        const { plan_tax_per_day, plan_charges_per_day } = details;
        const total_balance_plan_charges = plan_charges_per_day * dateDiff;
        const total_balance_tax_cost = plan_tax_per_day * dateDiff;
        let balance = {
          days_left: dateDiff,
          total_addons_charges,
          total_addons_tax,
          plan_tax_per_day,
          plan_charges_per_day,
          total_balance_plan_charges,
          total_balance_tax_cost,
          total_balance: total_balance_plan_charges + total_balance_tax_cost,
        };

        details["balance"] = balance;
      }
      console.log({ dateDiff });
      details["addons"] = addons;
      return details;
    });
    const plandetails = await Promise.all(promises);

    res.json(
      responseHandler.returnSuccess(httpStatus.OK, "Success", plandetails)
    );
  };

  getActivationGroup = async (req, res) => {
    console.log(this);
    const response = await this.branchService.getBranchesForActivation();
    console.log(response.data);
    res.json(response);
  };

  getPlans = async (id, condition = {}) => {
    const businessType =
      await this.businesstypeService.businessTypeDao.findById(id, condition);
    console.log(businessType);
    return await businessType.getPlans({
      include: this.planvalidityService.planvalidityDao.Model,
    });
  };

  addPlan = async (req, res) => {
    const business = await this.businesstypeService.businessTypeDao.findById(
      req.query.businesstype_id
    );
    const plan = await business.createPlan(req.body);

    const promises = req.body.planvalidities.map(async (tt) => {
      console.log(tt)
   
      return await plan.createPlanvalidity(tt);
    });
    await Promise.all(promises);

    // const value = await this.planvalidityService.planvalidityDao.bulkCreate(
    //   req.body.validity.map((val) => {
    //     console.log(plan?.dataValues?.id)
    //     return { ...val, plan_id: plan?.dataValues?.id };
    //   })
    // );
    res.json(responseHandler.returnSuccess(httpStatus["200"], "Success"));
  };

  getPlansByBusinessId = async (req, res) => {
    const plans = await this.getPlans(req.query?.businesstype_id);

    res.json(
      responseHandler.returnSuccess(httpStatus["200"], "Success", plans)
    );
  };

  updatePlans = async (req, res) => {
    const plan = (
      await this.getPlans(req.query?.businesstype_id, { id: req.query.id })
    )[0];

    const updatedPlan = await plan.update(req.body);
    const promises = req.body.planvalidities.map(async (tt) => {
      console.log({ tt });
      tt = omit(tt, ["plan_id"]);
      return await this.planvalidityService.planvalidityDao.updateOrCreate(
        { ...tt, plan_id: updatedPlan.id },
        { id: tt.id }
      );
    });
    await Promise.all(promises);
    res.json(
      responseHandler.returnSuccess(httpStatus["200"], "Success", updatedPlan)
    );
  };

  crudOperations = async (req, res) => {
    basicCrudOperations(req, res);
  };

  deletePlans = async (req, res) => {
    const plan = (
      await this.getPlans(req.query?.businesstype_id, { id: req.query.id })
    )[0];
    await plan.destroy();

    const promises = plan.planvalidities.map(async (tt) => {
      return await this.planvalidityService.planvalidityDao.deleteByWhere(
        { ...tt, plan_id: plan.id },
        { id: tt.id }
      );
    });
    await Promise.all(promises);
    res.json(responseHandler.returnSuccess(httpStatus["200"], "Success"));
  };

  deleteValidity = async (req, res) => {
    console.log(req.query);
    const planValidity =
      await this.planvalidityService.planvalidityDao.findOneByWhere({
        id: req.query.id,
        plan_id: req.query.plan_id,
      });
    try {
      await planValidity.destroy();
      res.json(responseHandler.returnSuccess(httpStatus["200"], "Success"));
    } catch (error) {
      logger.error(error);
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, error));
    }
  };
}
module.exports = AdminController;

// setTimeout(()=>{
//   const models = require('./../models');
//   for (let model of Object.keys(models)) {
//     if(models[model].name === 'Sequelize')
//        continue;
//     if(!models[model].name)
//       continue;

//     console.log("\n\n----------------------------------\n",
//     models[model].name,
//     "\n----------------------------------");

//     console.log("\nAssociations");
//     for (let assoc of Object.keys(models[model].associations)) {
//       for (let accessor of Object.keys(models[model].associations[assoc].accessors)) {
//         console.log(models[model].name + '.' + models[model].associations[assoc].accessors[accessor]+'()');
//       }
//     }
//   }
// },10000)
