const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const routes = require("./route");
const bodyParser = require("body-parser");
const path = require('path');
const { jwtStrategy } = require("./config/passport");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./helper/ApiError");
const models = require("./models/");
const utilHandler = require("./helper/utilHelper");

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options("*", cors());



console.log(process.env.PWD)
app.use(express.static(`${process.env.PWD}/public`));
app.use(express.static(`${process.env.PWD}/registration`));
// app.use(express.static(
//   path.join(__dirname,"../client/build")));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "registration");
    },
    filename: (req, file, cb) => {
      cb(null,  file.fieldname+'_'+Date.now()+path.extname(file.originalname) );
    },
  });
  const imagesMiddleWare = (req, res, next) => {
    console.log(req.get('content-type'),req.files)
  
    if (req.is("multipart/form-data")) {
      const images ={}
  console.log(req.files)
      req.files?.forEach((file) => {
        images[file.fieldname] = utilHandler.getAbsolutePath(file.filename);
      });
      req.body = { ...JSON.parse(req.body.details), ...images };
      req.headers['content-type'] = 'application/json';

      console.log(req.body);    }
    next();
  };
  

app.use(multer({storage:fileStorage}).any("images"));
app.use(imagesMiddleWare);
// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.get("/", async (req, res) => {
  console.log("test");
  res.status(200).send("Congratulations! API is working!");
});
app.use("/api", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
const db = require("./models");

const User = models.user;
const Business = models.business;
const Branch = models.branch;
const BusinessTypes = models.businesstype;
const BusinessCategory= models.businesscategory;
const BusinessActivity= models.businessactivity;
const Plan= models.plan;
const PlanValidity= models.planvalidity;


console.log(models.businessType)
console.log(Business, User, Branch);
User.hasMany(Business);
Business.belongsTo(User);
BusinessTypes.belongsTo(User);
User.hasMany(BusinessTypes)
Business.hasMany(Branch);
Branch.belongsTo(Business);
BusinessCategory.belongsTo(BusinessTypes)
BusinessTypes.hasMany(BusinessCategory)

BusinessActivity.belongsTo(BusinessCategory);
BusinessCategory.hasMany(BusinessActivity);

Plan.hasMany(PlanValidity);
PlanValidity.belongsTo(Plan);

BusinessTypes.hasMany(Plan);
Plan.belongsTo(BusinessTypes);


// db.sequelize.sync({force:true});
// db.sequelize.sync({alter:true}); 

db.sequelize.sync();
module.exports = app;
