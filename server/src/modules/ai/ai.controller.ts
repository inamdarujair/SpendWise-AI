import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AIService } from './ai.service';

export class AIController {
  static async categorize(req: AuthRequest, res: Response) {
    try {
      const { description, amount } = req.body;
      const result = await AIService.categorize(description, amount);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getInsights(req: AuthRequest, res: Response) {
    try {
      const result = await AIService.getInsights(req.user!.userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async extractReceipt(req: AuthRequest, res: Response) {
    try {
      // Expecting a multipart form upload in a real implementation
      const result = await AIService.extractReceipt('mock-url');
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async askAdvisor(req: AuthRequest, res: Response) {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }
      const response = await AIService.askAdvisor(req.user!.userId, message);
      res.json({ reply: response });
    } catch (error: any) {
      console.error('AI Advisor error:', error);
      
      let errorMsg = 'AI Assistant is temporarily unavailable. Please try again later.';
      
      if (error?.message && error.message.includes('OPENROUTER_API_KEY is missing')) {
        errorMsg = error.message; 
      }
        
      res.status(503).json({ 
        error: errorMsg
      });
    }
  }
}
