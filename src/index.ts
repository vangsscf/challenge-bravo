import { App } from "./app"
import { currencyController } from "./app/controllers/CurrencyController";
import 'dotenv/config';
// import axios from "axios";
// import * as cheerio from 'cheerio';

new App().server.listen(process.env.PORT);
currencyController.init();
// test();

// async function test() {
//     let resp: any = await axios.get('https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D');
//     if (resp.data) {
//         const $ = cheerio.load(resp.data);
//         let textArr = $('.psw-t-title-m').text().split(' ');
//         let textA = textArr.find((item) => item.indexOf('$') >= 0);
//         console.log($('.psw-c-t-2').text())
//         let textArrB = $('.psw-c-t-2').text().split(' ');
//         let textB = textArrB.find((item) => item.indexOf('$') >= 0);
//         if (textA && textB) {
//             console.log(formatTextToNumber(textA, ','));
//             console.log(formatTextToNumber(textB, ','));
//         }

//     }
// }


// function formatTextToNumber(numberStr: string, decimalSymbol: string) {
//     if (decimalSymbol == ',') {
//         return numberStr.replace(/[^\d,]|\.(?=.*\.)/g, '').replace(',', '.');
//     } else
//         return numberStr.replace(/[^\d.]|\.(?=.*\.)/g, '');
// }
