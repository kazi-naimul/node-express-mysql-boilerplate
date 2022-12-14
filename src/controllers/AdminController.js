const httpStatus = require("http-status");
const BranchService = require("../service/BranchService");
const BusinessService = require("../service/BusinessService");
const BusinesstypeService = require("../service/BusinesstypeService");
const UserService = require("../service/UserService");
const PlanService = require("../service/PlanService");
const PlanvalidityService = require("../service/PlanvalidityService");
const { basicCrudOperations } = require("../helper/utilHelper");
const addDays = require('date-fns/addDays')

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
  }

  subscribeToPlan = async (req,res)=>{
    const {planId,branchId} = req.params;
    const {plan_validity:{id:plan_validity_id},addons} = req.body;

    const  branch = await this.branchService.branchDao.findById(branchId);
    const plan = await this.planService.planDao.findById(planId);
const planValidity = (await plan.getPlanvalidities({where:{id:plan_validity_id}}))[0];
const expiryDate = addDays(new Date(), planValidity.validity)

   const value = await branch.addPlans(plan,{ through: { start_date: new Date(), end_date:expiryDate ,price:planValidity.price } })
console.log(value);
    res.json(responseHandler.returnSuccess(httpStatus.OK,'Success',plan))

  }


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
