import { Request, Response } from 'express';

import Service from 'models/Service.model';
import ServiceFile from 'models/ServiceFile.model';

const registerFiles = [
  'constitutiveAct',
  'powerOfAttorney',
  'addressProof',
  'ine'
];
const negotiationFiles = ['contract'];

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const service = new Service() as any;
    await service.getService(req.body.service);
    if (
      service.status === 'registro' &&
      registerFiles.includes(req.body.file) &&
      req.file != undefined
    ) {
      const key = req.body.file as keyof typeof service;
      const serviceFile = service[key] as ServiceFile;
      if (serviceFile !== null) {
        if (serviceFile.lock)
          res.status(405).json({
            server: 'Archivo bloqueado'
          });
        else {
          serviceFile.updateFile(req.file);
          res.status(201).json({
            server: 'Archivo actualizado'
          });
        }
      } else {
        const file = new ServiceFile();
        file.setFile(req.file);
        await service
          .save()
          .then(() => {
            res.status(201).json({
              server: 'Archivo creado'
            });
          })
          .catch(() => {
            res.status(500).json({
              server: 'Error en la base de datos'
            });
          });
      }
    } else {
      res.status(405).json({
        server: 'El nombre del archivo no coincide con la etapa del servicio'
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No service')
        res.status(404).json({
          server: 'Servicio no encontrado'
        });
      else
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
    }
  }
};
