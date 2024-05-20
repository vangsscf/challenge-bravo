import * as cron from 'node-cron';
import { Currency, currencyModel, CurrencyType } from "../models/CurrencyModel";
import axios from "axios";
import BigNumber from "bignumber.js";
import * as cheerio from 'cheerio';

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
                coins[i].rate = await this.getTax(coins[i]);
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
        if (coin.type == CurrencyType.main || coin.type == CurrencyType.crypto || coin.type == CurrencyType.float || coin.type == CurrencyType.fixed) {
            let taxObj = this.allUsdQuoteRate.find((c) => c.asset_id_quote == coin.symbol);
            console.log(coin.symbol, taxObj);
            if (!taxObj?.rate) {
                if (coin.type == CurrencyType.fixed)
                    return coin.rate;
                else throw new Error('Invalid currency or type');
            }
            return new BigNumber(1).dividedBy(taxObj.rate).toFixed(30);
        } else if (coin.type == 'scrapper') {
            let rateAssetUsdRate = 1, rate = '1', amount = '1';
            if (coin.scrpprRateAsset) {
                try {
                    rateAssetUsdRate = (await currencyModel.getCurrency(coin.scrpprRateAsset)).rate;
                } catch (err) {
                    console.log(err);
                    throw new Error('Invalid rate currency');
                }
            }
            if (coin.scrpprUrl)
                try {
                    let resp = await axios.get(coin.scrpprUrl);
                    if (resp.data && coin.scrpprRateTag) {
                        const $ = cheerio.load(resp.data);
                        let textArr = $(coin.scrpprRateTag).text().split(' ');
                        let textA = textArr.find((item) => item.indexOf('$') >= 0);
                        if (textA)
                            rate = this.formatTextToNumber(textA, coin.scrpprDecimalSymbol || ',');
                        else throw new Error('Invalid scrapper rate tag');
                        if (coin.scrpprAmountTag) {
                            let textArrB = $(coin.scrpprAmountTag).text().split(' ');
                            let textB = textArrB.find((item) => item.indexOf('$') >= 0);
                            if (textB) {
                                amount = this.formatTextToNumber(textB, coin.scrpprDecimalSymbol || ',');
                            } else throw new Error('Invalid scrapper amount tag');
                        }

                        return new BigNumber(rate).dividedBy(amount).dividedBy(rateAssetUsdRate).toFixed(30);
                    }

                } catch (err) {
                    throw err;
                }
            else throw new Error('Scrapper url need to be informed');
        }
        throw new Error('Invalid currency or type');
    }

    private formatTextToNumber(numberStr: string, decimalSymbol: string) {
        if (decimalSymbol == ',') {
            return numberStr.replace(/[^\d,]|\.(?=.*\.)/g, '').replace(',', '.');
        } else
            return numberStr.replace(/[^\d.]|\.(?=.*\.)/g, '');
    }


}

export const updateRates = new UpdateRates();