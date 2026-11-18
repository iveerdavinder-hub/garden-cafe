export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'filter' | 'brunch' | 'bakery' | 'starters' | 'mains' | 'beverages' | string;
  categoryLabel: string;
  description: string;
  price: string;
  tag?: string;
  image: string;
  available?: boolean;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  isVegetarian?: boolean;
}

export interface BrewMethod {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: 'Coffee' | 'Flame' | 'Droplet' | 'Snowflake' | 'Clock';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  specialInstructions?: string;
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CafeSettings {
  isOpen: boolean;
  storeStatus: 'open' | 'busy' | 'closed';
  announcement: string;
  announcementActive: boolean;
  phone: string;
  closingTime: string;
  kitchenCloseTime: string;
  autoOpenWhatsApp: boolean;
}
