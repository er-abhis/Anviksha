import { create } from 'zustand';

/** Transient UI state for the left navigation drawer (not persisted). */
interface DrawerState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export const useDrawerStore = create<DrawerState>(set => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
