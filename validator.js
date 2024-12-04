const Joi = require('joi');


const validator = (schema) =>(payload)=>
    schema.validate(payload,{abortEarly: false});



const userSchema = Joi.object({
    name:Joi.string().min(4).max(8).required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(10).required()
})

const userUpdateSchema = Joi.object({
    name:Joi.string().min(4).max(8).required(),
    password:Joi.string().min(6).max(10).required()
})



module.exports = {userSchema,userUpdateSchema}