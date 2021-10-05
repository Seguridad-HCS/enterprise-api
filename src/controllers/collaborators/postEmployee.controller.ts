import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Employee from 'models/Employee.model';
import removeUndefined from 'helpers/removeUndefined.helper';
import { ValidationError } from 'class-validator';

export default async (req: Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    await getRepository(Employee)
      .save(employee)
      .then(() => {
        const query = employee.formatEmployee();
        res.status(201).json({
          server: 'Colaborador registrado',
          employee: query
        });
      })
      .catch((err) => {
        if (Array.isArray(err) && err[0] instanceof ValidationError) {
          const valErrors = removeUndefined(err);
          res.status(400).json({
            server: 'Error en el input',
            errores: valErrors
          });
        } else if (['22P02', '23502'].includes(err.code)) {
          res.status(404).json({
            server: 'Llaves foraneas invalidas o incorrectas'
          });
        } else
          res.status(500).json({
            server: 'Error en la base de datos'
          });
      });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
