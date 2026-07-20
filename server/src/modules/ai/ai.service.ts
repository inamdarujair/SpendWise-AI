export class AIService {
  static async categorize(description: string, amount: number) {
    // Deterministic stub representing a future LLM/ML integration
    const descLower = description.toLowerCase();
    
    if (descLower.includes('uber') || descLower.includes('lyft') || descLower.includes('gas')) {
      return { categoryId: 'mock-transport', confidence: 0.95, suggestedName: 'Transportation' };
    }
    if (descLower.includes('restaurant') || descLower.includes('starbucks') || descLower.includes('food')) {
      return { categoryId: 'mock-food', confidence: 0.92, suggestedName: 'Food & Dining' };
    }
    if (descLower.includes('salary') || descLower.includes('payroll')) {
      return { categoryId: 'mock-income', confidence: 0.99, suggestedName: 'Salary' };
    }
    
    return { categoryId: 'mock-misc', confidence: 0.50, suggestedName: 'Miscellaneous' };
  }

  static async getInsights(userId: string) {
    // Deterministic stub for insights
    return {
      insights: [
        { type: 'warning', message: 'You have spent 40% more on dining out this week.' },
        { type: 'success', message: 'You are on track to hit your Emergency Fund goal.' }
      ]
    };
  }

  static async extractReceipt(imageUrl: string) {
    // OCR stub
    return {
      merchant: 'Local Coffee Shop',
      date: new Date().toISOString(),
      totalMinorUnits: 450,
      lineItems: [
        { description: 'Latte', amountMinorUnits: 450 }
      ],
      confidence: 0.88
    };
  }

  static async askAdvisor(userId: string, userMessage: string): Promise<string> {
    const { env } = await import('../../config/env');
    
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is missing from server/.env. Please add "OPENROUTER_API_KEY=your_key" in server/.env and restart the server to enable the AI Assistant.');
    }

    const { AnalyticsService } = await import('../analytics/analytics.service');
    const { Transaction } = await import('../transactions/transaction.model');
    const { Budget } = await import('../budgets/budget.model');
    const { Bill } = await import('../bills/bill.model');
    const { Goal } = await import('../goals/goal.model');
    
    // Fetch user dashboard data for context
    const dashboardData = await AnalyticsService.getDashboardData(userId);
    
    // Fetch only required user data to reduce latency and prompt size
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10).populate('categoryId', 'name').lean();
    const budgets = await Budget.find({ userId }).limit(5).populate('categoryId', 'name').lean();
    const bills = await Bill.find({ userId, status: 'pending' }).sort({ dueDate: 1 }).limit(5).lean();
    const goals = await Goal.find({ userId, status: 'active' }).limit(5).lean();
    
    // Format optimized context summary
    const summary = dashboardData.summary;
    const systemPrompt = `You are SpendWise AI, a fast, simple, and conversational financial advisor.

CRITICAL RULES:
1. Keep responses between 3–8 lines.
2. Use simple, natural English (like a helpful human).
3. DO NOT generate tables or markdown tables.
4. DO NOT generate large reports unless explicitly asked for a "full financial report".
5. Limit output to 150–250 words maximum.
6. Give direct, actionable, and conversational answers.

Context:
- Balance: ${(summary.totalBalance / 100).toFixed(2)} | Income: ${(summary.income / 100).toFixed(2)} | Expenses: ${(summary.expense / 100).toFixed(2)}
- Cash Flow: ${(summary.netCashFlow / 100).toFixed(2)} | Savings Rate: ${summary.savingsRate}%
- Health: ${dashboardData.healthScore} (${dashboardData.healthStatus})

Top Expenses: ${dashboardData.categoryBreakdown.slice(0, 3).map((c: any) => `${c.name} (${c.value}%)`).join(', ')}

Recent Activity (Top 10):
${transactions.map((t: any) => `${new Date(t.date).toISOString().split('T')[0]}: ${(t.amountMinorUnits / 100).toFixed(2)} ${t.type} (${t.categoryId?.name || 'Misc'})`).join(' | ')}

Pending Bills & Goals:
Bills: ${bills.length ? bills.map((b: any) => `${b.name} (${(b.amountMinorUnits / 100).toFixed(2)})`).join(', ') : 'None'}
Goals: ${goals.length ? goals.map((g: any) => `${g.name} (${(g.currentAmountMinorUnits / 100).toFixed(2)}/${(g.targetAmountMinorUnits / 100).toFixed(2)})`).join(', ') : 'None'}`;

    const callOpenRouter = async (model: string) => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'I am sorry, I could not generate a response.';
    };

    try {
      return await callOpenRouter('openai/gpt-oss-20b:free');
    } catch (error: any) {
      console.warn('Primary OpenRouter model failed, falling back...', error.message);
      // Fallback model
      return await callOpenRouter('qwen/qwen3-coder:free');
    }
  }
}
