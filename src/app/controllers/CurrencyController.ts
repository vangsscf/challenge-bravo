import { Request, Response } from "express";
import { Currency, currencyModel } from "../models/CurrencyModel";
import { updateRates } from "../services/updateRates";

class CurrencyController {

    public async init() {
        let coins: string | undefined = process.env.COINS;
        let coinsArr: string[] = coins ? coins.split(',') : [];
        let memoryCoins: Currency[] = await currencyModel.getCurrencies();

        if (coinsArr.length > 0) {
            coinsArr.forEach(async (coin) => {
                let idx: number = memoryCoins.findIndex((c) => c.symbol == coin);
                if (idx === -1) {
                    let body: Currency = {
                        symbol: coin,
                        type: 'main',
                        usdValue: '1'
                    }
                    await currencyModel.addCurrency(coin, body);
                }
            });
        }

        await updateRates.startApiCron();
        updateRates.startCron();
    }

    public conversion(req: Request, res: Response) {
        return res.json({
            response: 'Hello World'
        });
    }


}

export const currencyController = new CurrencyController();