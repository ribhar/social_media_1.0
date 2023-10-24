const statusCodes = require('http-status');
// const ApiError = require('../utils/ApiError');
const {  tokenService } = require('../services');

const verifyToken = async (req, res, next) => {
  res.lang = req.headers.lang ? req.headers.lang : 'en';
  const { authorization  } = req.headers;
  if(!authorization){
   return next(new "this is an error");
  }
  if(!authorization && authorization.split(' ')[0] === 'Bearer'){
    return next(new "this is an error");
  }
  const decoded = await tokenService.verifyToken(authorization.split(' ')[1]);
  if (!decoded){
    return next(new "this is an error");
  }
  if (!decoded.status) {
    return next(new "this is an error");
  }

  
  req.userData = {
    id: decoded.id,
    email: decoded.email,
    appId: decoded.app_id,
    mobileNumber: decoded.mobile_number,
    first_name: decoded.first_name,
    middle_name: decoded.middle_name,
    last_name: decoded.last_name,
    status: decoded.status,
    email_verified: decoded.email_verified,
    phone_verified: decoded.phone_verified,
    timezone_id: decoded.timezone_id
  };
  next();
};

const verifyOtpToken = async (req, res, next) => {
  res.lang = req.headers.lang ? req.headers.lang : 'en';
  const { authorization  } = req.headers;
  if(!authorization){
   return next(new "this is an error");
  }
  if(!authorization && authorization.split(' ')[0] === 'Bearer'){
    return next(new "this is an error");
  }
  const decoded = await tokenService.verifyOtpToken(authorization.split(' ')[1]);
  if (!decoded){
    return next(new "this is an error");
  }
  if (!decoded.status) {
    return next(new "this is an error");
  }

  
  req.userData = {
    id: decoded.id,
    email: decoded.email,
      mobile_number: decoded.mobile_number,
      first_name: decoded.first_name,
      middle_name: decoded.middle_name,
      last_name: decoded.last_name,
      status: decoded.status,
      email_verified: decoded.email_verified,
      phone_verified: decoded.phone_verified,
      timezone_id: decoded.timezone_id
  };
  next();
};

module.exports = { verifyToken, verifyOtpToken };
