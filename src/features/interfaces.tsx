export type Products = {
  id: string;
  price: number;
  quantity: number;
  img: string;
  shipping_description: string;
  description: string;
  product: string;
  brand: string;
  category: string;
  enable: boolean;
};
export type Providers = {
  id: string;
  img: string;
  name: string;
  email: string;
  phone: string;
  enable: boolean;
};
export type SubAdmins = {
  id: string;
  name: string;
  email: string;
  phone: string;
  enable: boolean;
};
export type User = {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  status: boolean;
};
export type Brands = {
  id: string;
  img: string;
  name: string;
  category: string;
};
export type Categories = {
  id: string;
  img: string;
  name: string;
};
export type Ad = {
  id: string;
  ad_image: string;
  ad_link: string;
  ad_type: string;
  created_at: string;
};
export type Complaints = {
  id: string;
  created_at: string;
  details: string;
  email: string;
  phone: string;
  status: string;
  vendor_name: string;
  admin_reply: string;
};
export type Order = {
  order_id: string;
  user_name: string;
  order_status: string;
  created_at: string;
  total_price: string;
  email:string;
  phone:string
};
export type OrderProduct = {
  order_items_id: string;
  product_name: string;
  product_quantity: string;
  original_price: string;
  price_after_offer: string;
  vendor_name: string;
};
export type Review = {
  id: string;
  value: number;
  description: string;
  product_name: string;
  user_name: string;
  created_at: string;
};
