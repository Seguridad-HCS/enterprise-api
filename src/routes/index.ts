import { Router, Request, Response } from 'express';

import collabAuth from 'routes/auth';
import collabLocations from 'routes/locations.routes';
import collabLocationProfiles from 'routes/locationProfiles.routes';
import collabEmployees from 'routes/employees.routes';
import collabPartners from 'routes/partners.routes';
import collabServices from 'routes/services.routes';

const router = Router();

// Test route
router.get('/', (req: Request, res: Response) => {
  res.status(200).json('Ok');
});

// Collaborator routes
router.use('/collaborators/auth', collabAuth);
router.use('/collaborators/locations', collabLocations);
router.use('/collaborators/locations/profiles', collabLocationProfiles);
router.use('/collaborators/employees', collabEmployees);
router.use('/collaborators/partners', collabPartners);
router.use('/collaborators/services', collabServices);

// Catch non implemented routes
router.all('*', (req: Request, res: Response) => {
  res.status(404).json('Route not found');
});

export default router;
