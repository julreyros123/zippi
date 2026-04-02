import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'sm',
      notificationsEnabled: true,
      aiKey: '',

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setAiKey: (aiKey) => set({ aiKey }),
    }),
    {
      name: 'zippi-settings',
    }
  )
);

export default useSettingsStore;
