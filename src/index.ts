import { App } from "./app"
import { currencyController } from "./app/controllers/CurrencyController";
import 'dotenv/config';

new App().server.listen(process.env.PORT);
currencyController.init();