const Joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false});

const signupSchema = Joi.object({
    first_name: Joi.string().min(4),
    last_name: Joi.string().min(4),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

exports.validateSignUp = validator(signupSchema);

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),  
});

exports.validateLogIn = validator(loginSchema);