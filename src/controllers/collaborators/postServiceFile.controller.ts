import { Request, Response } from 'express';
import { promisify } from 'util';
import path from 'path';
import * as fs from 'fs';

import Service from 'models/Service.model';
import ServiceFile from 'models/ServiceFile.model';

const deleteFileAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

const registerFiles = [
  'constitutiveAct',
  'powerOfAttorney',
  'addressProof',
  'Ine'
];

export default async (req: Request, res: Response) => {
  try {
    const service = new Service() as any;
    await service.getService(req.body.service);
    if (
      service.status === 'registro' &&
      registerFiles.includes(req.body.file)
    ) {
      const key = req.body.file as keyof typeof service;
      if (service[key] !== null) {
        console.log('Debemos actualizar el archivo');
        if (service[key]!.lock)
          res.status(405).json({
            server: 'Archivo bloqueado'
          });
        else {
          await deleteFileAsync(
            path.resolve(__dirname, '../../files', service[key].name)
          );
          await writeFileAsync(
            path.resolve(__dirname, '../../../files', service[key].name),
            req.file!.buffer
          );
          res.status(201).json({
            server: 'Archivo actualizado'
          });
        }
      } else {
        const file = new ServiceFile({});
        await writeFileAsync(
          path.resolve(__dirname, '../../../files', file.name!),
          req.file!.buffer
        );
        service[key] = file;
        await service
          .save()
          .then(() => {
            res.status(201).json({
              server: 'Archivo creado'
            });
          })
          .catch((err: any) => {
            console.log(err);
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
