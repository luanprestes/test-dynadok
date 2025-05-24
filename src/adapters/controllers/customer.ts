import { Router, Request, Response, NextFunction } from 'express';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { CreateCustomerDTO } from '../../application/dtos/create-customer';

export function customerRouter(createUC: CreateCustomerUseCase): Router {
  const router = Router();

  router.post(
    '/',
    async (req: Request<{}, any, CreateCustomerDTO>, res: Response, next: NextFunction) => {
      try {
        const created = await createUC.execute(req.body);
        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
