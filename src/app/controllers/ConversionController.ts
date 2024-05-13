import { Request, Response } from "express";

class ConversionController {

    public conversion(req: Request, res: Response) {
        return res.json({
            response: 'Hello World'
        });
    }
}

export const conversionController = new ConversionController();