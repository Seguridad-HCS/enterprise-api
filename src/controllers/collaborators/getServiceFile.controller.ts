import { Request, Response } from 'express';
import Service from 'models/Service.model';
import ServiceFile from 'models/ServiceFile.model';

const serviceFiles = [
  'constitutiveAct',
  'powerOfattorney',
  'addressProof',
  'ine',
  'contract'
];

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const service = new Service() as any;
    await service.getService(req.params.serviceId);
    if (serviceFiles.includes(req.params.fileName)) {
      const serviceFile = service[req.params.fileName] as ServiceFile;
      if (serviceFile !== null) {
        const file = serviceFile.getFile();
        res.status(200).header({
          'Content-disposition': `attachment; filename="${req.params.fileName}.pdf"`,
          'Content-Type': 'application/pdf'
        });
        file.pipe(res);
      } else {
        res.status(404).json({
          server: 'Archivo no encontrado'
        });
      }
    } else
      res.status(404).json({
        server: 'Nombre del archivo inexistente'
      });
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
