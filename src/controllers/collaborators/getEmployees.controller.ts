import { Request, Response } from 'express';
import Employee from 'models/Employee.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = new Employee();
    const query = await employees.getAllEmployees(req.user.id);
    res.status(200).json({
      server: 'Lista de colaboradores',
      employees: query
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
