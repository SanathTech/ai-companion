import { create } from "zustand";

interface useSignedInModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSignedInModal = create<useSignedInModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
