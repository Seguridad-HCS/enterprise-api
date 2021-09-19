import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Employee from '../../../models/Employee.model';
import { getRepository } from 'typeorm';

export default async(req:Request, res:Response) => {
    try {
        req.user.lastLogin = undefined;
        res.status(200).json({
            server: 'Sesion finalizada'
        });
        await getRepository(Employee).save(req.user);
    } catch(e) {
        console.log(e);
        if(e instanceof Error) {
            res.status(501).json({ server: 'Error interno en el servidor' });
        } else {
            res.status(500).json({ server: 'Error muy grave' });
        }
    }
}

const verifyToken = (token:string) => {
    const payload = jwt.verify(token, 'Esto es un test') as jwt.JwtPayload;
    console.log(payload);
}