const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const routes = require("./route");
const bodyParser = require("body-parser");

const { jwtStrategy } = require("./config/passport");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./helper/ApiError");
const models = require("./models/");
const multer = require("multer");
process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options("*", cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + file.originalname);
  },
});

console.log(process.env.PWD)
app.use(express.static(`${process.env.PWD}/public`));
app.use(express.static(`${process.env.PWD}/images`));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(multer({storage:fileStorage}).single("image"));

app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));

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
console.log(Business, User, Branch);
User.hasMany(Business);
Business.belongsTo(User);

Business.hasMany(Branch);
Branch.belongsTo(Business);

// db.sequelize.sync({force:true});
// db.sequelize.sync({alter:true});

// db.sequelize.sync();
module.exports = app;
