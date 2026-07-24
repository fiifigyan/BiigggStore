// apps/mobile/src/utils/currency.ts
export const formatCurrency = (amount: number, currency: string = 'GHS') => {
  // Amount is in pesewas (GHS 1 = 100 pesewas)
  const value = amount / 100;
  
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrencyShort = (amount: number) => {
  const value = amount / 100;
  if (value >= 1000000) {
    return `₵${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₵${(value / 1000).toFixed(1)}K`;
  }
  return `₵${value.toFixed(0)}`;
};

export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and convert to number
  const clean = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(clean) * 100; // Convert to pesewas
};

// Add Ghana-specific price formatting
export const formatGHPrice = (amount: number): string => {
  const value = amount / 100;
  return `₵${value.toFixed(2)}`;
};

export const formatGHPriceShort = (amount: number): string => {
  const value = amount / 100;
  if (value >= 1000) {
    return `₵${(value / 1000).toFixed(1)}K`;
  }
  return `₵${value.toFixed(2)}`;
};