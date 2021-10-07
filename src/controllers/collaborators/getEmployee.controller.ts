import { Request, Response } from 'express';
import logger from 'logger';
import Employee from 'models/Employee.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = new Employee();
    const data = await employee.getEmployee(req.params.employeeId);
    res.status(200).json({ employee: data });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No employee')
        res.status(404).json({
          server: 'Colaborador no encontrado'
        });
      else {
        logger.error(err);
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
      }
    }
  }
};
