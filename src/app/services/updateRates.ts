import * as cron from 'node-cron';
import { Currency, currencyModel } from "../models/CurrencyModel";
import axios from "axios";
import BigNumber from "bignumber.js";

class UpdateRates {
    private allUsdQuoteRate: any[] = [];
    public async startCron() {
        cron.schedule('* * * * *', this.updateAll);
        this.updateAll();
    }

    private async updateAll() {
        await this.getCoinAPI();
        let coins: Currency[] = await currencyModel.getCurrencies();
        for (let i = 0; i < coins.length; i++) {
            if (coins[i].symbol !== 'USD')
                coins[i].usdValue = await this.getTax(coins[i]);
        }
        currencyModel.addCurrencies(coins);
    }

    private async getCoinAPI() {
        let url = 'https://rest.coinapi.io/v1/exchangerate/USD';
        try {
            let resp = await axios.get(url, { headers: { 'X-CoinAPI-Key': process.env.COINAPIKEY } });
            this.allUsdQuoteRate = resp.data?.rates;
            // resp.data.rates.forEach((item: any) => {
            //     if (item.asset_id_quote == 'BRL')
            //         console.log(item);
            // })
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    public async getTax(coin: Currency) {
        if (coin.type == 'main' || coin.type == 'crypto' || coin.type == 'float') {
            let taxObj = this.allUsdQuoteRate.find((c) => c.asset_id_quote == coin.symbol);
            console.log(coin.symbol, taxObj);
            if (!taxObj?.rate)
                throw new Error('Invalid currency or type');
            return new BigNumber(1).dividedBy(taxObj.rate).toFixed(15);
        }
        throw new Error('Invalid currency or type');
    }


}

export const updateRates = new UpdateRates();