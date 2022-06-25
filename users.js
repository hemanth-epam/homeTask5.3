const joi = require("@hapi/joi");

exports.userSchema = joi.object({
  //schema
  login: joi.string().required().alphanum(),
  password: joi.string().required().alphanum().min(6),
  age: joi.number().required().min(4).max(130),
});
