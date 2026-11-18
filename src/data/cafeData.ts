import cafeDataJson from './cafeData.json';
import { MenuItem, BrewMethod, Testimonial, GalleryItem, Reservation, CafeSettings, Order } from '../types';

export const CAFE_CONFIG = cafeDataJson.cafeConfig;

export const MENU_ITEMS: MenuItem[] = cafeDataJson.menuItems as MenuItem[];

export const BREW_METHODS: BrewMethod[] = cafeDataJson.brewMethods as BrewMethod[];

export const TESTIMONIALS: Testimonial[] = cafeDataJson.testimonials as Testimonial[];

export const GALLERY_ITEMS: GalleryItem[] = cafeDataJson.galleryItems as GalleryItem[];

export const INITIAL_RESERVATIONS: Reservation[] = cafeDataJson.initialReservations.map(
  ({ dayOffset, ...rest }) => ({
    ...rest,
    date: new Date(Date.now() + dayOffset * 86400000).toISOString().slice(0, 10),
    status: rest.status as Reservation['status'],
  })
);

export const INITIAL_SETTINGS: CafeSettings = cafeDataJson.initialSettings as CafeSettings;

export const INITIAL_ORDERS: Order[] = cafeDataJson.initialOrders as Order[];
