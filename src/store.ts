import { create } from 'zustand';
import axios from 'axios';

interface State {
  products: any[];
  categories: any[];
  settings: any;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  login: (password: string) => Promise<void>;
  isAdmin: boolean;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  products: [],
  categories: [],
  settings: {},
  loading: false,
  error: null,
  isAdmin: localStorage.getItem('isAdmin') === 'true',

  loadData: async () => {
    try {
      set({ loading: true, error: null });
      const [products, categories, settings] = await Promise.all([
        axios.get('/api/products').then(res => res.data),
        axios.get('/api/categories').then(res => res.data),
        axios.get('/api/settings').then(res => res.data)
      ]);
      set({ products, categories, settings });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (password: string) => {
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      set({ isAdmin: true });
    } else {
      throw new Error('Неверный пароль');
    }
  },

  addProduct: async (product) => {
    try {
      set({ loading: true, error: null });
      await axios.post('/api/products', product);
      await get().loadData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, product) => {
    try {
      set({ loading: true, error: null });
      await axios.put(`/api/products/${id}`, product);
      await get().loadData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`/api/products/${id}`);
      await get().loadData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));