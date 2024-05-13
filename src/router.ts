import { Router } from "express";
import { conversionController } from "./app/controllers/ConversionController";

const router: Router = Router()

//Routes
router.get("/", conversionController.conversion);

export { router };