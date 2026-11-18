import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Reservation, CafeSettings, Order, CartItem, OrderItem } from '../types';
import { MENU_ITEMS, INITIAL_RESERVATIONS, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/cafeData';

interface CafeContextType {
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  cart: CartItem[];
  settings: CafeSettings;
  isAdmin: boolean;
  isCartOpen: boolean;
  setIsAdmin: (val: boolean) => void;
  setIsCartOpen: (val: boolean) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleStockStatus: (id: string) => void;
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  updateSettings: (updates: Partial<CafeSettings>) => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'gc_menu_items_v2',
  RESERVATIONS: 'gc_reservations_v1',
  ORDERS: 'gc_orders_v1',
  CART: 'gc_cart_v1',
  SETTINGS: 'gc_settings_v1',
  ADMIN_MODE: 'gc_admin_mode_v1',
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading menu from localStorage', e);
    }
    return MENU_ITEMS.map((item) => ({
      ...item,
      available: true,
      stockStatus: 'in_stock' as const,
    }));
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading reservations from localStorage', e);
    }
    return INITIAL_RESERVATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [settings, setSettings] = useState<CafeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          autoOpenWhatsApp: parsed.autoOpenWhatsApp ?? false,
        };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.error(e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(isAdmin));
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin]);

  // Real-time cross-tab sync so orders & reservations update live across all open browser windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.ORDERS) {
          setOrders(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.RESERVATIONS) {
          setReservations(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.SETTINGS) {
          setSettings(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.MENU) {
          setMenuItems(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Storage sync error', err);
      }
    };

    const handleCustomSync = (e: any) => {
      try {
        if (e.detail?.type === 'orders') {
          const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
          if (saved) setOrders(JSON.parse(saved));
        } else if (e.detail?.type === 'reservations') {
          const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
          if (saved) setReservations(JSON.parse(saved));
        }
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('garden_cafe_sync', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('garden_cafe_sync', handleCustomSync);
    };
  }, []);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Menu operations
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      available: true,
      stockStatus: item.stockStatus || 'in_stock',
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleStockStatus = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const current = item.stockStatus || 'in_stock';
        const nextStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
          current === 'in_stock'
            ? 'low_stock'
            : current === 'low_stock'
            ? 'out_of_stock'
            : 'in_stock';
        return {
          ...item,
          stockStatus: nextStatus,
          available: nextStatus !== 'out_of_stock',
        };
      })
    );
  };

  // Reservation operations (pushed to Admin Panel in real time)
  const addReservation = (res: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
    const newRes: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      createdAt: 'Just now',
    };
    setReservations((prev) => {
      const updated = [newRes, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    window.dispatchEvent(new CustomEvent('garden_cafe_sync', { detail: { type: 'reservations' } }));
    return newRes;
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  // Food Order operations (pushed to Admin Panel in real time)
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#GC-${randomSuffix}`,
      createdAt: 'Just now',
    };
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    window.dispatchEvent(new CustomEvent('garden_cafe_sync', { detail: { type: 'orders' } }));
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const updateSettings = (updates: Partial<CafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setMenuItems(
      MENU_ITEMS.map((item) => ({
        ...item,
        available: true,
        stockStatus: 'in_stock' as const,
      }))
    );
    setReservations(INITIAL_RESERVATIONS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
  };

  const clearAllData = () => {
    setReservations([]);
    setOrders([]);
    setCart([]);
    setMenuItems(
      MENU_ITEMS.map((item) => ({
        ...item,
        available: true,
        stockStatus: 'in_stock' as const,
      }))
    );
    setSettings(INITIAL_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
      localStorage.setItem(
        STORAGE_KEYS.MENU,
        JSON.stringify(
          MENU_ITEMS.map((item) => ({
            ...item,
            available: true,
            stockStatus: 'in_stock' as const,
          }))
        )
      );
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CafeContext.Provider
      value={{
        menuItems,
        reservations,
        orders,
        cart,
        settings,
        isAdmin,
        isCartOpen,
        setIsAdmin,
        setIsCartOpen,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleStockStatus,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        updateSettings,
        resetToDefaults,
        clearAllData,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
