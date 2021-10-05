import { Request, Response } from 'express';
import Employee from 'models/Employee.model';

export default async (req: Request, res: Response) => {
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
      .catch((err: any) => {
        res.status(500).json({
          server: 'Error en la base de datos'
        });
      });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No employee')
        res.status(404).json({
          server: 'Colaborador no encontrado'
        });
      else
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
    }
  }
};
