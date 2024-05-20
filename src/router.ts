import { Router } from "express";
import { conversionController } from "./app/controllers/ConversionController";
import { currencyController } from "./app/controllers/CurrencyController";
import Joi from 'joi';
import { validate } from 'express-validation';

const router: Router = Router()
const conversion = {
    query: Joi.object({
        to: Joi.string().required(),
        from: Joi.string().required(),
        amount: Joi.number(),
        decimalPlaces: Joi.number()
    }),
}

const add = {
    body: Joi.object({
        asset: Joi.string().required(),
        type: Joi.string().required().valid('float', 'crypto', 'fixed', 'scrapper'),
        rate: Joi.number(),
        rateAsset: Joi.string(),
        scrpprUrl: Joi.string(),
        scrpprAmountTag: Joi.string(),
        scrpprRateTag: Joi.string(),
        scrpprDecimalSymbol: Joi.string()
    }),
}

//Routes
router.get("/conversion", validate(conversion), conversionController.conversion);
router.get("/add", validate(add), currencyController.add);
router.get("/remove/:asset", currencyController.remove);



export { router };