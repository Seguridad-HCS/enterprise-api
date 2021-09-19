import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import Employee from 'models/Employee.model';

export default async(req:Request, res:Response, next:NextFunction) => {
    try {
        if(!req.headers.token) throw Error('Bad token');
        const payload = jwt.verify(req.headers.token as string, 'Esto es un test') as jwt.JwtPayload;
        const query = await getRepository(Employee)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.locationProfile', 'locProfile')
            .leftJoinAndSelect('locProfile.position', 'position')
            .where('user.id = :id', { id: payload.data })
            .getOne();
        if(!query) throw Error('Bad token');
        req.user = query;
        next();
    } catch(e) {
        if(e instanceof Error) res.status(501).json({
            server: 'Token corrupto'
        });
    }
}