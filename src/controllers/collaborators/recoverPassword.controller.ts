import { Request, Response } from 'express';

export default async(req:Request, res:Response) => {
    try {
        res.status(200).json('Ok');
    } catch(e) {
        if(e instanceof Error) {
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}