import React from 'react';
import { AIAssistant } from './AIAssistant';

const AIAssistantPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Assistant</h2>
        <p className="text-slate-500 mt-1">Get personalized financial advice from SpendWise AI.</p>
      </div>
      <div className="flex-1 w-full">
        <AIAssistant mode="page" />
      </div>
    </div>
  );
};

export default AIAssistantPage;
