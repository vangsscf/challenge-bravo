import { Router } from "express";
import { conversionController } from "./app/controllers/ConversionController";
import { validate } from 'express-validation';
import Joi from 'joi';
const router: Router = Router()
const conversion = {
    query: {
      to: Joi.string().required(),
      from: Joi.string().required(),
      amount: Joi.number()
    },
}


//Routes
router.get("/conversion", validate(conversion), conversionController.conversion);



export { router };