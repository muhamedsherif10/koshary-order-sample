// Demo menu for a fictional restaurant. Prices are made up for the sample.

export type Category = { id: string; name: string; nameAr: string };

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  description: string;
  price: number; // EGP
};

export const CATEGORIES: Category[] = [
  { id: 'koshary', name: 'Koshary', nameAr: 'كشري' },
  { id: 'sides', name: 'Sides', nameAr: 'إضافات' },
  { id: 'desserts', name: 'Desserts', nameAr: 'حلويات' },
  { id: 'drinks', name: 'Drinks', nameAr: 'مشروبات' },
];

export const MENU: MenuItem[] = [
  { id: 'k1', categoryId: 'koshary', name: 'Koshary — Small', nameAr: 'كشري صغير', description: 'Rice, lentils, pasta, crispy onions, tomato sauce', price: 35 },
  { id: 'k2', categoryId: 'koshary', name: 'Koshary — Medium', nameAr: 'كشري وسط', description: 'Our most ordered size', price: 50 },
  { id: 'k3', categoryId: 'koshary', name: 'Koshary — Large', nameAr: 'كشري كبير', description: 'For big appetites', price: 65 },
  { id: 'k4', categoryId: 'koshary', name: 'Family Box', nameAr: 'علبة عائلية', description: 'Serves 4, with extra sauce and onions', price: 220 },
  { id: 's1', categoryId: 'sides', name: 'Extra Crispy Onions', nameAr: 'بصل مقرمش زيادة', description: 'Freshly fried', price: 10 },
  { id: 's2', categoryId: 'sides', name: 'Extra Spicy Sauce (Shatta)', nameAr: 'شطة زيادة', description: 'Hot', price: 5 },
  { id: 's3', categoryId: 'sides', name: 'Garlic Vinegar (Da2a)', nameAr: 'دقة', description: 'Garlic and vinegar', price: 5 },
  { id: 'd1', categoryId: 'desserts', name: 'Rice Pudding', nameAr: 'أرز باللبن', description: 'Classic, with nuts', price: 25 },
  { id: 'd2', categoryId: 'desserts', name: 'Om Ali', nameAr: 'أم علي', description: 'Served warm', price: 40 },
  { id: 'r1', categoryId: 'drinks', name: 'Water', nameAr: 'مياه', description: '600 ml', price: 10 },
  { id: 'r2', categoryId: 'drinks', name: 'Soft Drink', nameAr: 'مشروب غازي', description: 'Can', price: 20 },
];

export const DELIVERY_FEE = 15; // EGP, demo value

export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered';

export const STATUS_FLOW: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];

export const STATUS_LABEL: Record<OrderStatus, { en: string; ar: string; hint: string }> = {
  received: { en: 'Order received', ar: 'طلب جديد', hint: 'The restaurant has your order.' },
  confirmed: { en: 'Confirmed', ar: 'في انتظار المطبخ', hint: 'The restaurant confirmed your order and sent it to the kitchen.' },
  preparing: { en: 'Preparing', ar: 'جاري التحضير', hint: 'Your food is being prepared.' },
  ready: { en: 'Ready', ar: 'جاهز', hint: 'Your order is ready and will leave with the driver soon.' },
  on_the_way: { en: 'On the way', ar: 'في الطريق', hint: 'The driver is on the way to you.' },
  delivered: { en: 'Delivered', ar: 'تم التوصيل', hint: 'Enjoy your meal!' },
};

// The button each status shows, and which staff role presses it.
export const NEXT_ACTION_AR: Record<OrderStatus, string | null> = {
  received: 'ابعت للمطبخ', // cashier
  confirmed: 'ابدأ التحضير', // kitchen
  preparing: 'الطلب جاهز', // kitchen
  ready: 'خرج للتوصيل', // cashier
  on_the_way: 'تم التوصيل', // cashier
  delivered: null,
};

export type Role = 'cashier' | 'kitchen';

export const ACTED_BY: Record<OrderStatus, Role | null> = {
  received: 'cashier',
  confirmed: 'kitchen',
  preparing: 'kitchen',
  ready: 'cashier',
  on_the_way: 'cashier',
  delivered: null,
};
