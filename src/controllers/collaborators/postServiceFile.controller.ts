import { Request, Response } from 'express';
import logger from 'logger';

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
    await service.getService(req.params.serviceId);
    if (
      service.status === 'registro' &&
      registerFiles.includes(req.body.fileName) &&
      req.file != undefined
    ) {
      const key = req.body.fileName as keyof typeof service;
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
          .catch((err: unknown) => {
            logger.error(err);
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
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No service')
        res.status(404).json({
          server: 'Servicio no encontrado'
        });
      else {
        logger.error(err);
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
      }
    }
  }
};
