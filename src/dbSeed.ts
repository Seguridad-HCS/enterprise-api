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

// Location profiles
const devHouseProfile = new LocationProfile({
    total: 1,
    minAge: 18,
    maxAge: 45,
    price: 3500000,
    minWage: 300000,
    maxWage: 500000,
    sex: true,
    position: cto,
    location: devHouse
});

// Employees
const employee1 = new Employee({
    name: 'Oscar',
    surname: 'Martinez',
    secondSurname: 'Vazquez',
    email: 'oscarmartinez1998lol@gmail.com',
    nss: '8964296',
    bloodtype: 'A+',
    rfc: 'MAVO980605',
    birthDate: '05-06-1998',
    sex: true,
    baseWage: 4500000,
    // image: './public/assets/_testpf1.jpg',
    locationProfile: devHouseProfile
});
employee1.setPassword('test');

// Partners 
const partner1 = new Partner({
    name: 'Comex',
    legalName: 'Pinturas Comex S.A. de C.V.',
    rfc: 'MAJO990503Q56',
    representative: 'Oscar Martinez Vazquez',
    phoneNumber: '+525536593166',
    email: 'partner@example.com'
});

// Partner contacts
const partnerContact1 = new PartnerContact({
    name: 'Carlos Vazquez Perez',
    role: 'Director ejecutivo',
    phoneNumber: '+525558451755',
    email: 'carlos@ejemplo.com',
    partner: partner1
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
        console.log('Locaciones creadas');

        // Create location profile
        const locProRepo = getRepository(LocationProfile);
        await locProRepo.save(devHouseProfile);
        console.log('Perfiles para locaciones creadas');

        // Create employees
        const empRepo = getRepository(Employee);
        await empRepo.save(employee1);
        console.log('Empleados creados');

        const partRepo = getRepository(Partner);
        await partRepo.save(partner1);
        console.log('Socios creados');

        const contRepo = getRepository(PartnerContact);
        await contRepo.save(partnerContact1);
        console.log('Contactos creados');

        return;
    } catch (e) {
        console.trace(e);
    }
}

void seed();