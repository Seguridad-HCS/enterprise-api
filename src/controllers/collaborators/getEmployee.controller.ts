import { Request, Response } from 'express';
import Employee from 'models/Employee.model';

export default async(req:Request, res:Response) => {
    try {
        const employee = new Employee();
        const data = await employee.getEmployee(req.params.employeeId);
        res.status(200).json({ employee: data });
    } catch(e) {
        if(e instanceof Error) {
            console.log(e);
            res.status(500).json({ 
                server: 'Error interno en el servidor'
            });
        }
    }
}