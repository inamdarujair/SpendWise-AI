import { useAuthStore } from '../store/authStore';

export const formatCurrency = (minorUnits: number) => {
  const currency = useAuthStore.getState().user?.currency || 'INR';
  
  // Format based on currency, for INR we use en-IN locale
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return (minorUnits / 100).toLocaleString(locale, { 
    style: 'currency', 
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
