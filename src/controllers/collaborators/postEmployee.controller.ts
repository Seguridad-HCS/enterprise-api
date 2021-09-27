import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Employee from 'models/Employee.model';

export default async(req:Request, res:Response) => {
    try {
        const employee = new Employee(req.body);
        await getRepository(Employee).save(employee);
        res.status(201).json({
            server: 'Colaborador registrado exitosamente',
            employee
        });
    } catch(e) {
        if(e instanceof Error) {
            console.trace(e);
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}