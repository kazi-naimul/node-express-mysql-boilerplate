const httpStatus = require("http-status");
const BranchService = require("../service/BranchService");
const BusinessService = require("../service/BusinessService");
const BusinesstypeService = require("../service/BusinesstypeService");
const UserService = require("../service/UserService");
const PlanService = require("../service/PlanService");
const AddonService = require("../service/AddonService");
const parse = require('date-fns/parse')

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
    } = req.body;
console.log({plan_validity_id,branch_id,plan_id});
    const branch = await this.branchService.branchDao.findById(branch_id);
    const plan = await this.planService.planDao.findById(plan_id);
    const planValidity = (
      await plan.getPlanvalidities({ where: { id: plan_validity_id } })
    )[0];

    const start_date_formatted = parse(start_date,'dd/MM/yyyy',new Date())

    const expiryDate = addDays(start_date_formatted, planValidity.validity);
    console.log({ plan });
    const branchPlanId = await branch.addPlan(plan, {
      through: {
        start_date: start_date_formatted,
        end_date: expiryDate,
        price: planValidity.price,
        tax:plan.tax,
        total_plan_charges: plan.tax_inclusive ? planValidity.price * (100/(plan.tax + 100)) : planValidity.price + (planValidity.price * (plan.tax/100))
      },
    });

    const branchPlan = await this.planbranchService.planbranchDao.findById(
      branchPlanId[0]
    );

    const promises = addons.map(async (tt) => {
      const addon = await this.addonService.addonDao.findById(tt.id);
      return await branchPlan.addAddon(addon, { through: { value: tt.value,price:addon.price, tax:addon.tax,
        total_addon_charges: plan.tax_inclusive ? addon.price * tt.value *(100/(addon.tax + 100)) : (addon.price * tt.value) + ((addon.price * tt.value) * (addon.tax/100))

      } });
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

    const addons = await planbranch[0].getAddons();
    console.log(addons);

    planbranch[0]["addons"] = addons;
    res.json(
      responseHandler.returnSuccess(httpStatus.OK, "Success", {
        ...planbranch[0].dataValues,
        addons,
      })
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
      req.body.businesstype_id
    );
    const plan = await business.createPlan(req.body);

    const promises = req.body.planvalidities.map(async (tt) => {
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
