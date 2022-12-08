const capitalize = require("capitalize");
const pluralize = require("pluralize");
const responseHandler = require("../helper/responseHandler");
const httpStatus = require("http-status");
const { omit } = require("lodash");

const getAbsolutePath = (path) => {
  return "https://mabliz.onrender.com/" + path;
};

const getRecord = async ({ id, sourceModel, getMixin, res }) => {
  if (!id) {
    res.send(
      responseHandler.returnError(httpStatus.BAD_REQUEST, "Id is mandatory")
    );
    return;
  }

  const record = await sourceModel[getMixin]({
    where: {
      id,
    },
  });

  if (record.length === 0) {
    res.send(
      responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Id: " + id + " Not found"
      )
    );
    return;
  }

  return record;
};

const crudOperations = async ({ req, res, source, target, id }) => {
  const targetModelName = capitalize(target);

  const targetModelName_plural = pluralize(targetModelName);

  const sourceModelName = source || "user";
  const sourceModel = req[sourceModelName];
  const getMixin = "get" + targetModelName_plural;
  //  console.log(req.body)
  switch (req.method) {
    case "GET":
      const modelListData = await sourceModel[getMixin]();
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelListData)
      );
      break;
    case "POST":
      const createMixin = "create" + targetModelName;

      const modelAddedData = await sourceModel[createMixin](req.body);
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelAddedData)
      );
      break;
    case "PUT":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        const modelUpdateData = await record[0].update(req.body);
        res.json(
          responseHandler.returnSuccess(
            httpStatus.OK,
            "Success",
            modelUpdateData
          )
        );
      }

      break;

    case "DELETE":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        await record[0].destroy();
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
      }
      break;
  }
};

const crudOperationsTwoTargets = async ({
  req,
  res,
  source,
  target1,
  target2,
  target1Id,
  target2Id,
  id,
}) => {

  console.log({source,
    target1,
    target2,
    target1Id,
    target2Id,
    id})
  const target1ModelName = capitalize(target1);
  const target1ModelName_plural = pluralize(target1ModelName);
  const getMixin1 = "get" + target1ModelName_plural;

 
  const target2ModelName = capitalize(target2 || '');
  const target2ModelName_plural = pluralize(target2ModelName);
  const getMixin2 = "get" + target2ModelName_plural;

  const sourceModelName = source || "user";
  const sourceModel = req[sourceModelName];
  let targetid1Query = { where: {} };
  if (target1Id) {
    targetid1Query.where = { id: target1Id };
  }

  let targetid2Query = { where: {} };
  if (target2Id) {
    targetid2Query.where = { id: target2Id };
  }
  //  console.log(req.body)
  switch (req.method) {
    case "GET":
      const modelListDatatemp = await sourceModel[getMixin1](targetid1Query);
      console.log(targetid1Query,modelListDatatemp)
      const modelListData = target2 ? await modelListDatatemp?.[0]?.[getMixin2](
        targetid2Query,
      ): modelListDatatemp?.[0];
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelListData)
      );
      break;
    case "POST":
      const createMixin = "create" + targetModelName;

      const modelAddedData = await sourceModel[createMixin](req.body);
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelAddedData)
      );
      break;
    case "PUT":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        const modelUpdateData = await record[0].update(req.body);
        res.json(
          responseHandler.returnSuccess(
            httpStatus.OK,
            "Success",
            modelUpdateData
          )
        );
      }

      break;

    case "DELETE":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        await record[0].destroy();
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
      }
      break;
  }
};

module.exports = {
  getAbsolutePath,
  crudOperations,
  crudOperationsTwoTargets,
};
