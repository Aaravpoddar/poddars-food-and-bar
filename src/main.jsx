import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Clock3,
  Flame,
  Lock,
  LogOut,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import './style.css';

const menu = [
  { id: 1, name: 'Butter Chicken', desc: 'Tandoori chicken in creamy tomato gravy', price: 289, category: 'Indian', color: 'coral', mark: 'BC', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Paneer Tikka Masala', desc: 'Charred paneer in rich makhani gravy', price: 249, category: 'Indian', color: 'cream', mark: 'PT', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Rajma Chawal', desc: 'Slow-cooked rajma with steamed basmati rice', price: 159, category: 'Indian', color: 'green', mark: 'RC', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Chicken Biryani', desc: 'Aromatic basmati, chicken, fried onions and raita', price: 249, category: 'Indian', color: 'blue', mark: 'CB', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Samosa Chaat', desc: 'Crisp samosa, chickpeas, chutneys and sev', price: 99, category: 'Starters', color: 'yellow', mark: 'SC', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Masala Dosa', desc: 'Crisp dosa, potato masala, sambar and chutney', price: 129, category: 'Dosa', color: 'purple', mark: 'MD', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Veg Hakka Noodles', desc: 'Wok-tossed noodles with crunchy vegetables', price: 169, category: 'Chinese', color: 'pink', mark: 'VN', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Chilli Chicken', desc: 'Crispy chicken, peppers and chilli sauce', price: 219, category: 'Chinese', color: 'orange', mark: 'CC', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Veg Manchurian', desc: 'Vegetable dumplings in a tangy soy sauce', price: 179, category: 'Chinese', color: 'green', mark: 'VM', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Chicken Fried Rice', desc: 'Wok-fried rice, chicken, egg and vegetables', price: 199, category: 'Chinese', color: 'coral', mark: 'FR', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
  { id: 11, name: 'Margherita Pizza', desc: 'Tomato, mozzarella and fresh basil', price: 229, category: 'Italian', color: 'yellow', mark: 'MP', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80' },
  { id: 12, name: 'White Sauce Pasta', desc: 'Penne, creamy herb sauce and sweet corn', price: 199, category: 'Italian', color: 'cream', mark: 'WP', image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?w=600&auto=format&fit=crop&q=80' },
  { id: 13, name: 'Chicken Alfredo Pasta', desc: 'Grilled chicken, penne and parmesan sauce', price: 269, category: 'Italian', color: 'blue', mark: 'CA', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80' },
  { id: 14, name: 'Veg Club Sandwich', desc: 'Grilled vegetables, cheese and house spread', price: 159, category: 'Continental', color: 'purple', mark: 'VS', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { id: 15, name: 'Crispy Chicken Burger', desc: 'Fried chicken, lettuce, cheese and fries', price: 229, category: 'Continental', color: 'orange', mark: 'CB', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { id: 16, name: 'French Fries', desc: 'Crisp golden fries with seasoning', price: 89, category: 'Starters', color: 'yellow', mark: 'FF', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80' },
  { id: 17, name: 'Gulab Jamun', desc: 'Warm milk dumplings in rose syrup', price: 79, category: 'Dessert', color: 'pink', mark: 'GJ', image: 'https://images.unsplash.com/photo-1605197143984-7e8894101e4a?w=600&auto=format&fit=crop&q=80' },
  { id: 18, name: 'Brownie with Ice Cream', desc: 'Warm chocolate brownie and vanilla scoop', price: 119, category: 'Dessert', color: 'coral', mark: 'BI', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' },
  { id: 19, name: 'Masala Chai', desc: 'Assam tea with ginger and cardamom', price: 35, category: 'Beverages', color: 'orange', mark: 'MC', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
  { id: 20, name: 'Fresh Lime Soda', desc: 'Sweet or salted chilled lime soda', price: 59, category: 'Beverages', color: 'green', mark: 'LS', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
  { id: 21, name: 'Mysore Masala Dosa', desc: 'Spicy red chutney, potato masala, sambar', price: 149, category: 'Dosa', color: 'coral', mark: 'MM', image: 'https://images.unsplash.com/photo-1681881858021-e0e6ebf5a894?w=600&auto=format&fit=crop&q=80' },
  { id: 22, name: 'Onion Rava Dosa', desc: 'Crispy semolina dosa with onion and pepper', price: 139, category: 'Dosa', color: 'yellow', mark: 'OR', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { id: 23, name: 'Cheese Dosa', desc: 'Golden dosa, cheese, potato masala and chutney', price: 159, category: 'Dosa', color: 'cream', mark: 'CD', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { id: 24, name: 'Plain Dosa', desc: 'Classic crisp dosa served with sambar and chutneys', price: 89, category: 'Dosa', color: 'green', mark: 'PD', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { id: 25, name: 'Butter Naan', desc: 'Soft tandoor-baked naan brushed with butter', price: 45, category: 'Breads', color: 'orange', mark: 'BN', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80' },
  { id: 26, name: 'Garlic Naan', desc: 'Tandoor naan with garlic, coriander and butter', price: 55, category: 'Breads', color: 'purple', mark: 'GN', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { id: 27, name: 'Tandoori Roti', desc: 'Whole-wheat bread straight from the tandoor', price: 25, category: 'Breads', color: 'yellow', mark: 'TR', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
  { id: 28, name: 'Laccha Paratha', desc: 'Flaky layered whole-wheat paratha', price: 45, category: 'Breads', color: 'blue', mark: 'LP', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { id: 29, name: 'Rasmalai', desc: 'Saffron milk dumplings with pistachio', price: 99, category: 'Dessert', color: 'cream', mark: 'RM', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80' },
  { id: 30, name: 'Kulfi Falooda', desc: 'Malai kulfi, vermicelli, basil seeds and rose syrup', price: 109, category: 'Dessert', color: 'pink', mark: 'KF', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80' },
  { id: 31, name: 'Ice Cream Sundae', desc: 'Vanilla ice cream, chocolate sauce and nuts', price: 89, category: 'Dessert', color: 'blue', mark: 'IS', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80' },
  { id: 32, name: 'Carrot Halwa', desc: 'Slow-cooked gajar halwa with almonds', price: 79, category: 'Dessert', color: 'orange', mark: 'GH', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80' },
  { id: 33, name: 'Dal Makhani', desc: 'Creamy black lentils slow-cooked overnight', price: 189, category: 'Indian', color: 'purple', mark: 'DM', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
  { id: 34, name: 'Kadai Paneer', desc: 'Paneer, capsicum and onion in a spiced gravy', price: 239, category: 'Indian', color: 'coral', mark: 'KP', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { id: 35, name: 'Veg Thali', desc: 'Dal, seasonal vegetables, rice, roti and salad', price: 199, category: 'Indian', color: 'yellow', mark: 'VT', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80' },
  { id: 36, name: 'Idli Sambar', desc: 'Four soft idlis with sambar and chutneys', price: 99, category: 'Dosa', color: 'cream', mark: 'IS', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { id: 37, name: 'Spring Rolls', desc: 'Crisp vegetable rolls with sweet chilli dip', price: 129, category: 'Starters', color: 'green', mark: 'SR', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
  { id: 38, name: 'Chicken Tikka', desc: 'Char-grilled chicken with mint chutney', price: 249, category: 'Starters', color: 'orange', mark: 'CT', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80' },
  { id: 39, name: 'Mexican Veg Pizza', desc: 'Corn, peppers, jalapenos and mozzarella', price: 259, category: 'Italian', color: 'pink', mark: 'MX', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { id: 40, name: 'Grilled Chicken Sandwich', desc: 'Herbed chicken, lettuce, cheese and fries', price: 219, category: 'Continental', color: 'blue', mark: 'GS', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { id: 41, name: 'Cold Coffee', desc: 'Creamy chilled coffee with vanilla ice cream', price: 89, category: 'Beverages', color: 'cream', mark: 'CF', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80' },
  { id: 42, name: 'Mango Lassi', desc: 'Thick yogurt drink with ripe mango', price: 79, category: 'Beverages', color: 'yellow', mark: 'ML', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&auto=format&fit=crop&q=80' },
  { id: 43, name: 'Chole Bhature', desc: 'Spiced chickpeas with fluffy fried bread', price: 159, category: 'Indian', color: 'orange', mark: 'CB', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' },
  { id: 44, name: 'Palak Paneer', desc: 'Paneer in a smooth spinach and garlic gravy', price: 229, category: 'Indian', color: 'green', mark: 'PP', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { id: 45, name: 'Chicken Curry', desc: 'Home-style chicken curry with warming spices', price: 269, category: 'Indian', color: 'coral', mark: 'CC', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80' },
  { id: 46, name: 'Podi Dosa', desc: 'Crisp dosa dusted with spiced lentil powder', price: 139, category: 'Dosa', color: 'orange', mark: 'PD', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { id: 47, name: 'Stuffed Kulcha', desc: 'Tandoor bread filled with potato and spices', price: 75, category: 'Breads', color: 'yellow', mark: 'SK', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80' },
  { id: 48, name: 'Missi Roti', desc: 'Spiced gram flour and wheat flatbread', price: 35, category: 'Breads', color: 'cream', mark: 'MR', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
  { id: 49, name: 'Cheese Garlic Bread', desc: 'Toasted bread with garlic butter and cheese', price: 89, category: 'Breads', color: 'pink', mark: 'GB', image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=600&auto=format&fit=crop&q=80' },
  { id: 50, name: 'Veg Schezwan Rice', desc: 'Wok-fried rice in a bold schezwan sauce', price: 179, category: 'Chinese', color: 'red', mark: 'SR', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
  { id: 51, name: 'Chicken Momos', desc: 'Steamed chicken dumplings with chilli chutney', price: 149, category: 'Chinese', color: 'blue', mark: 'CM', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80' },
  { id: 52, name: 'Honey Chilli Potato', desc: 'Crisp potato tossed in sweet chilli sauce', price: 139, category: 'Chinese', color: 'yellow', mark: 'HP', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' },
  { id: 53, name: 'Sweet Corn Soup', desc: 'Comforting soup with corn and vegetables', price: 99, category: 'Chinese', color: 'cream', mark: 'CS', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80' },
  { id: 54, name: 'Veg Arrabbiata Pasta', desc: 'Penne in a spicy tomato and herb sauce', price: 189, category: 'Italian', color: 'coral', mark: 'AP', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80' },
  { id: 55, name: 'Farmhouse Pizza', desc: 'Mushroom, corn, peppers and mozzarella', price: 279, category: 'Italian', color: 'green', mark: 'FP', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80' },
  { id: 56, name: 'Chicken Lasagna', desc: 'Layers of chicken, pasta and béchamel sauce', price: 299, category: 'Italian', color: 'orange', mark: 'CL', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&auto=format&fit=crop&q=80' },
  { id: 57, name: 'Veg Burger', desc: 'Crispy veg patty, cheese and fries', price: 169, category: 'Continental', color: 'green', mark: 'VB', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80' },
  { id: 58, name: 'Fish and Chips', desc: 'Crispy fish fillet with seasoned fries', price: 279, category: 'Continental', color: 'blue', mark: 'FC', image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&auto=format&fit=crop&q=80' },
  { id: 59, name: 'Grilled Veggies', desc: 'Seasonal vegetables with herb butter', price: 149, category: 'Continental', color: 'purple', mark: 'GV', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
  { id: 60, name: 'Tomato Basil Soup', desc: 'Creamy tomato soup with croutons', price: 99, category: 'Continental', color: 'coral', mark: 'TS', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80' },
  { id: 61, name: 'Paneer Tikka', desc: 'Char-grilled paneer with mint chutney', price: 199, category: 'Starters', color: 'yellow', mark: 'PK', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80' },
  { id: 62, name: 'Nachos Supreme', desc: 'Crisp nachos, salsa, beans and cheese', price: 169, category: 'Starters', color: 'orange', mark: 'NS', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80' },
  { id: 63, name: 'Crispy Corn', desc: 'Golden fried corn with spices and lime', price: 129, category: 'Starters', color: 'green', mark: 'CC', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80' },
  { id: 64, name: 'Kesar Pista Kulfi', desc: 'Traditional saffron and pistachio kulfi', price: 89, category: 'Dessert', color: 'cream', mark: 'KP', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80' },
  { id: 65, name: 'Chocolate Shake', desc: 'Thick chocolate shake with a scoop of ice cream', price: 99, category: 'Beverages', color: 'coral', mark: 'CS', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
  { id: 66, name: 'Virgin Mojito', desc: 'Mint, lime and sparkling soda', price: 89, category: 'Beverages', color: 'green', mark: 'VM', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { id: 67, name: 'Iced Tea', desc: 'Chilled lemon tea with mint', price: 69, category: 'Beverages', color: 'orange', mark: 'IT', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80' },
  { id: 92, name: 'Red Bull Energy Drink (Can)', desc: 'Chilled iconic energy drink to vitalize body and mind', price: 165, category: 'Beverages', color: 'blue', mark: 'RB', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { id: 93, name: 'Red Bull Sugarfree (Can)', desc: 'Wings without sugar, crisp and chilled', price: 165, category: 'Beverages', color: 'blue', mark: 'RS', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' },
  { id: 94, name: 'Monster Energy Drink (Can)', desc: 'Smooth, bold energy blend with an intense punch', price: 175, category: 'Beverages', color: 'green', mark: 'ME', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' },
  { id: 95, name: 'Ginger Ale (Can)', desc: 'Crisp, sparkling spiced ginger refresher', price: 89, category: 'Beverages', color: 'yellow', mark: 'GA', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
  { id: 96, name: 'Tonic Water (Can)', desc: 'Effervescent botanical mixer with subtle citrus notes', price: 89, category: 'Beverages', color: 'blue', mark: 'TW', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80' },
  { id: 97, name: 'Diet Coke / Coke Zero (Can)', desc: 'Crisp, chilled zero-calorie sparkling cola', price: 69, category: 'Beverages', color: 'red', mark: 'DC', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' },
  { id: 98, name: 'Coca-Cola / Thums Up (Can)', desc: 'Classic chilled carbonated soda', price: 59, category: 'Beverages', color: 'red', mark: 'CC', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' },
  { id: 99, name: 'Blue Lagoon Mocktail', desc: 'Curacao syrup, crushed ice, lemon and fizzy sprite', price: 129, category: 'Beverages', color: 'blue', mark: 'BL', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { id: 100, name: 'Fresh Watermelon Mint Juice', desc: 'Cold-pressed natural watermelon juice with fresh mint', price: 109, category: 'Beverages', color: 'pink', mark: 'WM', image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=600&auto=format&fit=crop&q=80' },
  { id: 101, name: 'Perrier Sparkling Water', desc: 'Natural sparkling mineral water from France (330ml)', price: 159, category: 'Beverages', color: 'green', mark: 'PW', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80' },
  { id: 102, name: 'Sweet / Salted Lassi', desc: 'Traditional creamy churned yogurt drink with cardamom', price: 79, category: 'Beverages', color: 'cream', mark: 'SL', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&auto=format&fit=crop&q=80' },
  // Alcohol & Bar Section
  { id: 68, name: 'Kingfisher Ultra (Pint)', desc: 'Crisp, premium lager with smooth malt finish', price: 249, category: 'Alcohol', color: 'yellow', mark: 'KF', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80' },
  { id: 69, name: 'Corona Extra with Lime', desc: 'Imported Mexican lager served with fresh lime', price: 349, category: 'Alcohol', color: 'yellow', mark: 'CE', image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=600&auto=format&fit=crop&q=80' },
  { id: 70, name: 'Bira 91 White Wheat Beer', desc: 'Aromatic Belgian style wheat beer with citrus & coriander', price: 299, category: 'Alcohol', color: 'orange', mark: 'BW', image: 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=600&auto=format&fit=crop&q=80' },
  { id: 71, name: 'Heineken Silver (Pint)', desc: 'Smooth, easy-drinking crisp European lager', price: 289, category: 'Alcohol', color: 'green', mark: 'HN', image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&auto=format&fit=crop&q=80' },
  { id: 72, name: 'Budweiser Magnum', desc: 'Super-premium strong craft lager with rich maltiness', price: 279, category: 'Alcohol', color: 'coral', mark: 'BM', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80' },
  { id: 73, name: 'Long Island Iced Tea (LIIT)', desc: 'Vodka, gin, rum, tequila, triple sec & cola splash', price: 479, category: 'Alcohol', color: 'coral', mark: 'LI', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80' },
  { id: 74, name: 'Classic Old Fashioned', desc: 'Bourbon whiskey, aromatic bitters, orange peel & cane sugar', price: 449, category: 'Alcohol', color: 'orange', mark: 'OF', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80' },
  { id: 75, name: 'Smoked Whiskey Sour', desc: 'Bourbon whiskey, fresh citrus juice & aromatic bitters', price: 429, category: 'Alcohol', color: 'cream', mark: 'WS', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&auto=format&fit=crop&q=80' },
  { id: 76, name: 'Botanical Gin & Tonic', desc: 'Artisanal dry gin, elderflower tonic & fresh rosemary', price: 399, category: 'Alcohol', color: 'blue', mark: 'GT', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { id: 77, name: 'Espresso Martini', desc: 'Vodka, fresh espresso shot, Kahlúa coffee liqueur', price: 429, category: 'Alcohol', color: 'purple', mark: 'EM', image: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?w=600&auto=format&fit=crop&q=80' },
  { id: 78, name: 'Passionfruit Spiked Mojito', desc: 'White rum, passionfruit pulp, fresh mint & sparkling soda', price: 369, category: 'Alcohol', color: 'green', mark: 'PM', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
  { id: 79, name: 'Cosmopolitan Cocktail', desc: 'Citron vodka, triple sec, cranberry & flamed orange twist', price: 389, category: 'Alcohol', color: 'pink', mark: 'CP', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&auto=format&fit=crop&q=80' },
  { id: 80, name: 'Spicy Mango Margarita', desc: 'Tequila, triple sec, sweet mango, lime & tajín chili rim', price: 419, category: 'Alcohol', color: 'yellow', mark: 'MM', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80' },
  { id: 81, name: 'Glenfiddich 12 Yrs (60ml)', desc: 'Speyside single malt scotch with fresh pear & subtle oak', price: 599, category: 'Alcohol', color: 'amber', mark: 'GF', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=80' },
  { id: 82, name: 'Johnnie Walker Black (60ml)', desc: 'Iconic 12-year blended scotch with deep smoky notes', price: 499, category: 'Alcohol', color: 'orange', mark: 'JW', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop&q=80' },
  { id: 83, name: 'Jameson Irish Whiskey (60ml)', desc: 'Triple-distilled Irish whiskey with smooth vanilla finish', price: 429, category: 'Alcohol', color: 'green', mark: 'JM', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=80' },
  { id: 84, name: 'Grey Goose Vodka (60ml)', desc: 'Ultra-premium French wheat vodka on rocks or mixer', price: 469, category: 'Alcohol', color: 'blue', mark: 'GG', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop&q=80' },
  { id: 85, name: 'Bombay Sapphire Gin (60ml)', desc: 'Vapour-infused London dry gin with 10 exotic botanicals', price: 399, category: 'Alcohol', color: 'blue', mark: 'BS', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { id: 86, name: 'Bacardi Carta Blanca Rum (60ml)', desc: 'Classic superior white rum with subtle almond & floral notes', price: 299, category: 'Alcohol', color: 'cream', mark: 'BC', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80' },
  { id: 87, name: 'Patrón Silver Tequila Shot', desc: '100% blue agave premium tequila with sea salt & lime', price: 349, category: 'Alcohol', color: 'green', mark: 'PT', image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=600&auto=format&fit=crop&q=80' },
  { id: 88, name: 'Jägermeister Shot', desc: 'Legendary German herbal liqueur with 56 herbs & spices', price: 329, category: 'Alcohol', color: 'purple', mark: 'JM', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80' },
  { id: 89, name: 'Jacob’s Creek Cabernet (Glass)', desc: 'Australian red wine with ripe blackcurrant & oak notes', price: 399, category: 'Alcohol', color: 'wine', mark: 'JC', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80' },
  { id: 90, name: 'Sula Sauvignon Blanc (Glass)', desc: 'Crisp Indian white wine with refreshing aromas of guava', price: 349, category: 'Alcohol', color: 'yellow', mark: 'SB', image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=600&auto=format&fit=crop&q=80' },
  { id: 91, name: 'Chandon Brut Sparkling (Glass)', desc: 'Elegant sparkling bubbly with green apple and brioche notes', price: 499, category: 'Alcohol', color: 'cream', mark: 'CB', image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=600&auto=format&fit=crop&q=80' }
];

const eatingOrder = ['Starters', 'Dosa', 'Chinese', 'Italian', 'Continental', 'Indian', 'Breads', 'Dessert', 'Beverages', 'Alcohol'];
const categories = ['All', ...eatingOrder];
const nonVegIds = new Set([1, 4, 8, 10, 13, 15, 38, 40, 45, 51, 56, 58]);
const formatPrice = amount => `₹${Math.round(amount).toLocaleString('en-IN')}`;

function playKitchenChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // AudioContext might be restricted until user interaction
  }
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffSec = Math.floor((now - past) / 1000);
  if (diffSec < 45) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
}

// -------------------------------------------------------------
// GUEST LOGIN / TABLE CHECK-IN MODAL
// -------------------------------------------------------------
function GuestLoginModal({ guest, onSaveGuest, isOpen, onClose }) {
  const [name, setName] = useState(guest?.name || '');
  const [table, setTable] = useState(guest?.table || 'Table 1');
  const [diningMode, setDiningMode] = useState(guest?.mode || 'Dine in');
  const [error, setError] = useState('');

  useEffect(() => {
    if (guest) {
      setName(guest.name || '');
      setTable(guest.table || 'Table 1');
      setDiningMode(guest.mode || 'Dine in');
    }
  }, [guest, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    setError('');
    onSaveGuest({
      name: name.trim(),
      table: diningMode === 'Dine in' ? (table.trim() || 'Table 1') : null,
      mode: diningMode
    });
  };

  if (!isOpen) return null;

  const quickTables = [
    'Table 1', 'Table 2', 'Table 3', 'Table 4',
    'Table 5', 'Table 6', 'Table 7', 'Table 8',
    'Table 9', 'Table 10', 'Table 11', 'Table 12'
  ];

  return (
    <div className="guest-login-overlay" onClick={guest?.name ? onClose : undefined}>
      <div className="guest-login-card" onClick={e => e.stopPropagation()}>
        <div className="brand-mark guest-modal-logo">
          <UtensilsCrossed size={20} />
        </div>
        <h2>Welcome to The Poddar's</h2>
        <p className="guest-login-sub">Please enter your name & table to begin dining</p>

        {error && (
          <div className="chef-login-error">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="guest-form">
          <div className="chef-input-group">
            <label><User size={13} /> Your Name / Party Name</label>
            <div className="chef-input-box">
              <User size={16} />
              <input
                placeholder="e.g. Aarav Poddar"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="chef-input-group" style={{ marginTop: '14px' }}>
            <label><UtensilsCrossed size={13} /> Dining Preference</label>
            <div className="mode-switch" style={{ width: '100%', margin: 0, padding: '4px' }}>
              <button
                type="button"
                className={diningMode === 'Dine in' ? 'active' : ''}
                onClick={() => setDiningMode('Dine in')}
                style={{ padding: '10px 8px', justifyContent: 'center' }}
              >
                <UtensilsCrossed size={15} />
                <span>Dine In</span>
              </button>
              <button
                type="button"
                className={diningMode === 'Self pickup' ? 'active' : ''}
                onClick={() => setDiningMode('Self pickup')}
                style={{ padding: '10px 8px', justifyContent: 'center' }}
              >
                <ShoppingBag size={15} />
                <span>Takeaway / Pickup</span>
              </button>
            </div>
          </div>

          {diningMode === 'Dine in' && (
            <div className="chef-input-group" style={{ marginTop: '14px' }}>
              <label><MapPin size={13} /> Select or Enter Table Number</label>
              <div className="guest-table-grid">
                {quickTables.map(t => (
                  <button
                    type="button"
                    key={t}
                    className={`guest-table-chip ${table === t ? 'selected' : ''}`}
                    onClick={() => setTable(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="chef-input-box" style={{ marginTop: '8px' }}>
                <MapPin size={16} />
                <input
                  placeholder="Or custom: Table 15, VIP Lounge, Terrace 2"
                  value={table}
                  onChange={e => setTable(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="chef-login-btn" style={{ marginTop: '18px' }}>
            <span>Explore Menu & Start Order →</span>
          </button>

          {guest?.name && (
            <button
              type="button"
              className="chef-back-link"
              onClick={onClose}
              style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
            >
              Keep Current Details
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CHEF LOGIN SCREEN COMPONENT
// -------------------------------------------------------------
function ChefLogin({ onLogin, onBackToMenu }) {
  const [name, setName] = useState('');
  const [chefId, setChefId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !chefId.trim()) {
      setError('Please enter both your Chef Name and Staff ID.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chef/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), chefId: chefId.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
      onLogin(data.chef, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (quickName, quickId) => {
    setName(quickName);
    setChefId(quickId);
    setError('');
  };

  return (
    <div className="chef-login-screen">
      <div className="chef-login-card">
        <div className="chef-login-badge">
          <ChefHat size={32} />
        </div>
        <h2>Kitchen Portal Access</h2>
        <p className="chef-login-subtitle">The Poddar's Kitchen Display System (KDS)</p>

        {error && (
          <div className="chef-login-error">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="chef-login-form">
          <div className="chef-input-group">
            <label><User size={13} /> Chef Name</label>
            <div className="chef-input-box">
              <User size={16} />
              <input
                placeholder="e.g. Chef Aarav"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="chef-input-group">
            <label><Lock size={13} /> Staff ID / Passcode</label>
            <div className="chef-input-box">
              <Lock size={16} />
              <input
                placeholder="e.g. CHEF-001 or 1234"
                value={chefId}
                onChange={e => setChefId(e.target.value)}
              />
            </div>
          </div>

          <div className="chef-quick-select">
            <span>Quick Staff Login</span>
            <div className="chef-chips">
              <button
                type="button"
                className="chef-chip-btn"
                onClick={() => handleQuickSelect('Chef Aarav', 'CHEF-001')}
              >
                👨‍🍳 Chef Aarav (CHEF-001)
              </button>
              <button
                type="button"
                className="chef-chip-btn"
                onClick={() => handleQuickSelect('Chef Vikram', 'CHEF-002')}
              >
                👨‍🍳 Chef Vikram (CHEF-002)
              </button>
              <button
                type="button"
                className="chef-chip-btn"
                onClick={() => handleQuickSelect('Executive Chef', '1234')}
              >
                👑 Master Chef (1234)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="chef-login-btn"
            disabled={loading}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Authenticating...' : 'Enter Kitchen Display →'}</span>
          </button>
        </form>

        <button
          type="button"
          className="chef-back-link"
          onClick={onBackToMenu}
        >
          <ArrowLeft size={14} /> Back to Guest Menu
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CHEF KITCHEN PORTAL (KDS) COMPONENT
// -------------------------------------------------------------
function ChefPortal({ chefAuth, onLogout, onViewCustomerMenu, onOrderStatsChange }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0, preparingCount: 0, readyCount: 0, completedToday: 0, revenueToday: 0 });
  const [activeTab, setActiveTab] = useState('New'); // 'New' | 'Preparing' | 'Ready' | 'AllActive' | 'History'
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Kitchen unable to fulfill order at this time.');
  const [prepTimes, setPrepTimes] = useState({}); // { [orderId]: 15 }
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const prevPendingCount = useRef(0);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrdersAndStats = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/stats')
      ]);
      if (ordersRes.ok && statsRes.ok) {
        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();
        setOrders(ordersData);
        setStats(statsData);
        if (onOrderStatsChange) onOrderStatsChange(statsData);

        // Chime if new orders arrived
        if (statsData.pendingCount > prevPendingCount.current && soundEnabled) {
          playKitchenChime();
        }
        prevPendingCount.current = statsData.pendingCount;
      }
    } catch (err) {
      console.error('Failed to fetch kitchen data:', err);
    }
  };

  // SSE Stream and Polling fallback
  useEffect(() => {
    fetchOrdersAndStats();

    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('order:created', (e) => {
        const newOrder = JSON.parse(e.data);
        setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
        fetchOrdersAndStats();
        if (soundEnabled) playKitchenChime();
      });
      eventSource.addEventListener('order:updated', (e) => {
        const updatedOrder = JSON.parse(e.data);
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        fetchOrdersAndStats();
      });
      eventSource.addEventListener('order:deleted', (e) => {
        const { id } = JSON.parse(e.data);
        setOrders(prev => prev.filter(o => o.id !== id));
        fetchOrdersAndStats();
      });
    } catch (e) {
      console.warn('SSE not available, falling back to polling');
    }

    const interval = setInterval(fetchOrdersAndStats, 4000);
    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, [soundEnabled]);

  const handleApprove = async (orderId) => {
    const prepTime = prepTimes[orderId] || 15;
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prepTime,
          approvedBy: chefAuth?.name || 'Chef'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        fetchOrdersAndStats();
      }
    } catch (err) {
      alert('Failed to approve order.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        fetchOrdersAndStats();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingOrder) return;
    try {
      const res = await fetch(`/api/orders/${rejectingOrder.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        setRejectingOrder(null);
        fetchOrdersAndStats();
      }
    } catch (err) {
      alert('Failed to reject order.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Remove this order ticket from kitchen history?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        fetchOrdersAndStats();
      }
    } catch (err) {
      alert('Failed to remove order.');
    }
  };

  const handleSeedDemoOrder = async () => {
    const demoItems = [
      { id: 1, name: 'Butter Chicken', price: 289, qty: 1, color: 'coral', mark: 'BC' },
      { id: 25, name: 'Butter Naan', price: 45, qty: 2, color: 'orange', mark: 'BN' },
      { id: 19, name: 'Masala Chai', price: 35, qty: 2, color: 'orange', mark: 'MC' }
    ];
    const subtotal = 449;
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'Dine in',
          table: `Table ${Math.floor(Math.random() * 18) + 1}`,
          items: demoItems,
          instructions: 'Extra spicy Butter Chicken, serve hot naan with melted butter.',
          subtotal,
          gst,
          total
        })
      });
      fetchOrdersAndStats();
    } catch (e) {
      alert('Failed to create demo order.');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      let matchesTab = true;
      if (activeTab === 'New') matchesTab = o.status === 'New';
      else if (activeTab === 'Preparing') matchesTab = o.status === 'Preparing';
      else if (activeTab === 'Ready') matchesTab = o.status === 'Ready';
      else if (activeTab === 'AllActive') matchesTab = o.status === 'New' || o.status === 'Preparing' || o.status === 'Ready';
      else if (activeTab === 'History') matchesTab = o.status === 'Completed' || o.status === 'Cancelled';

      let matchesSearch = true;
      if (search.trim()) {
        const q = search.toLowerCase();
        matchesSearch = (
          o.id.toLowerCase().includes(q) ||
          (o.table && o.table.toLowerCase().includes(q)) ||
          (o.guestName && o.guestName.toLowerCase().includes(q)) ||
          o.mode?.toLowerCase().includes(q) ||
          (o.items && o.items.some(i => i.name.toLowerCase().includes(q)))
        );
      }
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  return (
    <div className="kds-container">
      {/* Topbar with Chef Profile */}
      <div className="kds-topbar">
        <div className="kds-title">
          <ChefHat size={28} color="var(--lime)" />
          <div>
            <h1>Kitchen Display System (KDS)</h1>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Live order queue & preparation management</span>
          </div>
          <div className="kds-live-clock">
            <Clock size={14} />
            <span>{currentTime}</span>
          </div>
        </div>

        <div className="kds-actions-bar">
          {/* Chef User Pill */}
          <div className="chef-user-pill">
            <div className="chef-avatar">
              {chefAuth?.name?.charAt(0) || 'C'}
            </div>
            <div className="chef-user-details">
              <span className="chef-user-name">{chefAuth?.name || 'Chef'}</span>
              <span className="chef-user-id">{chefAuth?.role || 'Staff'} • {chefAuth?.id || ''}</span>
            </div>
            <button
              type="button"
              className="chef-logout-btn"
              onClick={onLogout}
              title="Log out of kitchen"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>

          <button
            type="button"
            className={'kds-btn-tool ' + (soundEnabled ? 'active' : '')}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Audio alerts active' : 'Audio alerts muted'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          <button
            type="button"
            className="kds-btn-tool"
            onClick={fetchOrdersAndStats}
            title="Refresh orders"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="kds-btn-tool"
            onClick={handleSeedDemoOrder}
            style={{ borderColor: 'var(--lime)', color: 'var(--lime)' }}
          >
            <Plus size={15} />
            <span>+ Simulate Order</span>
          </button>

          <button
            type="button"
            className="kds-btn-tool"
            onClick={onViewCustomerMenu}
            title="Open customer menu view"
          >
            <UtensilsCrossed size={15} />
            <span>Guest Menu</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="kds-stats-row">
        <div className={'kds-stat-card ' + (stats.pendingCount > 0 ? 'alert' : '')}>
          <div className="stat-icon-box pending">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-val">{stats.pendingCount}</span>
            <span className="stat-lbl">Needs Approval</span>
          </div>
        </div>

        <div className="kds-stat-card">
          <div className="stat-icon-box cooking">
            <Flame size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-val">{stats.preparingCount}</span>
            <span className="stat-lbl">Cooking / In Kitchen</span>
          </div>
        </div>

        <div className="kds-stat-card">
          <div className="stat-icon-box ready">
            <UtensilsCrossed size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-val">{stats.readyCount}</span>
            <span className="stat-lbl">Ready to Serve</span>
          </div>
        </div>

        <div className="kds-stat-card">
          <div className="stat-icon-box completed">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-val">{stats.completedToday}</span>
            <span className="stat-lbl">Completed Today</span>
          </div>
        </div>

        <div className="kds-stat-card">
          <div className="stat-icon-box" style={{ background: '#22301e', color: 'var(--lime)' }}>
            <b>₹</b>
          </div>
          <div className="stat-data">
            <span className="stat-val">{formatPrice(stats.revenueToday)}</span>
            <span className="stat-lbl">Today's Revenue</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="kds-filter-bar">
        <div className="kds-tab-pills">
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'New' ? 'active' : '')}
            onClick={() => setActiveTab('New')}
          >
            <span>Needs Approval</span>
            <b className="kds-tab-count">{stats.pendingCount}</b>
          </button>
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'Preparing' ? 'active' : '')}
            onClick={() => setActiveTab('Preparing')}
          >
            <span>Cooking</span>
            <b className="kds-tab-count">{stats.preparingCount}</b>
          </button>
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'Ready' ? 'active' : '')}
            onClick={() => setActiveTab('Ready')}
          >
            <span>Ready</span>
            <b className="kds-tab-count">{stats.readyCount}</b>
          </button>
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'AllActive' ? 'active' : '')}
            onClick={() => setActiveTab('AllActive')}
          >
            <span>All Active</span>
            <b className="kds-tab-count">{stats.pendingCount + stats.preparingCount + stats.readyCount}</b>
          </button>
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'History' ? 'active' : '')}
            onClick={() => setActiveTab('History')}
          >
            <span>History</span>
          </button>
        </div>

        <div className="kds-search">
          <Search size={15} />
          <input
            placeholder="Search tickets, table #, items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="kds-orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const selectedPrep = prepTimes[order.id] || order.estimatedPrepTime || 15;
            return (
              <div
                key={order.id}
                className={`kds-card status-${order.status?.toLowerCase() || 'new'}`}
              >
                {/* Header */}
                <div className="kds-card-head">
                  <div>
                    <div className="kds-order-num">
                      <span>#{order.id}</span>
                    </div>
                    <span className="kds-order-type">
                      {order.mode === 'Dine in' ? `🍽️ ${order.table || 'Table 1'}` : '🛍️ Self Pickup'}
                      {order.guestName ? ` • 👤 ${order.guestName}` : ''}
                    </span>
                  </div>
                  <span className={`kds-badge badge-${order.status?.toLowerCase() || 'new'}`}>
                    {order.status === 'New' ? 'Needs Approval' : order.status}
                  </span>
                </div>

                {/* Metadata */}
                <div className="kds-card-meta">
                  <span>Ordered {timeAgo(order.createdAt)}</span>
                  <span className="kds-elapsed">
                    <Clock size={12} />
                    {order.estimatedPrepTime ? `${order.estimatedPrepTime} min prep` : 'Pending prep'}
                  </span>
                </div>

                {/* Items */}
                <div className="kds-items-list">
                  {order.items?.map((item, idx) => (
                    <div className="kds-item-row" key={idx}>
                      <div className="kds-item-main">
                        <span className="kds-qty-badge">{item.qty}×</span>
                        <span className="kds-item-name">{item.name}</span>
                      </div>
                      <span className="kds-item-price">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Cooking Instructions Notice */}
                {order.instructions ? (
                  <div className="kds-instructions-alert">
                    <AlertTriangle size={16} />
                    <div>
                      <b>Guest Cooking Request:</b>
                      <span>"{order.instructions}"</span>
                    </div>
                  </div>
                ) : null}

                {/* Approved By Chef Tag */}
                {order.approvedBy && (
                  <div className="kds-chef-note-box">
                    👨‍🍳 <b>Approved by:</b> {order.approvedBy}
                  </div>
                )}

                {/* Rejection Reason Display */}
                {order.status === 'Cancelled' && order.rejectionReason && (
                  <div className="kds-instructions-alert" style={{ borderColor: '#ef5350', background: '#301818' }}>
                    <X size={16} color="#ef5350" />
                    <div>
                      <b style={{ color: '#ef5350' }}>Rejection Reason:</b>
                      <span style={{ color: '#ffcdd2' }}>{order.rejectionReason}</span>
                    </div>
                  </div>
                )}

                {/* Footer and Actions */}
                <div className="kds-card-footer">
                  <div className="kds-totals-summary">
                    <span>{order.items?.reduce((s, i) => s + i.qty, 0)} items total</span>
                    <b>Total: {formatPrice(order.total)}</b>
                  </div>

                  {/* Status: NEW (Needs Approval) */}
                  {order.status === 'New' && (
                    <>
                      <div className="kds-prep-selector">
                        <span>Prep:</span>
                        {[10, 15, 20, 30].map(mins => (
                          <button
                            key={mins}
                            type="button"
                            className={`kds-prep-btn ${selectedPrep === mins ? 'selected' : ''}`}
                            onClick={() => setPrepTimes(prev => ({ ...prev, [order.id]: mins }))}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>

                      <div className="kds-action-buttons">
                        <button
                          type="button"
                          className="kds-btn-approve"
                          onClick={() => handleApprove(order.id)}
                        >
                          <Check size={16} />
                          <span>Approve ({selectedPrep}m)</span>
                        </button>
                        <button
                          type="button"
                          className="kds-btn-reject"
                          onClick={() => setRejectingOrder(order)}
                          title="Reject Order"
                        >
                          <X size={15} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Status: PREPARING (Cooking) */}
                  {order.status === 'Preparing' && (
                    <div className="kds-action-buttons">
                      <button
                        type="button"
                        className="kds-btn-ready"
                        onClick={() => handleStatusChange(order.id, 'Ready')}
                      >
                        <UtensilsCrossed size={16} />
                        <span>Mark Food Ready</span>
                      </button>
                    </div>
                  )}

                  {/* Status: READY (Food Ready for serving) */}
                  {order.status === 'Ready' && (
                    <div className="kds-action-buttons">
                      <button
                        type="button"
                        className="kds-btn-complete"
                        onClick={() => handleStatusChange(order.id, 'Completed')}
                      >
                        <CheckCircle2 size={16} />
                        <span>Mark Served / Complete</span>
                      </button>
                    </div>
                  )}

                  {/* Status: COMPLETED or CANCELLED */}
                  {(order.status === 'Completed' || order.status === 'Cancelled') && (
                    <div className="kds-action-buttons">
                      <span style={{ fontSize: '11px', color: 'var(--muted)', alignSelf: 'center' }}>
                        {order.status === 'Completed' ? '✓ Served' : '✕ Cancelled'}
                      </span>
                      <button
                        type="button"
                        className="kds-btn-delete"
                        onClick={() => handleDelete(order.id)}
                        title="Delete ticket"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="kds-empty-state">
            <ChefHat size={44} />
            <h3>No orders in this view</h3>
            <p>
              {activeTab === 'New'
                ? 'All incoming orders have been reviewed and approved.'
                : 'No order tickets match the selected filter.'}
            </p>
            <button
              type="button"
              className="kds-btn-tool"
              onClick={handleSeedDemoOrder}
              style={{ display: 'inline-flex', margin: '0 auto' }}
            >
              <Plus size={15} /> Create a Test Order
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingOrder && (
        <div className="kds-modal-overlay" onClick={() => setRejectingOrder(null)}>
          <div className="kds-modal-box" onClick={e => e.stopPropagation()}>
            <h3>Reject Order #{rejectingOrder.id}</h3>
            <p>Provide a reason for the guest (e.g. ingredient unavailable, kitchen at max capacity):</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="kds-modal-actions">
              <button
                type="button"
                className="kds-modal-cancel"
                onClick={() => setRejectingOrder(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="kds-modal-confirm-reject"
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// LIVE CUSTOMER ORDER TRACKER COMPONENT
// -------------------------------------------------------------
function CustomerTracker({ orderId, onClose, onNewOrder }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) setOrder(await res.json());
      } catch (err) {
        console.error('Tracker error:', err);
      }
    };
    fetchOrder();

    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('order:updated', (e) => {
        const updated = JSON.parse(e.data);
        if (updated.id === orderId) setOrder(updated);
      });
    } catch {}

    const interval = setInterval(fetchOrder, 3000);
    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, [orderId]);

  if (!order) return null;

  const isApproved = order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Completed';
  const isReady = order.status === 'Ready' || order.status === 'Completed';
  const isCompleted = order.status === 'Completed';
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <h4>
          <Flame size={18} color="var(--lime)" />
          Live Kitchen Tracking: #{order.id}
        </h4>
        <button type="button" onClick={onClose} aria-label="Close tracker">
          <X size={18} />
        </button>
      </div>

      {isCancelled ? (
        <div style={{ padding: '10px 0', textAlign: 'center' }}>
          <div style={{ color: '#ef5350', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
            Order Cancelled by Kitchen
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
            {order.rejectionReason || 'The kitchen was unable to fulfill your order at this time.'}
          </p>
        </div>
      ) : (
        <div className="tracker-stepper">
          {/* Step 1 */}
          <div className={`tracker-step ${isApproved ? 'completed' : 'current'}`}>
            <div className="tracker-step-indicator">
              {isApproved ? <Check size={14} /> : '1'}
            </div>
            <div className="tracker-step-content">
              <b>Order Received by Kitchen</b>
              <span>{isApproved ? 'Chef reviewed and approved' : 'Waiting for chef approval...'}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`tracker-step ${isReady ? 'completed' : order.status === 'Preparing' ? 'current' : ''}`}>
            <div className="tracker-step-indicator">
              {isReady ? <Check size={14} /> : '2'}
            </div>
            <div className="tracker-step-content">
              <b>{isReady ? 'Chef Cooking Completed' : 'Chef Approved & Cooking'}</b>
              <span>
                {order.status === 'Preparing'
                  ? 'Your food is sizzling in the kitchen!'
                  : isReady
                  ? 'Dishes prepared and plated in kitchen'
                  : 'Pending chef confirmation'}
              </span>
              {order.estimatedPrepTime && order.status === 'Preparing' && (
                <div className="tracker-eta-badge">
                  <Clock3 size={14} />
                  <span>Estimated: ~{order.estimatedPrepTime} mins</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className={`tracker-step ${isCompleted ? 'completed' : order.status === 'Ready' ? 'current' : ''}`}>
            <div className="tracker-step-indicator">
              {isCompleted ? <Check size={14} /> : '3'}
            </div>
            <div className="tracker-step-content">
              <b>{isCompleted ? 'Served & Completed' : 'Food Ready!'}</b>
              <span>
                {order.status === 'Ready'
                  ? order.mode === 'Dine in'
                    ? `Bringing freshly prepared dishes directly to ${order.table || 'Table 12'}!`
                    : 'Dishes are packed and ready for pickup at the counter!'
                  : isCompleted
                  ? order.mode === 'Dine in'
                    ? `Delivered to ${order.table || 'your table'}. Enjoy your meal!`
                    : 'Order collected. Enjoy your meal!'
                  : order.status === 'Preparing'
                  ? 'Will be served hot as soon as cooking finishes'
                  : 'Upcoming after cooking'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="tracker-order-summary">
        {order.guestName && (
          <div>
            <span>Guest Name:</span>
            <b>{order.guestName}</b>
          </div>
        )}
        <div>
          <span>Dining Mode:</span>
          <b>{order.mode === 'Dine in' ? `${order.table || 'Table 1'}` : 'Self Pickup'}</b>
        </div>
        <div>
          <span>Total Bill:</span>
          <b>{formatPrice(order.total)}</b>
        </div>
        {order.instructions && (
          <div style={{ marginTop: '4px', borderTop: '1px solid #232a25', paddingTop: '4px' }}>
            <span>Note:</span> <i>"{order.instructions}"</i>
          </div>
        )}
      </div>

      <div className="tracker-actions">
        <button type="button" className="tracker-btn-secondary" onClick={onClose}>
          Hide Tracker
        </button>
        <button type="button" className="tracker-btn-primary" onClick={onNewOrder}>
          + Order More Items
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN APPLICATION
// -------------------------------------------------------------
function App() {
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'chef'
  const [chefAuth, setChefAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('poddars_chef_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Customer state & guest session
  const [guest, setGuest] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTable = urlParams.get('table');
      const urlName = urlParams.get('name');
      const saved = localStorage.getItem('poddars_guest_session');
      const parsed = saved ? JSON.parse(saved) : null;
      if (urlTable || urlName) {
        return {
          name: urlName || parsed?.name || '',
          table: urlTable ? (urlTable.startsWith('Table') ? urlTable : `Table ${urlTable}`) : (parsed?.table || 'Table 1'),
          mode: parsed?.mode || 'Dine in'
        };
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [guestModalOpen, setGuestModalOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('poddars_guest_session');
      const parsed = saved ? JSON.parse(saved) : null;
      return !parsed || !parsed.name;
    } catch {
      return true;
    }
  });

  const [mode, setMode] = useState(() => guest?.mode || 'Dine in');
  const [category, setCategory] = useState('All');
  const [diet, setDiet] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const [addedItem, setAddedItem] = useState('');
  const [instruction, setInstruction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);
  const [showTracker, setShowTracker] = useState(false);

  // URL Hash / Path detection for direct kitchen access
  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const query = window.location.search.toLowerCase();
      if (path === '/chef' || path === '/kitchen' || hash === '#chef' || hash === '#kitchen' || query.includes('view=chef') || query.includes('view=kitchen')) {
        setCurrentView('chef');
      }
    };
    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
    };
  }, []);

  const handleChefLogin = (chefData, token) => {
    setChefAuth(chefData);
    try {
      localStorage.setItem('poddars_chef_auth', JSON.stringify(chefData));
      if (token) localStorage.setItem('poddars_chef_token', token);
    } catch {}
  };

  const handleChefLogout = () => {
    setChefAuth(null);
    try {
      localStorage.removeItem('poddars_chef_auth');
      localStorage.removeItem('poddars_chef_token');
    } catch {}
  };

  const visibleMenu = useMemo(() => {
    return menu
      .filter(item => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesDiet =
          diet === 'All' ||
          (diet === 'Veg' ? !nonVegIds.has(item.id) : nonVegIds.has(item.id));
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesDiet && matchesSearch;
      })
      .sort((first, second) => {
        const categoryOrder = eatingOrder.indexOf(first.category) - eatingOrder.indexOf(second.category);
        return categoryOrder || Number(nonVegIds.has(first.id)) - Number(nonVegIds.has(second.id));
      });
  }, [category, diet, search]);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const updateCart = (item, delta) => {
    if (delta > 0) setAddedItem(item.name);
    setCart(current => {
      const found = current.find(cartItem => cartItem.id === item.id);
      if (!found && delta > 0) return [...current, { ...item, qty: 1 }];
      return current
        .map(cartItem => (cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + delta } : cartItem))
        .filter(cartItem => cartItem.qty > 0);
    });
  };

  const submitOrder = async () => {
    if (!cart.length || submitting) return;
    if (!guest?.name) {
      setGuestModalOpen(true);
      return;
    }
    setSubmitting(true);
    setOrderError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guest.name,
          mode,
          table: mode === 'Dine in' ? (guest.table || 'Table 1') : null,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            color: item.color,
            mark: item.mark
          })),
          instructions: instruction,
          subtotal,
          gst,
          total
        })
      });
      if (!response.ok) throw new Error('The hotel server could not receive the order.');
      const createdOrder = await response.json();

      // Open live tracker
      setActiveTrackingOrderId(createdOrder.id);
      setShowTracker(true);
      setCartOpen(false);
      setCart([]);
      setInstruction('');
    } catch (error) {
      setOrderError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* CHEF VIEW (Hidden from customer) */}
      {currentView === 'chef' ? (
        chefAuth ? (
          <ChefPortal
            chefAuth={chefAuth}
            onLogout={handleChefLogout}
            onViewCustomerMenu={() => {
              window.location.hash = '';
              setCurrentView('customer');
            }}
          />
        ) : (
          <ChefLogin
            onLogin={handleChefLogin}
            onBackToMenu={() => {
              window.location.hash = '';
              setCurrentView('customer');
            }}
          />
        )
      ) : (
        /* CUSTOMER VIEW (Clean, unexposed to kitchen internals) */
        <>
          {/* Customer Header */}
          <header>
            <div className="brand">
              <span className="brand-mark">
                <UtensilsCrossed size={19} />
              </span>
              <span>
                THE PODDAR'S
                <br />
                <i>food & bar</i>
              </span>
            </div>

            <div className="service-status">
              <span></span>Kitchen is accepting orders
            </div>

            <button
              type="button"
              className="header-guest-pill"
              onClick={() => setGuestModalOpen(true)}
              title="Click to change your Name or Table"
            >
              <User size={15} color="var(--lime)" />
              <div>
                <b>{guest?.name || 'Guest Check-in'}</b>
                <small>{mode === 'Dine in' ? (guest?.table || 'Table 1') : 'Pickup'}</small>
              </div>
            </button>

            <div className="header-actions">
              {activeTrackingOrderId && (
                <button
                  type="button"
                  className="kds-btn-tool active"
                  onClick={() => setShowTracker(true)}
                  style={{ fontSize: '11px', padding: '6px 12px' }}
                >
                  <Flame size={14} color="var(--lime)" />
                  <span>Track Order</span>
                </button>
              )}

              <button
                type="button"
                className={'icon-btn notification-button ' + (notice ? 'has-notice' : '')}
                onClick={() => setNotice(!notice)}
                aria-label="Toggle order updates"
              >
                <Bell size={19} />
              </button>

              <button
                type="button"
                className="cart-trigger"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingBag size={18} /> <b>{count}</b>
              </button>
            </div>
          </header>

          <section className="welcome">
            <div>
              <p className="eyebrow">
                WELCOME TO THE PODDAR'S{guest?.name ? ` • HI ${guest.name.toUpperCase()}!` : ''}
              </p>
              <h1>
                Good food,
                <br />
                on your terms.
              </h1>
              <p className="subcopy">
                Freshly made, ready when you are. Choose how you would like to enjoy your meal.
              </p>
            </div>
            <div className="mode-switch" role="group" aria-label="Order type">
              <button
                type="button"
                className={mode === 'Dine in' ? 'active' : ''}
                onClick={() => {
                  setMode('Dine in');
                  if (!guest?.table) setGuestModalOpen(true);
                }}
              >
                <UtensilsCrossed size={20} />
                <span>
                  Dine in<small>{guest?.table || 'Choose Table'}</small>
                </span>
              </button>
              <button
                type="button"
                className={mode === 'Self pickup' ? 'active' : ''}
                onClick={() => setMode('Self pickup')}
              >
                <ShoppingBag size={20} />
                <span>
                  Self pickup<small>Ready in 20 min</small>
                </span>
              </button>
            </div>
          </section>

          <nav className="diet-filter" aria-label="Diet preference">
            <span>SHOWING</span>
            {['All', 'Veg', 'Non-veg'].map(option => (
              <button
                type="button"
                key={option}
                className={diet === option ? 'selected' : ''}
                onClick={() => setDiet(option)}
              >
                {option}
              </button>
            ))}
          </nav>

          {orderError && (
            <div className="order-error">
              {orderError} Start the hotel server with <code>npm.cmd run server</code>.
            </div>
          )}

          <section className="menu-section">
            <div className="menu-top">
              <div>
                <p className="eyebrow">EXPLORE THE MENU</p>
                <h2>Finest food & drinks, made fresh.</h2>
              </div>
              <label className="search">
                <Search size={18} />
                <input
                  placeholder="Search the menu"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
              </label>
            </div>

            <nav className="categories">
              {categories.map(itemCategory => (
                <button
                  type="button"
                  key={itemCategory}
                  onClick={() => setCategory(itemCategory)}
                  className={category === itemCategory ? 'selected' : ''}
                >
                  {itemCategory}
                </button>
              ))}
            </nav>

            <div className="grid">
              {visibleMenu.map(item => {
                const cartItem = cart.find(entry => entry.id === item.id);
                return (
                  <article className="dish" key={item.id}>
                    <div className={'dish-image ' + item.color}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="dish-photo"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="dish-badge-mark">{item.mark}</span>
                      <div className="dish-diet-tag">
                        <span className={nonVegIds.has(item.id) ? 'tag-nonveg' : 'tag-veg'} title={nonVegIds.has(item.id) ? 'Non-Veg' : 'Pure Veg'}>
                          <i></i>
                        </span>
                      </div>
                    </div>
                    <div className="dish-info">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
                      </div>
                      <div className="dish-bottom">
                        <b>{formatPrice(item.price)}</b>
                        {cartItem ? (
                          <div className="menu-quantity">
                            <button
                              type="button"
                              aria-label={'Remove one ' + item.name}
                              onClick={() => updateCart(item, -1)}
                            >
                              <Minus size={15} />
                            </button>
                            <b>{cartItem.qty}</b>
                            <button
                              type="button"
                              aria-label={'Add one ' + item.name}
                              onClick={() => updateCart(item, 1)}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="add"
                            aria-label={'Add ' + item.name}
                            onClick={() => updateCart(item, 1)}
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Mobile Cart Button */}
          {count > 0 && (
            <div className="mobile-cart">
              <button type="button" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={18} />
                <span>View order ({count} items)</span>
                <b>{formatPrice(total)} →</b>
              </button>
            </div>
          )}

          {/* Cart Drawer */}
          {cartOpen && (
            <aside className="drawer">
              <div className="drawer-head">
                <button type="button" className="icon-btn" onClick={() => setCartOpen(false)}>
                  <ArrowLeft size={20} />
                </button>
                <h2>Your order</h2>
                <span className="item-count">{count} items</span>
              </div>

              <div className="order-type">
                <span>{mode === 'Dine in' ? <UtensilsCrossed size={18} /> : <ShoppingBag size={18} />}</span>
                <div>
                  <b>{guest?.name || 'Guest'} • {mode === 'Dine in' ? (guest?.table || 'Table 1') : 'Self Pickup'}</b>
                  <small>{mode === 'Dine in' ? 'Food served to your table' : 'Pick up at the counter'}</small>
                </div>
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(true)}
                >
                  Change
                </button>
              </div>

              <div className="cart-items">
                {cart.length ? (
                  cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className={'tiny ' + item.color}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="tiny-img"
                            onError={e => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <span>{item.mark}</span>
                      </div>
                      <div className="cart-name">
                        <b>{item.name}</b>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                      <div className="quantity">
                        <button type="button" onClick={() => updateCart(item, -1)}>
                          <Minus size={14} />
                        </button>
                        <b>{item.qty}</b>
                        <button type="button" onClick={() => updateCart(item, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <ShoppingBag size={30} />
                    <p>Your bag is waiting for something delicious.</p>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <div className="totals">
                  <span>Subtotal</span>
                  <b>{formatPrice(subtotal)}</b>
                  <span>GST (5%)</span>
                  <b>{formatPrice(gst)}</b>
                  <strong>
                    Total <b>{formatPrice(total)}</b>
                  </strong>
                </div>
                <button
                  type="button"
                  className="checkout"
                  disabled={!cart.length || submitting}
                  onClick={submitOrder}
                >
                  <span>{submitting ? 'Sending order...' : mode === 'Dine in' ? `Send to kitchen (${guest?.table || 'Table 1'})` : 'Place pickup order'}</span>
                  <span>→</span>
                </button>
              </div>
            </aside>
          )}

          {cartOpen && <div className="backdrop" onClick={() => setCartOpen(false)}></div>}

          {cartOpen && cart.length > 0 && (
            <label className="instructions-panel">
              <span>Special cooking instructions for chef</span>
              <textarea
                value={instruction}
                onChange={event => setInstruction(event.target.value)}
                placeholder="For example: less spicy, no onion, extra crispy..."
              />
            </label>
          )}

          {notice && (
            <div className="notification-popover">
              <b>Live kitchen connection active</b>
              <span>The kitchen display system is online. Chefs receive orders instantly.</span>
            </div>
          )}

          {addedItem && (
            <button
              type="button"
              className="cart-toast"
              onClick={() => {
                setCartOpen(true);
                setAddedItem('');
              }}
            >
              {addedItem} added <ShoppingBag size={16} />
            </button>
          )}

          {/* Customer Footer with discreet Staff Portal Link */}
          <footer className="customer-footer">
            <p>© {new Date().getFullYear()} The Poddar's Food & Bar. Freshly prepared with love.</p>
            <button
              type="button"
              className="staff-access-link"
              onClick={() => {
                window.location.hash = 'kitchen';
                setCurrentView('chef');
              }}
            >
              <Lock size={12} /> Staff & Kitchen Portal
            </button>
          </footer>
        </>
      )}

      {/* Guest Login / Table Check-in Modal */}
      <GuestLoginModal
        guest={guest}
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        onSaveGuest={savedGuest => {
          setGuest(savedGuest);
          setMode(savedGuest.mode || 'Dine in');
          setGuestModalOpen(false);
          try {
            localStorage.setItem('poddars_guest_session', JSON.stringify(savedGuest));
          } catch {}
        }}
      />

      {/* Live Order Tracker Modal */}
      {showTracker && activeTrackingOrderId && currentView === 'customer' && (
        <CustomerTracker
          orderId={activeTrackingOrderId}
          onClose={() => setShowTracker(false)}
          onNewOrder={() => {
            setShowTracker(false);
          }}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

