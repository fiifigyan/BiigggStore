// apps/mobile/src/store/slices/ui.slice.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  showBottomSheet: boolean;
  bottomSheetContent: React.ReactNode | null;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;

  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  showBottomSheet: (content: React.ReactNode) => void;
  hideBottomSheet: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  isLoading: false,
  showBottomSheet: false,
  bottomSheetContent: null,
  toastMessage: null,
  toastType: null,

  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  showBottomSheet: (bottomSheetContent) =>
    set({ showBottomSheet: true, bottomSheetContent }),
  hideBottomSheet: () =>
    set({ showBottomSheet: false, bottomSheetContent: null }),
  showToast: (toastMessage, toastType) => set({ toastMessage, toastType }),
  hideToast: () => set({ toastMessage: null, toastType: null }),
}));