import dbConnection from './dbConnection';
import fs from 'fs';
import path from 'path';

import Position from 'models/Position.model';
import Department from 'models/Department.model';
import Location from 'models/Location.model';
import LocationProfile from 'models/LocationProfile.model';
import Employee from 'models/Employee.model';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';
import Service from 'models/Service.model';
import ServiceFile from 'models/ServiceFile.model';
import logger from 'logger';

// Departments of HCS
const managerDep = new Department({
  name: 'Directivo',
  description:
    'Celula encargada de tomar las decisiones administrativas y rumbo de la empresa.'
});
const hrDep = new Department({
  name: 'Recursos humanos',
  description: 'Celula encargada de administrar el capital humano.'
});
const sysDep = new Department({
  name: 'Sistemas',
  description: 'Celula encargada de administrar la infrestructura tecnologica.'
});
const opDep = new Department({
  name: 'Operativo',
  description: 'Celula encargada de brindar el servicio de seguridad.'
});
const finDep = new Department({
  name: 'Finanzas',
  description: 'Celula encargada de la administracion financiera de la emrpesa.'
});

// Positions of HCS
const ceo = new Position({
  name: 'Director ejecutivo', // Departamento directivo
  description: 'Pendiente de descripcion',
  department: managerDep
});
const cto = new Position({
  name: 'Director de tecnologia', // Departamento de sistemas
  description: 'Pendiente de descripcion',
  department: sysDep
});
const dev = new Position({
  name: 'Desarrollador', // Departamento de sistemas
  description: 'Pendiente de descripcion',
  department: sysDep
});
const recruiter = new Position({
  name: 'Reclutador', // Departamento de recursos humanos
  description: 'Pendiente de descripcion',
  department: hrDep
});

// Locations
const devHouse = new Location({
  name: 'Oficina de desarrollo',
  address: {
    street: 'Cipres',
    outNumber: 'Mz.12 Lt.10',
    intNumber: 'N/A',
    neighborhood: 'Narvarte',
    zip: '09950',
    municipality: 'Iztapalapa',
    state: 'Ciudad de Mexico'
  }
});

const testOffice = new Location({
  name: 'Oficina de pruebas',
  address: {
    street: 'Alcanfor',
    outNumber: '#3789',
    intNumber: '#12',
    neighborhood: 'Centro Historico',
    zip: '09980',
    municipality: 'Tlahuac',
    state: 'Ciudad de Mexico'
  }
});

// Location profiles
const devHouseCTOProfile = new LocationProfile({
  total: 1,
  minAge: 18,
  maxAge: 45,
  price: 35000,
  minWage: 30000,
  maxWage: 50000,
  sex: true,
  position: cto,
  location: devHouse
});

const devHouseDEVProfile = new LocationProfile({
  total: 5,
  minAge: 18,
  maxAge: 45,
  price: 25000,
  minWage: 12000,
  maxWage: 18000,
  sex: true,
  position: dev,
  location: devHouse
});

const devHouseRECRUITERProfile = new LocationProfile({
  total: 1,
  minAge: 18,
  maxAge: 45,
  price: 50000,
  minWage: 35000,
  maxWage: 45000,
  sex: undefined,
  position: recruiter,
  location: devHouse
});

const testOfficeCEOProfile = new LocationProfile({
  total: 1,
  minAge: 18,
  maxAge: 45,
  price: 50000,
  minWage: 35000,
  maxWage: 45000,
  sex: undefined,
  position: ceo,
  location: testOffice
});

const testOfficeRECRUITERProfile = new LocationProfile({
  total: 1,
  minAge: 18,
  maxAge: 45,
  price: 50000,
  minWage: 35000,
  maxWage: 45000,
  sex: undefined,
  position: recruiter,
  location: testOffice
});

// Employees
const employee1 = new Employee({
  name: 'John',
  surname: 'Doe',
  secondSurname: 'Test',
  email: 'seguridadhcsdevs@gmail.com',
  nss: '8964296',
  bloodtype: 'A+',
  rfc: 'MAAVO280605',
  birthDate: '05-06-1990',
  sex: true,
  baseWage: 7000,
  // image: './public/assets/_testpf1.jpg',
  locationProfile: devHouseCTOProfile
});
employee1.setPassword('thisIsAtest98!');

