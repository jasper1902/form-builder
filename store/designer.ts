import { create } from "zustand";
import { FormElementInstance } from "@/components/FormElements";

type Store = {
  elements: FormElementInstance[];
  setElements: (elements: FormElementInstance[]) => void;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: FormElementInstance | null;
  setSelectedElement: (element: FormElementInstance | null) => void;
  updateElement: (id: string, element: FormElementInstance) => void;
};

export const useDesigner = create<Store>((set) => ({
  elements: [],
  setElements: (elements) => set({ elements }),

  addElement: (index, element) =>
    set((state) => {
      const newElements = [...state.elements];
      newElements.splice(index, 0, element);
      return { elements: newElements };
    }),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
    })),

  selectedElement: null,
  setSelectedElement: (selectedElement) => set({ selectedElement }),

  updateElement: (id, element) =>
    set((state) => {
      const newElements = [...state.elements];
      const index = newElements.findIndex((el) => el.id === id);
      if (index !== -1) {
        newElements[index] = element;
      }
      return { elements: newElements };
    }),
}));
