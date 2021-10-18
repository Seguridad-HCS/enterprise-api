import { getRepository } from 'typeorm';

import Employee from '../../src/models/Employee.model';

export default async (): Promise<Employee> => {
  const employeeRepo = getRepository(Employee);
  const employee = await employeeRepo.createQueryBuilder('employee').getOne();
  if (!employee || !employee.id) throw Error('No employee');
  return employee;
};
