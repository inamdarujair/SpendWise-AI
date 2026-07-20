"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("./ai.service");
class AIController {
    static async categorize(req, res) {
        try {
            const { description, amount } = req.body;
            const result = await ai_service_1.AIService.categorize(description, amount);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getInsights(req, res) {
        try {
            const result = await ai_service_1.AIService.getInsights(req.user.userId);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async extractReceipt(req, res) {
        try {
            // Expecting a multipart form upload in a real implementation
            const result = await ai_service_1.AIService.extractReceipt('mock-url');
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async askAdvisor(req, res) {
        try {
            const { message } = req.body;
            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }
            const response = await ai_service_1.AIService.askAdvisor(req.user.userId, message);
            res.json({ reply: response });
        }
        catch (error) {
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
exports.AIController = AIController;
