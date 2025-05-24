import { Router, Request, Response, NextFunction } from 'express';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { CreateCustomerDTO } from '../../application/dtos/create-customer';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer';
import { UpdateCustomerDTO } from '../../application/dtos/update-customer';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer';

export function customerRouter(
  createUC: CreateCustomerUseCase,
  updateUC: UpdateCustomerUseCase,
  getUC: GetCustomerUseCase,
): Router {
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

  router.put<{ id: string }, any, UpdateCustomerDTO>('/:id', async (req, res, next) => {
    try {
      const updated = await updateUC.execute(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }
      res.status(200).json(updated);
      return;
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const customer = await getUC.execute(req.params.id);
      if (!customer) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }
      res.json(customer);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
