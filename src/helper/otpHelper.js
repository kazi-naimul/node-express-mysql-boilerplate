const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "mabliz_tvisof_key_secret_otp_msg";

const axios = require("axios");

function verifyOTP(phone, hash, otp) {
  // Seperate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return false;
  // Calculate new hash with the same key and the same algorithm
  let data = `${phone}.${otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return true;
  }
  return false;
}

async function sendSMS(phone, otp) {
  const req = {
    senderId: "Mabliz",
    mobileNumbers: phone,
    message: `Welcome to Mabliz. Your verification code is ${otp} this can be used just once and is valid for 5 mins.`,
    templateId: "1007166600338238146",
    apiKey: "2ISQb8vJJKhZyR67fkdnTAuTOOKSS/px4+UWH+fQpDs=",
    clientId: "9281c0aa-8740-4ae3-8fc0-c196968e3cd0",
  };

  return await axios.post("http://sms.dial4sms.com:6005/api/v2/SendSMS", req);
}

async function createNewOTP(phone) {
  // Generate a 6 digit numeric OTP
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  await sendSMS(phone, otp);
  return fullHash;
}

module.exports = { createNewOTP, verifyOTP };
