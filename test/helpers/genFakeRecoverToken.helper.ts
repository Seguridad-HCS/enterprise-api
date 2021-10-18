import * as jwt from 'jsonwebtoken';

import getEmployee from './getEmployee.helper';

export default async (goForward = false): Promise<string> => {
  const employee = await getEmployee();
  const timestamp = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    { data: employee.id, iat: goForward ? timestamp : timestamp + 30 },
    <string>process.env.SERVER_RECOVER,
    {
      expiresIn: '1h'
    }
  );
  return token;
};
