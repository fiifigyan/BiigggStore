// apps/mobile/src/utils/validators.ts
export const validators = {
  // Email validation
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation: accept common local formats (e.g. Ghanaian 0XXXXXXXXX)
  // and international E.164 (+CCXXXXXXXXX). This is permissive but practical
  // for the app - further normalization can be done server-side.
  phone: (phone: string): boolean => {
    const clean = phone.replace(/\s|-/g, '');

    // International E.164 (e.g. +233XXXXXXXXX)
    if (/^\+\d{9,15}$/.test(clean)) return true;

    // Local national format starting with 0 and 10 digits total (e.g. 0501234567)
    if (/^0\d{9}$/.test(clean)) return true;

    // Fallback: accept plain digit sequences between 9 and 12 characters
    return /^\d{9,12}$/.test(clean);
  },

  // Password strength
  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain an uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain a lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain a number' };
    }
    return { isValid: true };
  },

  // Card validation (simplified)
  cardNumber: (number: string): boolean => {
    const clean = number.replace(/\s/g, '');
    return clean.length === 16 && /^\d+$/.test(clean);
  },

  // CVV validation
  cvv: (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Expiry date validation
  expiryDate: (expiry: string): boolean => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    const m = parseInt(month);
    const y = parseInt(year);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (m < 1 || m > 12) return false;
    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;
    return true;
  },
};