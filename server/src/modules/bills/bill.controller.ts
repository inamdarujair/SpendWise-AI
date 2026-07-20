import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { BillService } from './bill.service';

export class BillController {
  static async getBills(req: AuthRequest, res: Response) {
    try {
      const bills = await BillService.getBills(req.user!.userId);
      res.json(bills);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async createBill(req: AuthRequest, res: Response) {
    try {
      const bill = await BillService.createBill(req.user!.userId, req.body);
      res.status(201).json(bill);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateBill(req: AuthRequest, res: Response) {
    try {
      const bill = await BillService.updateBill(req.user!.userId, req.params.id as string, req.body);
      res.json(bill);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteBill(req: AuthRequest, res: Response) {
    try {
      await BillService.deleteBill(req.user!.userId, req.params.id as string);
      res.json({ message: 'Bill deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
