import { Request, Response } from 'express';
import logger from 'logger';
import Employee from 'models/Employee.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = new Employee();
    await employee.getEmployee(req.params.employeeId);
    await employee
      .remove()
      .then(() => {
        res.status(200).json({
          server: 'Colaborador eliminado'
        });
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).json({
          server: 'Error en la base de datos'
        });
      });
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
