import { createClient } from 'redis';

export type Currency = {
    name: string;
    type: string;
    url?: string;
    usdValue: number;
};

class CurrencyModel {

    async addCurrency() {
        const client = await createClient()
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        await client.disconnect();

    }

    async deleteCurrency() {
        const client = await createClient()
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        await client.disconnect();
    }

    async getCurrencies() {
        const client = await createClient()
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        await client.disconnect();
    }

    async getCurrency() {
        const client = await createClient()
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        await client.disconnect();
    }

}

export const currencyModel = new CurrencyModel();