const employee2 = new Employee({
  name: 'Jane',
  surname: 'Doe',
  secondSurname: 'Test',
  email: 'janedoe@gmail.com',
  nss: '8964296',
  bloodtype: 'A+',
  rfc: 'MASVO280605',
  birthDate: '05-06-1995',
  sex: true,
  baseWage: 4500,
  // image: './public/assets/_testpf1.jpg',
  locationProfile: devHouseDEVProfile
});
employee1.setPassword('thisIsAtest98!');

const employee3 = new Employee({
  name: 'Obi',
  surname: 'Wan',
  secondSurname: 'Kenobi',
  email: 'obiwan@gmail.com',
  nss: '8964296',
  bloodtype: 'A+',
  rfc: 'MANAO280605',
  birthDate: '05-06-1998',
  sex: true,
  baseWage: 12000,
  // image: './public/assets/_testpf1.jpg',
  locationProfile: devHouseDEVProfile
});
employee1.setPassword('thisIsAtest98!');

// Partners
const partner1 = new Partner({
  name: 'Comex',
  legalName: 'Pinturas Comex S.A. de C.V.',
  rfc: 'MAJO990503Q56',
  representative: 'Jane Doe Sample',
  phoneNumber: '+525566339911',
  email: 'partner@example.com'
});
const partner2 = new Partner({
  name: 'Bimbo',
  legalName: 'Panaderia Bimbo S.A. de C.V.',
  rfc: 'MANO990503Q56',
  representative: 'John Doe Test',
  phoneNumber: '+525511663377',
  email: 'test@sample.com'
});
const partner3 = new Partner({
  name: 'Hitachi',
  legalName: 'Hitachi Electronics S.A. de C.V.',
  rfc: 'MAMO990503Q56',
  representative: 'Obi Wan Kenobi',
  phoneNumber: '+525511664477',
  email: 'jedi@sample.com'
});

// Partner contacts
const partnerContact1 = new PartnerContact({
  name: 'Carlos Vazquez Perez',
  role: 'Director ejecutivo',
  phoneNumber: '+525558451755',
  email: 'carlos@ejemplo.com',
  partner: partner1
});
const partnerContact2 = new PartnerContact({
  name: 'Roberto Vazquez Perez',
  role: 'Director ejecutivo',
  phoneNumber: '+525558451755',
  email: 'carlos@ejemplo.com',
  partner: partner2
});
// Service files
const buffer = fs.readFileSync(
  path.resolve(__dirname, '../test/sampleFiles/test.pdf')
);
const bufferSize = Buffer.byteLength(buffer);
const fileData = {
  fieldname: 'file',
  originalname: 'test.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: buffer,
  size: bufferSize
} as Express.Multer.File;
const file1 = new ServiceFile();
const file2 = new ServiceFile();

// Services
const service1 = new Service({
  partner: partner2
});
service1.constitutiveAct = file1;
service1.powerOfAttorney = file2;

const seed = async () => {
  try {
    if (!fs.existsSync(path.resolve(__dirname, '../../files'))) {
      fs.mkdirSync(path.resolve(__dirname, '../../files'));
    }
    logger.debug('Ejecutando semilla del servidor');
    await dbConnection();

    // Create departments
    await managerDep.save();
    await hrDep.save();
    await sysDep.save();
    await opDep.save();
    await finDep.save();
    logger.debug('Departamentos creados');

    // Create positions
    await ceo.save();
    await cto.save();
    await dev.save();
    await recruiter.save();
    logger.debug('Posiciones creadas');

    // Create locations
    await devHouse.save();
    await testOffice.save();
    logger.debug('Locaciones creadas');

    // Create location profiles
    await devHouseCTOProfile.save();
    await devHouseDEVProfile.save();
    await devHouseRECRUITERProfile.save();
    await testOfficeCEOProfile.save();
    await testOfficeRECRUITERProfile.save();
    logger.debug('Perfiles para locaciones creadas');

    // Create employees
    await employee1.save();
    await employee2.save();
    await employee3.save();
    logger.debug('Empleados creados');

    // Create partners
    await partner1.save();
    await partner2.save();
    await partner3.save();
    logger.debug('Socios creados');

    // Create parner contacts
    await partnerContact1.save();
    await partnerContact2.save();
    logger.debug('Contactos creados');

    // Create services
    await service1.save();
    file1.setFile(fileData);
    file2.setFile(fileData);
    logger.debug('Servicios creados');

    return;
  } catch (err) {
    logger.error(err);
  }
};

void seed();
