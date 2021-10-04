import { getRepository } from 'typeorm';
import dbConnection from './dbConnection';

import Position from 'models/Position.model';
import Department from 'models/Department.model';
import Location from 'models/Location.model';
import LocationProfile from 'models/LocationProfile.model';
import Employee from 'models/Employee.model';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';

// Departments of HCS
const managerDep = new Department({
    name: 'Directivo',
    description: 'Celula encargada de tomar las decisiones administrativas y rumbo de la empresa.'
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
    department: sysDep,
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
    email: 'johndoe@gmail.com',
    nss: '8964296',
    bloodtype: 'A+',
    rfc: 'MAAVO280605',
    birthDate: '05-06-1990',
    sex: true,
    baseWage: 7000,
    // image: './public/assets/_testpf1.jpg',
    locationProfile: devHouseCTOProfile
});
employee1.setPassword('test');

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
employee1.setPassword('test');

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
employee1.setPassword('test');

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
    representative: 'Jon Doe Test',
    phoneNumber: '+525511663377',
    email: 'partner@sample.com'
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

const seed = async () => {
    try {
        console.log('Ejecutando semilla del servidor');
        await dbConnection();

        // Create departments
        const depRepo = getRepository(Department);
        await depRepo.save(managerDep);
        await depRepo.save(hrDep);
        await depRepo.save(sysDep);
        await depRepo.save(opDep);
        await depRepo.save(finDep);
        console.log('Departamentos creados');

        // Create positions
        const posRepo = getRepository(Position);
        await posRepo.save(ceo);
        await posRepo.save(cto);
        await posRepo.save(dev);
        await posRepo.save(recruiter);
        console.log('Posiciones creadas');

        // Create location
        const locRepo = getRepository(Location);
        await locRepo.save(devHouse);
        await locRepo.save(testOffice);
        console.log('Locaciones creadas');

        // Create location profile
        const locProRepo = getRepository(LocationProfile);
        await locProRepo.save(devHouseCTOProfile);
        await locProRepo.save(devHouseDEVProfile);
        await locProRepo.save(devHouseRECRUITERProfile);
        await locProRepo.save(testOfficeCEOProfile);
        await locProRepo.save(testOfficeRECRUITERProfile);
        console.log('Perfiles para locaciones creadas');

        // Create employees
        const empRepo = getRepository(Employee);
        await empRepo.save(employee1);
        await empRepo.save(employee2);
        await empRepo.save(employee3);
        console.log('Empleados creados');

        const partRepo = getRepository(Partner);
        await partRepo.save(partner1);
        await partRepo.save(partner2);
        console.log('Socios creados');

        const contRepo = getRepository(PartnerContact);
        await contRepo.save(partnerContact1);
        await contRepo.save(partnerContact2);
        console.log('Contactos creados');

        return;
    } catch (e) {
        console.log(e);
    }
}

void seed();