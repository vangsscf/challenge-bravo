import Joi from 'joi';
import { CurrencyType } from "../app/models/CurrencyModel";

export const conversion = {
    query: Joi.object({
        to: Joi.string().required(),
        from: Joi.string().required(),
        amount: Joi.number(),
        decimalPlaces: Joi.number()
    }),
}

export const add = {
    body: Joi.object({
        asset: Joi.string().required(),
        type: Joi.string().required().valid(CurrencyType.crypto, CurrencyType.fixed, CurrencyType.scrapper, CurrencyType.float),
        rate: Joi.number(),
        rateAsset: Joi.string(),
        scrpprUrl: Joi.string(),
        scrpprAmountTag: Joi.string(),
        scrpprRateTag: Joi.string(),
        scrpprDecimalSymbol: Joi.string()
    }),
}

export const login = {
    body: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    }),
}