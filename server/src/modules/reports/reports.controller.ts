import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ReportsService } from './reports.service';

export class ReportsController {
  static async exportCsv(req: AuthRequest, res: Response) {
    try {
      const csv = await ReportsService.generateCsv(req.user!.userId);
      res.header('Content-Type', 'text/csv');
      res.attachment('spendwise-report.csv');
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async exportPdf(req: AuthRequest, res: Response) {
    try {
      res.header('Content-Type', 'application/pdf');
      res.attachment('spendwise-report.pdf');
      await ReportsService.generatePdf(req.user!.userId, res);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
