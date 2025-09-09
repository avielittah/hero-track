import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  adminMode: boolean;
}

interface AdminActions {
  enableAdmin: () => void;
  disableAdmin: () => void;
  isAdmin: () => boolean;
}

interface AdminStore extends AdminState, AdminActions {}

const ADMIN_PASSCODE = '1379';
const STORAGE_KEY = 'taleai.adminMode';

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      adminMode: false,

      enableAdmin: () => {
        set({ adminMode: true });
      },

      disableAdmin: () => {
        set({ adminMode: false });
      },

      isAdmin: () => {
        return get().adminMode;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        // In production, don't auto-restore admin mode on page load
        adminMode: process.env.NODE_ENV === 'development' ? state.adminMode : false,
      }),
    }
  )
);

export const validatePasscode = (passcode: string): boolean => {
  return passcode === ADMIN_PASSCODE;
};

export const isAdmin = (): boolean => {
  return useAdminStore.getState().isAdmin();
};