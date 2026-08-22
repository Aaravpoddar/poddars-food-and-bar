import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Beer,
  Bell,
  BellRing,
  Cake,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Clock3,
  Coffee,
  Droplets,
  Flame,
  GlassWater,
  HelpCircle,
  IceCream,
  Lock,
  LogOut,
  MapPin,
  Martini,
  MessageSquare,
  Minus,
  Pizza,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Sparkles,
  Star,
  Trash2,
  User,
  Utensils,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  Wine,
  X,
  Zap,
  Receipt,
  Printer,
  CreditCard,
  QrCode,
  Smartphone,
  Copy,
  Banknote
} from 'lucide-react';
import './style.css';

const resolveAsset = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  const base = import.meta.env.BASE_URL || './';
  const clean = url.startsWith('/') ? url.slice(1) : url;
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
};

const menu = [
  { id: 1, name: 'Butter Chicken', desc: 'Tandoori chicken in creamy tomato gravy', price: 289, category: 'Indian', color: 'coral', mark: 'BC', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Paneer Tikka Masala', desc: 'Charred paneer in rich makhani gravy', price: 249, category: 'Indian', color: 'cream', mark: 'PT', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Rajma Chawal', desc: 'Slow-cooked rajma with steamed basmati rice', price: 159, category: 'Indian', color: 'green', mark: 'RC', image: '/images/rajma-chawal.png' },
  { id: 4, name: 'Chicken Biryani', desc: 'Aromatic basmati, chicken, fried onions and raita', price: 249, category: 'Indian', color: 'blue', mark: 'CB', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Samosa Chaat', desc: 'Crisp samosa, chickpeas, chutneys and sev', price: 99, category: 'Starters', color: 'yellow', mark: 'SC', image: '/images/samosa-chaat.jpg' },
  { id: 6, name: 'Masala Dosa', desc: 'Crisp dosa, potato masala, sambar and chutney', price: 129, category: 'Dosa', color: 'purple', mark: 'MD', image: '/images/masala-dosa.png' },
  { id: 7, name: 'Veg Hakka Noodles', desc: 'Wok-tossed noodles with crunchy vegetables', price: 169, category: 'Chinese', color: 'pink', mark: 'VN', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Chilli Chicken', desc: 'Crispy chicken, peppers and chilli sauce', price: 219, category: 'Chinese', color: 'orange', mark: 'CC', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Veg Manchurian', desc: 'Vegetable dumplings in a tangy soy sauce', price: 179, category: 'Chinese', color: 'green', mark: 'VM', image: '/images/veg-manchurian.png' },
  { id: 10, name: 'Chicken Fried Rice', desc: 'Wok-fried rice, chicken, egg and vegetables', price: 199, category: 'Chinese', color: 'coral', mark: 'FR', image: '/images/chicken-fried-rice.jpg' },
  { id: 11, name: 'Margherita Pizza', desc: 'Tomato, mozzarella and fresh basil', price: 229, category: 'Italian', color: 'yellow', mark: 'MP', image: '/images/margherita-pizza.png' },
  { id: 12, name: 'White Sauce Pasta', desc: 'Penne, creamy herb sauce and sweet corn', price: 199, category: 'Italian', color: 'cream', mark: 'WP', image: '/images/white-sauce-pasta.jpg' },
  { id: 13, name: 'Chicken Alfredo Pasta', desc: 'Grilled chicken, penne and parmesan sauce', price: 269, category: 'Italian', color: 'blue', mark: 'CA', image: '/images/chicken-alfredo-pasta.png' },
  { id: 14, name: 'Veg Club Sandwich', desc: 'Grilled vegetables, cheese and house spread', price: 159, category: 'Continental', color: 'purple', mark: 'VS', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { id: 15, name: 'Crispy Chicken Burger', desc: 'Fried chicken, lettuce, cheese and fries', price: 229, category: 'Continental', color: 'orange', mark: 'CB', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { id: 16, name: 'French Fries', desc: 'Crisp golden fries with seasoning', price: 89, category: 'Starters', color: 'yellow', mark: 'FF', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80' },
  { id: 17, name: 'Gulab Jamun', desc: 'Warm milk dumplings in rose syrup', price: 79, category: 'Dessert', color: 'pink', mark: 'GJ', image: '/images/gulab-jamun.png' },
  { id: 18, name: 'Brownie with Ice Cream', desc: 'Warm chocolate brownie and vanilla scoop', price: 119, category: 'Dessert', color: 'coral', mark: 'BI', image: '/images/brownie-with-ice-cream.png' },
  { id: 19, name: 'Masala Chai', desc: 'Assam tea with ginger and cardamom', price: 35, category: 'Beverages', color: 'orange', mark: 'MC', image: '/images/masala-chai.png' },
  { id: 20, name: 'Fresh Lime Soda', desc: 'Sweet or salted chilled lime soda', price: 59, category: 'Beverages', color: 'green', mark: 'LS', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
  { id: 21, name: 'Mysore Masala Dosa', desc: 'Spicy red chutney, potato masala, sambar', price: 149, category: 'Dosa', color: 'coral', mark: 'MM', image: '/images/mysore-masala-dosa.jpg' },
  { id: 22, name: 'Onion Rava Dosa', desc: 'Crispy semolina dosa with onion and pepper', price: 139, category: 'Dosa', color: 'yellow', mark: 'OR', image: '/images/onion-rava-dosa.png' },
  { id: 23, name: 'Cheese Dosa', desc: 'Golden dosa, cheese, potato masala and chutney', price: 159, category: 'Dosa', color: 'cream', mark: 'CD', image: '/images/cheese-dosa.jpg' },
  { id: 24, name: 'Plain Dosa', desc: 'Classic crisp dosa served with sambar and chutneys', price: 89, category: 'Dosa', color: 'green', mark: 'PD', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { id: 25, name: 'Butter Naan', desc: 'Soft tandoor-baked naan brushed with butter', price: 45, category: 'Breads', color: 'orange', mark: 'BN', image: '/images/butter-naan.jpg' },
  { id: 26, name: 'Garlic Naan', desc: 'Tandoor naan with garlic, coriander and butter', price: 55, category: 'Breads', color: 'purple', mark: 'GN', image: '/images/garlic-naan.png' },
  { id: 27, name: 'Tandoori Roti', desc: 'Whole-wheat bread straight from the tandoor', price: 25, category: 'Breads', color: 'yellow', mark: 'TR', image: '/images/tandoori-roti.jpg' },
  { id: 28, name: 'Laccha Paratha', desc: 'Flaky layered whole-wheat paratha', price: 45, category: 'Breads', color: 'blue', mark: 'LP', image: '/images/laccha-paratha.png' },
  { id: 29, name: 'Rasmalai', desc: 'Saffron milk dumplings with pistachio', price: 99, category: 'Dessert', color: 'cream', mark: 'RM', image: '/images/rasmalai.png' },
  { id: 30, name: 'Kulfi Falooda', desc: 'Malai kulfi, vermicelli, basil seeds and rose syrup', price: 109, category: 'Dessert', color: 'pink', mark: 'KF', image: '/images/kulfi-falooda.png' },
  { id: 31, name: 'Ice Cream Sundae', desc: 'Vanilla ice cream, chocolate sauce and nuts', price: 89, category: 'Dessert', color: 'blue', mark: 'IS', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80' },
  { id: 32, name: 'Carrot Halwa', desc: 'Slow-cooked gajar halwa with almonds', price: 79, category: 'Dessert', color: 'orange', mark: 'GH', image: '/images/carrot-halwa.png' },
  { id: 33, name: 'Dal Makhani', desc: 'Creamy black lentils slow-cooked overnight', price: 189, category: 'Indian', color: 'purple', mark: 'DM', image: '/images/dal-makhani.png' },
  { id: 34, name: 'Kadai Paneer', desc: 'Paneer, capsicum and onion in a spiced gravy', price: 239, category: 'Indian', color: 'coral', mark: 'KP', image: '/images/kadai-paneer.png' },
  { id: 35, name: 'Veg Thali', desc: 'Dal, seasonal vegetables, rice, roti and salad', price: 199, category: 'Indian', color: 'yellow', mark: 'VT', image: '/images/veg-thali.png' },
  { id: 36, name: 'Idli Sambar', desc: 'Four soft idlis with sambar and chutneys', price: 99, category: 'Dosa', color: 'cream', mark: 'IS', image: '/images/idli-sambar.png' },
  { id: 37, name: 'Spring Rolls', desc: 'Crisp vegetable rolls with sweet chilli dip', price: 129, category: 'Starters', color: 'green', mark: 'SR', image: '/images/spring-rolls.jpg' },
  { id: 38, name: 'Chicken Tikka', desc: 'Char-grilled chicken with mint chutney', price: 249, category: 'Starters', color: 'orange', mark: 'CT', image: '/images/chicken-tikka.jpg' },
  { id: 39, name: 'Mexican Veg Pizza', desc: 'Corn, peppers, jalapenos and mozzarella', price: 259, category: 'Italian', color: 'pink', mark: 'MX', image: '/images/mexican-veg-pizza.png' },
  { id: 40, name: 'Grilled Chicken Sandwich', desc: 'Herbed chicken, lettuce, cheese and fries', price: 219, category: 'Continental', color: 'blue', mark: 'GS', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { id: 41, name: 'Cold Coffee', desc: 'Creamy chilled coffee with vanilla ice cream', price: 89, category: 'Beverages', color: 'cream', mark: 'CF', image: '/images/cold-coffee.png' },
  { id: 42, name: 'Mango Lassi', desc: 'Thick yogurt drink with ripe mango', price: 79, category: 'Beverages', color: 'yellow', mark: 'ML', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&auto=format&fit=crop&q=80' },
  { id: 43, name: 'Chole Bhature', desc: 'Spiced chickpeas with fluffy fried bread', price: 159, category: 'Indian', color: 'orange', mark: 'CB', image: '/images/chole-bhature.jpg' },
  { id: 44, name: 'Palak Paneer', desc: 'Paneer in a smooth spinach and garlic gravy', price: 229, category: 'Indian', color: 'green', mark: 'PP', image: '/images/palak-paneer.jpg' },
  { id: 45, name: 'Chicken Curry', desc: 'Home-style chicken curry with warming spices', price: 269, category: 'Indian', color: 'coral', mark: 'CC', image: '/images/chicken-curry.png' },
  { id: 46, name: 'Podi Dosa', desc: 'Crisp dosa dusted with spiced lentil powder', price: 139, category: 'Dosa', color: 'orange', mark: 'PD', image: '/images/podi-dosa.jpg' },
  { id: 47, name: 'Stuffed Kulcha', desc: 'Tandoor bread filled with potato and spices', price: 75, category: 'Breads', color: 'yellow', mark: 'SK', image: '/images/stuffed-kulcha.jpg' },
  { id: 48, name: 'Missi Roti', desc: 'Spiced gram flour and wheat flatbread', price: 35, category: 'Breads', color: 'cream', mark: 'MR', image: '/images/missi-roti.jpg' },
  { id: 49, name: 'Cheese Garlic Bread', desc: 'Toasted bread with garlic butter and cheese', price: 89, category: 'Breads', color: 'pink', mark: 'GB', image: '/images/cheese-garlic-bread.png' },
  { id: 50, name: 'Veg Schezwan Rice', desc: 'Wok-fried rice in a bold schezwan sauce', price: 179, category: 'Chinese', color: 'red', mark: 'SR', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
  { id: 51, name: 'Chicken Momos', desc: 'Steamed chicken dumplings with chilli chutney', price: 149, category: 'Chinese', color: 'blue', mark: 'CM', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format&fit=crop&q=80' },
  { id: 52, name: 'Honey Chilli Potato', desc: 'Crisp potato tossed in sweet chilli sauce', price: 139, category: 'Chinese', color: 'yellow', mark: 'HP', image: '/images/honey-chilli-potato.png' },
  { id: 53, name: 'Sweet Corn Soup', desc: 'Comforting soup with corn and vegetables', price: 99, category: 'Chinese', color: 'cream', mark: 'CS', image: '/images/sweet-corn-soup.jpg' },
  { id: 54, name: 'Veg Arrabbiata Pasta', desc: 'Penne in a spicy tomato and herb sauce', price: 189, category: 'Italian', color: 'coral', mark: 'AP', image: '/images/veg-arrabbiata-pasta.jpg' },
  { id: 55, name: 'Farmhouse Pizza', desc: 'Mushroom, corn, peppers and mozzarella', price: 279, category: 'Italian', color: 'green', mark: 'FP', image: '/images/farmhouse-pizza.png' },
  { id: 56, name: 'Chicken Lasagna', desc: 'Layers of chicken, pasta and béchamel sauce', price: 299, category: 'Italian', color: 'orange', mark: 'CL', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&auto=format&fit=crop&q=80' },
  { id: 57, name: 'Veg Burger', desc: 'Crispy veg patty, cheese and fries', price: 169, category: 'Continental', color: 'green', mark: 'VB', image: '/images/veg-burger.png' },
  { id: 58, name: 'Fish and Chips', desc: 'Crispy fish fillet with seasoned fries', price: 279, category: 'Continental', color: 'blue', mark: 'FC', image: '/images/fish-and-chips.png' },
  { id: 59, name: 'Grilled Veggies', desc: 'Seasonal vegetables with herb butter', price: 149, category: 'Continental', color: 'purple', mark: 'GV', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
  { id: 60, name: 'Tomato Basil Soup', desc: 'Creamy tomato soup with croutons', price: 99, category: 'Continental', color: 'coral', mark: 'TS', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80' },
  { id: 61, name: 'Paneer Tikka', desc: 'Char-grilled paneer with mint chutney', price: 199, category: 'Starters', color: 'yellow', mark: 'PK', image: '/images/paneer-tikka.jpg' },
  { id: 62, name: 'Nachos Supreme', desc: 'Crisp nachos, salsa, beans and cheese', price: 169, category: 'Starters', color: 'orange', mark: 'NS', image: '/images/nachos-supreme.png' },
  { id: 63, name: 'Crispy Corn', desc: 'Golden fried corn with spices and lime', price: 129, category: 'Starters', color: 'green', mark: 'CC', image: '/images/crispy-corn.jpg' },
  { id: 64, name: 'Kesar Pista Kulfi', desc: 'Traditional saffron and pistachio kulfi', price: 89, category: 'Dessert', color: 'cream', mark: 'KP', image: '/images/kesar-pista-kulfi.png' },
  { id: 65, name: 'Chocolate Shake', desc: 'Thick chocolate shake with a scoop of ice cream', price: 99, category: 'Beverages', color: 'coral', mark: 'CS', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
  { id: 66, name: 'Virgin Mojito', desc: 'Mint, lime and sparkling soda', price: 89, category: 'Beverages', color: 'green', mark: 'VM', image: '/images/virgin-mojito.png' },
  { id: 67, name: 'Iced Tea', desc: 'Chilled lemon tea with mint', price: 69, category: 'Beverages', color: 'orange', mark: 'IT', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80' },
  { id: 92, name: 'Red Bull Energy Drink (Can)', desc: 'Chilled iconic energy drink to vitalize body and mind', price: 165, category: 'Beverages', color: 'blue', mark: 'RB', image: '/images/red-bull.png' },
  { id: 93, name: 'Red Bull Sugarfree (Can)', desc: 'Wings without sugar, crisp and chilled', price: 165, category: 'Beverages', color: 'blue', mark: 'RS', image: '/images/red-bull-sugarfree.png' },
  { id: 94, name: 'Monster Energy Drink (Can)', desc: 'Smooth, bold energy blend with an intense punch', price: 175, category: 'Beverages', color: 'green', mark: 'ME', image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80' },
  { id: 95, name: 'Ginger Ale (Can)', desc: 'Crisp, sparkling spiced ginger refresher', price: 89, category: 'Beverages', color: 'yellow', mark: 'GA', image: '/images/ginger-ale.png' },
  { id: 96, name: 'Tonic Water (Can)', desc: 'Effervescent botanical mixer with subtle citrus notes', price: 89, category: 'Beverages', color: 'blue', mark: 'TW', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&auto=format&fit=crop&q=80' },
  { id: 97, name: 'Diet Coke / Coke Zero (Can)', desc: 'Crisp, chilled zero-calorie sparkling cola', price: 69, category: 'Beverages', color: 'red', mark: 'DC', image: '/images/diet-coke.png' },
  { id: 98, name: 'Coca-Cola / Thums Up (Can)', desc: 'Classic chilled carbonated soda', price: 59, category: 'Beverages', color: 'red', mark: 'CC', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80' },
  { id: 99, name: 'Blue Lagoon Mocktail', desc: 'Curacao syrup, crushed ice, lemon and fizzy sprite', price: 129, category: 'Beverages', color: 'blue', mark: 'BL', image: '/images/blue-lagoon.jpg' },
  { id: 100, name: 'Fresh Watermelon Mint Juice', desc: 'Cold-pressed natural watermelon juice with fresh mint', price: 109, category: 'Beverages', color: 'pink', mark: 'WM', image: '/images/watermelon-mint-juice.jpg' },
  { id: 101, name: 'Perrier Sparkling Water', desc: 'Natural sparkling mineral water from France (330ml)', price: 159, category: 'Beverages', color: 'green', mark: 'PW', image: '/images/perrier-sparkling-water.jpg' },
  { id: 102, name: 'Sweet / Salted Lassi', desc: 'Traditional creamy churned yogurt drink with cardamom', price: 79, category: 'Beverages', color: 'cream', mark: 'SL', image: '/images/sweet-lassi.png' },
  // Alcohol & Bar Section
  { id: 68, name: 'Kingfisher Ultra (Pint)', desc: 'Crisp, premium lager with smooth malt finish', price: 249, category: 'Alcohol', color: 'yellow', mark: 'KF', image: '/images/kingfisher-ultra.jpg' },
  { id: 69, name: 'Corona Extra with Lime', desc: 'Imported Mexican lager served with fresh lime', price: 349, category: 'Alcohol', color: 'yellow', mark: 'CE', image: '/images/corona-extra.png' },
  { id: 70, name: 'Bira 91 White Wheat Beer', desc: 'Aromatic Belgian style wheat beer with citrus & coriander', price: 299, category: 'Alcohol', color: 'orange', mark: 'BW', image: '/images/bira-91-white.png' },
  { id: 71, name: 'Heineken Silver (Pint)', desc: 'Smooth, easy-drinking crisp European lager', price: 289, category: 'Alcohol', color: 'green', mark: 'HN', image: '/images/heineken-silver.png' },
  { id: 72, name: 'Budweiser Magnum', desc: 'Super-premium strong craft lager with rich maltiness', price: 279, category: 'Alcohol', color: 'coral', mark: 'BM', image: '/images/budweiser-magnum.jpg' },
  { id: 73, name: 'Long Island Iced Tea (LIIT)', desc: 'Vodka, gin, rum, tequila, triple sec & cola splash', price: 479, category: 'Alcohol', color: 'coral', mark: 'LI', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80' },
  { id: 74, name: 'Classic Old Fashioned', desc: 'Bourbon whiskey, aromatic bitters, orange peel & cane sugar', price: 449, category: 'Alcohol', color: 'orange', mark: 'OF', image: '/images/classic-old-fashioned.png' },
  { id: 76, name: 'Botanical Gin & Tonic', desc: 'Artisanal dry gin, elderflower tonic & fresh rosemary', price: 399, category: 'Alcohol', color: 'blue', mark: 'GT', image: '/images/botanical-gin-tonic.png' },
  { id: 77, name: 'Espresso Martini', desc: 'Vodka, fresh espresso shot, Kahlúa coffee liqueur', price: 429, category: 'Alcohol', color: 'purple', mark: 'EM', image: '/images/espresso-martini.png' },
  { id: 81, name: 'Glenfiddich 12 Yrs (60ml)', desc: 'Speyside single malt scotch with fresh pear & subtle oak', price: 599, category: 'Alcohol', color: 'amber', mark: 'GF', image: '/images/glenfiddich-12.png' },
  { id: 82, name: 'Johnnie Walker Black (60ml)', desc: 'Iconic 12-year blended scotch with deep smoky notes', price: 499, category: 'Alcohol', color: 'orange', mark: 'JW', image: '/images/johnnie-walker-black.png' },
  { id: 83, name: 'Jameson Irish Whiskey (60ml)', desc: 'Triple-distilled Irish whiskey with smooth vanilla finish', price: 429, category: 'Alcohol', color: 'green', mark: 'JM', image: '/images/jameson-whiskey.png' },
  { id: 84, name: 'Grey Goose Vodka (60ml)', desc: 'Ultra-premium French wheat vodka on rocks or mixer', price: 469, category: 'Alcohol', color: 'blue', mark: 'GG', image: '/images/grey-goose-vodka.png' },
  { id: 85, name: 'Bombay Sapphire Gin (60ml)', desc: 'Vapour-infused London dry gin with 10 exotic botanicals', price: 399, category: 'Alcohol', color: 'blue', mark: 'BS', image: '/images/bombay-sapphire-gin.jpg' },
  { id: 86, name: 'Bacardi Carta Blanca Rum (60ml)', desc: 'Classic superior white rum with subtle almond & floral notes', price: 299, category: 'Alcohol', color: 'cream', mark: 'BC', image: '/images/bacardi-carta-blanca.jpg' },
  { id: 87, name: 'Patrón Silver Tequila Shot', desc: '100% blue agave premium tequila with sea salt & lime', price: 349, category: 'Alcohol', color: 'green', mark: 'PT', image: '/images/patron-silver-tequila.png' },
  { id: 88, name: 'Jägermeister Shot', desc: 'Legendary German herbal liqueur with 56 herbs & spices', price: 329, category: 'Alcohol', color: 'purple', mark: 'JM', image: '/images/jagermeister-shot.jpg' },
  { id: 89, name: 'Jacob’s Creek Cabernet (Glass)', desc: 'Australian red wine with ripe blackcurrant & oak notes', price: 399, category: 'Alcohol', color: 'wine', mark: 'JC', image: '/images/jacobs-creek-cabernet.png' },
  { id: 90, name: 'Sula Sauvignon Blanc (Glass)', desc: 'Crisp Indian white wine with refreshing aromas of guava', price: 349, category: 'Alcohol', color: 'yellow', mark: 'SB', image: '/images/sula-sauvignon-blanc.png' },
  { id: 91, name: 'Chandon Brut Sparkling (Glass)', desc: 'Elegant sparkling bubbly with green apple and brioche notes', price: 499, category: 'Alcohol', color: 'cream', mark: 'CB', image: '/images/chandon-brut-sparkling.png' }
];

const eatingOrder = ['Starters', 'Dosa', 'Chinese', 'Italian', 'Continental', 'Indian', 'Breads', 'Dessert', 'Beverages', 'Alcohol'];
const categories = ['All', ...eatingOrder];
const nonVegIds = new Set([1, 4, 8, 10, 13, 15, 38, 40, 45, 51, 56, 58]);
const formatPrice = amount => `₹${Math.round(amount).toLocaleString('en-IN')}`;

const categoryMetadata = {
  'All': { label: 'All Dishes', icon: '✨' },
  'Starters': { label: 'Starters', icon: '🍟' },
  'Dosa': { label: 'South Indian', icon: '🥞' },
  'Chinese': { label: 'Chinese', icon: '🍜' },
  'Italian': { label: 'Italian', icon: '🍕' },
  'Continental': { label: 'Burgers & Wraps', icon: '🥪' },
  'Indian': { label: 'Main Curries', icon: '🍛' },
  'Breads': { label: 'Tandoor Breads', icon: '🫓' },
  'Dessert': { label: 'Desserts', icon: '🍨' },
  'Beverages': { label: 'Beverages', icon: '🥤' },
  'Alcohol': { label: 'Bar & Cocktails', icon: '🍸' }
};

const bestsellerIds = new Set([1, 4, 6, 11, 15, 18, 33, 38, 49, 55, 61, 73, 81]);
const chefPickIds = new Set([2, 5, 8, 12, 13, 21, 29, 30, 34, 39, 43, 51, 52, 56, 58, 66, 74, 76, 77]);
const ratingMap = {
  1: '4.9', 2: '4.8', 4: '4.9', 5: '4.8', 6: '4.8', 8: '4.7', 11: '4.9', 12: '4.9', 13: '4.8', 15: '4.8', 18: '4.9',
  21: '4.8', 26: '4.8', 29: '4.9', 30: '4.9', 33: '4.9', 34: '4.9', 38: '4.8', 39: '4.8', 43: '4.8', 49: '4.8', 51: '4.8',
  52: '4.8', 55: '4.9', 56: '4.9', 58: '4.8', 61: '4.8', 66: '4.8', 73: '4.9', 74: '4.9', 76: '4.8', 77: '4.9',
  81: '5.0'
};

function getCategoryIcon(cat, id) {
  if (cat === 'Alcohol') {
    if ([68, 69, 70, 71, 72].includes(id)) return <Beer size={12} />;
    if ([89, 90, 91].includes(id)) return <Wine size={12} />;
    return <Martini size={12} />;
  }
  if (cat === 'Italian') return <Pizza size={12} />;
  if (cat === 'Chinese') return <Soup size={12} />;
  if (cat === 'Dessert') return <IceCream size={12} />;
  if (cat === 'Beverages') {
    if ([19, 41].includes(id)) return <Coffee size={12} />;
    return <GlassWater size={12} />;
  }
  if (cat === 'Indian') return <Flame size={12} />;
  return <Utensils size={12} />;
}

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

function playWaiterCallChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [659.25, 880, 1046.5]; // E5, A5, C6 (Service alert chime)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.13);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + idx * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.13 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.13);
      osc.stop(ctx.currentTime + idx * 0.13 + 0.35);
    });
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
// LOCAL STORAGE ORDER SYNC & HELPERS (OFFLINE & STANDALONE RESILIENCE)
// -------------------------------------------------------------
function getLocalOrders() {
  try {
    const raw = localStorage.getItem('poddars_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalOrders(ordersList) {
  try {
    localStorage.setItem('poddars_orders', JSON.stringify(ordersList));
    window.dispatchEvent(new CustomEvent('poddars_orders_sync', { detail: ordersList }));
  } catch {}
}

function getLocalWaiterCalls() {
  try {
    const raw = localStorage.getItem('poddars_waiter_calls');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalWaiterCalls(callsList) {
  try {
    localStorage.setItem('poddars_waiter_calls', JSON.stringify(callsList));
    window.dispatchEvent(new CustomEvent('poddars_waiter_sync', { detail: callsList }));
  } catch {}
}

function calculateStats(ordersList) {
  const list = Array.isArray(ordersList) ? ordersList : [];
  const now = new Date();
  const todayUtc = now.toISOString().slice(0, 10);
  const todaysOrders = list.filter(o => {
    if (!o.createdAt) return false;
    if (o.createdAt.startsWith(todayUtc)) return true;
    const od = new Date(o.createdAt);
    return (
      od.getFullYear() === now.getFullYear() &&
      od.getMonth() === now.getMonth() &&
      od.getDate() === now.getDate()
    );
  });
  return {
    pendingCount: list.filter(o => o.status === 'New').length,
    preparingCount: list.filter(o => o.status === 'Preparing').length,
    readyCount: list.filter(o => o.status === 'Ready').length,
    completedToday: todaysOrders.filter(o => o.status === 'Completed').length,
    revenueToday: todaysOrders
      .filter(o => ['Completed', 'Ready', 'Preparing', 'New'].includes(o.status))
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    totalOrders: list.length
  };
}

// -------------------------------------------------------------
// GUEST LOGIN / TABLE CHECK-IN MODAL
// -------------------------------------------------------------
function GuestLoginModal({ guest, onSaveGuest, onLogoutGuest, isOpen, onClose }) {
  const [name, setName] = useState(guest?.name || '');
  const [table, setTable] = useState(guest?.table || 'Table 1');
  const [diningMode, setDiningMode] = useState(guest?.mode || 'Dine in');
  const [error, setError] = useState('');

  useEffect(() => {
    if (guest) {
      setName(guest.name || '');
      setTable(guest.table || 'Table 1');
      setDiningMode(guest.mode || 'Dine in');
    } else {
      setName('');
      setTable('Table 1');
      setDiningMode('Dine in');
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
    'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6',
    'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11', 'Table 12'
  ];

  return (
    <div className="guest-login-overlay" onClick={guest?.name ? onClose : undefined}>
      <div className="guest-login-card compact-modal" onClick={e => e.stopPropagation()}>
        <div className="guest-modal-top">
          <div className="brand-mark guest-modal-logo">
            <UtensilsCrossed size={18} />
          </div>
          <div>
            <h2>Table Check-in</h2>
            <p className="guest-login-sub">THE PODDAR'S COURTYARD</p>
          </div>
        </div>

        {error && (
          <div className="chef-login-error">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="guest-form">
          <div className="chef-input-group">
            <label><User size={12} /> Guest / Party Name</label>
            <div className="chef-input-box">
              <User size={15} />
              <input
                placeholder="Enter your name (e.g. Aarav)"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="chef-input-group" style={{ marginTop: '10px' }}>
            <label><UtensilsCrossed size={12} /> Dining Mode</label>
            <div className="mode-switch-compact">
              <button
                type="button"
                className={diningMode === 'Dine in' ? 'active' : ''}
                onClick={() => setDiningMode('Dine in')}
              >
                <UtensilsCrossed size={14} />
                <span>Dine In</span>
              </button>
              <button
                type="button"
                className={diningMode === 'Self pickup' ? 'active' : ''}
                onClick={() => setDiningMode('Self pickup')}
              >
                <ShoppingBag size={14} />
                <span>Takeaway</span>
              </button>
            </div>
          </div>

          {diningMode === 'Dine in' && (
            <div className="chef-input-group" style={{ marginTop: '10px' }}>
              <label><MapPin size={12} /> Select Table Number</label>
              <div className="guest-table-grid compact-grid">
                {quickTables.map(t => (
                  <button
                    type="button"
                    key={t}
                    className={`guest-table-chip ${table === t ? 'selected' : ''}`}
                    onClick={() => setTable(t)}
                  >
                    {t.replace('Table ', 'T')}
                  </button>
                ))}
              </div>
              <div className="chef-input-box" style={{ marginTop: '6px' }}>
                <MapPin size={14} />
                <input
                  placeholder="Or enter custom table (e.g. Table 15, VIP)"
                  value={table}
                  onChange={e => setTable(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          <button type="submit" className="chef-login-btn" style={{ marginTop: '14px', padding: '11px' }}>
            <span>Save & View Menu →</span>
          </button>

          {guest?.name && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="chef-back-link"
                onClick={onClose}
                style={{ flex: 1, justifyContent: 'center', margin: 0, padding: '6px', fontSize: '12px' }}
              >
                Cancel / Close
              </button>
              <button
                type="button"
                onClick={onLogoutGuest}
                style={{
                  background: 'transparent',
                  border: '1px solid #fca5a5',
                  color: '#ef4444',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CALL WAITER / TABLE ASSISTANCE MODAL
// -------------------------------------------------------------
function CallWaiterModal({
  isOpen,
  onClose,
  guest,
  onSaveGuest,
  activeCalls = [],
  onCallSuccess,
  onCancelCall,
  onOpenKitchen
}) {
  const [reason, setReason] = useState('General Assistance');
  const [customNote, setCustomNote] = useState('');
  const [table, setTable] = useState(guest?.table || 'Table 1');
  const [guestName, setGuestName] = useState(guest?.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (guest) {
      setTable(guest.table || 'Table 1');
      setGuestName(guest.name || '');
    }
  }, [guest, isOpen]);

  if (!isOpen) return null;

  const quickReasons = [
    { label: 'General Assistance', icon: '🛎️', desc: 'Need help or recommendations' },
    { label: 'Water Refill', icon: '💧', desc: 'Bring fresh chilled/warm water' },
    { label: 'Cutlery & Napkins', icon: '🍴', desc: 'Extra spoons, forks, plates' },
    { label: 'Clean Table', icon: '🧹', desc: 'Clear used plates or wipe table' },
    { label: 'Request Bill / Check', icon: '🧾', desc: 'Ready for bill or payment' },
    { label: 'Special Request', icon: '💬', desc: 'Custom instructions or question' }
  ];

  const quickTables = [
    'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6',
    'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11', 'Table 12'
  ];

  // Check if there is an active pending call for this table
  const pendingForThisTable = activeCalls.filter(
    c => c.status === 'Pending' && (c.table === table || (guest?.table && c.table === guest.table))
  );

  const handleSubmitCall = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!table.trim()) {
      setError('Please select or enter your table number.');
      return;
    }
    setError('');
    setSubmitting(true);

    const callPayload = {
      table: table.trim(),
      guestName: guestName.trim(),
      reason,
      customNote: customNote.trim()
    };

    // Update guest session if changed
    if (onSaveGuest && (!guest?.name || guest.name !== guestName || guest.table !== table)) {
      onSaveGuest({
        name: guestName.trim(),
        table: table.trim(),
        mode: 'Dine in'
      });
    }

    let createdCall = null;
    try {
      const res = await fetch('/api/waiter-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPayload)
      });
      if (res.ok) {
        createdCall = await res.json();
      }
    } catch (err) {
      console.warn('Backend offline, saving waiter call locally');
    }

    if (!createdCall) {
      createdCall = {
        id: `CALL-${Math.floor(1000 + Math.random() * 9000)}`,
        table: callPayload.table,
        guestName: callPayload.guestName,
        reason: callPayload.reason,
        customNote: callPayload.customNote,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        attendedAt: null,
        attendedBy: null
      };
    }

    // Save to local storage
    const currentList = getLocalWaiterCalls();
    const updatedList = [createdCall, ...currentList.filter(c => c.id !== createdCall.id)];
    saveLocalWaiterCalls(updatedList);

    setSubmitting(false);
    setSuccessNotice(createdCall);
    if (onCallSuccess) onCallSuccess(createdCall);
  };

  return (
    <div className="guest-login-overlay" onClick={onClose}>
      <div className="guest-login-card call-waiter-modal-card" onClick={e => e.stopPropagation()}>
        <div className="guest-modal-top">
          <div className="brand-mark call-waiter-icon-box">
            <BellRing size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2>Call Waiter</h2>
              <button type="button" className="modal-close-icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <p className="guest-login-sub">Instant staff notification to your table</p>
          </div>
        </div>

        {/* Existing Active Calls for this table */}
        {pendingForThisTable.length > 0 && !successNotice && (
          <div className="active-call-alert-card">
            <div className="active-call-pulse-dot"></div>
            <div className="active-call-content">
              <b>🛎️ Active Waiter Request for {table}</b>
              <p>Requested: <i>"{pendingForThisTable[0].reason}"</i></p>
              <small>{timeAgo(pendingForThisTable[0].createdAt)} • Kitchen & staff alerted</small>
            </div>
            {onCancelCall && (
              <button
                type="button"
                className="cancel-call-mini-btn"
                onClick={() => onCancelCall(pendingForThisTable[0].id)}
              >
                Cancel Call
              </button>
            )}
          </div>
        )}

        {successNotice ? (
          <div className="call-success-panel">
            <div className="call-success-ring-animation">
              <CheckCircle2 size={44} color="var(--brand-primary)" />
            </div>
            <h3>Waiter Called Successfully!</h3>
            <p>
              The kitchen display system and service staff have been notified for <b>{successNotice.table}</b>.
            </p>
            <div className="call-success-summary-box">
              <div><span>Table:</span> <b>{successNotice.table}</b></div>
              <div><span>Request:</span> <b>{successNotice.reason}</b></div>
              {successNotice.customNote && <div><span>Note:</span> <i>"{successNotice.customNote}"</i></div>}
            </div>
            <div className="call-success-actions">
              <button
                type="button"
                className="call-success-done-btn"
                onClick={() => {
                  setSuccessNotice(null);
                  onClose();
                }}
              >
                Done
              </button>
              {onOpenKitchen && (
                <button
                  type="button"
                  className="call-success-kitchen-btn"
                  onClick={() => {
                    setSuccessNotice(null);
                    onClose();
                    onOpenKitchen();
                  }}
                  title="Switch to Kitchen / KDS Display"
                >
                  <ChefHat size={14} /> Open Kitchen Display
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCall} className="call-waiter-form">
            {error && (
              <div className="chef-login-error">
                <AlertTriangle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Table & Guest row */}
            <div className="call-waiter-meta-row">
              <div className="chef-input-group" style={{ flex: 1 }}>
                <label><User size={12} /> Your Name</label>
                <div className="chef-input-box">
                  <User size={14} />
                  <input
                    placeholder="Guest Name"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="chef-input-group" style={{ width: '130px' }}>
                <label><MapPin size={12} /> Table</label>
                <div className="chef-input-box">
                  <MapPin size={14} />
                  <input
                    placeholder="Table"
                    value={table}
                    onChange={e => setTable(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Quick Table Switcher Chips */}
            <div className="call-table-chips-scroll">
              {quickTables.map(t => (
                <button
                  type="button"
                  key={t}
                  className={`guest-table-chip ${table === t ? 'selected' : ''}`}
                  onClick={() => setTable(t)}
                >
                  {t.replace('Table ', 'T')}
                </button>
              ))}
            </div>

            {/* Reason Selection Grid */}
            <div className="chef-input-group" style={{ marginTop: '14px' }}>
              <label><Bell size={12} /> What do you need assistance with?</label>
              <div className="call-reasons-grid">
                {quickReasons.map(r => {
                  const isSelected = reason === r.label;
                  return (
                    <button
                      type="button"
                      key={r.label}
                      className={`call-reason-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setReason(r.label)}
                    >
                      <span className="call-reason-icon">{r.icon}</span>
                      <div className="call-reason-text">
                        <b>{r.label}</b>
                        <small>{r.desc}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note */}
            <div className="chef-input-group" style={{ marginTop: '12px' }}>
              <label><MessageSquare size={12} /> Additional Note / Special Request (Optional)</label>
              <div className="chef-input-box">
                <input
                  placeholder="e.g. Please bring warm water, extra napkins..."
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  maxLength={150}
                />
              </div>
            </div>

            <div className="call-waiter-submit-wrap">
              <button
                type="submit"
                className="call-waiter-submit-btn"
                disabled={submitting}
              >
                <BellRing size={18} />
                <span>{submitting ? 'Ringing Kitchen Staff...' : `Ring Waiter for ${table || 'Table'}`}</span>
              </button>
            </div>

            {onOpenKitchen && (
              <div className="call-waiter-modal-footer">
                <button
                  type="button"
                  className="modal-staff-link"
                  onClick={() => {
                    onClose();
                    onOpenKitchen();
                  }}
                >
                  <ChefHat size={13} /> Staff & Kitchen Display
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// AUTHORIZED KITCHEN & LEADERSHIP TEAM
// -------------------------------------------------------------
const AUTHORIZED_CHEFS = [
  { name: 'CHEF AARAV', id: 'CHEF 1910', role: 'Founder & Executive Chef', idVariations: ['CHEF 1910', 'CHEF1910', '1910', 'CHEF-1910', 'AARAV'] },
  { name: 'ANKIT PODDAR', id: 'MD 1602', role: 'Managing Director (MD)', idVariations: ['MD 1602', 'MD1602', 'CHEF 1602', 'CHEF1602', '1602', 'CHEF-1602', 'ANKIT', 'ANKIT PODDAR'] },
  { name: 'EKTA PODDAR', id: 'COO 0804', role: 'Executive Director & COO', idVariations: ['COO 0804', 'COO0804', 'CHEF 0804', 'CHEF0804', '0804', 'CHEF-0804', 'ED 0804', 'EKTA', 'EKTA PODDAR'] },
  { name: 'CHEF VANISHA', id: 'CHEF 0101', role: 'Head Chef & Kitchen Director', idVariations: ['CHEF 0101', 'CHEF0101', '0101', 'CHEF-0101', 'VANISHA'] }
];

// -------------------------------------------------------------
// CHEF LOGIN SCREEN COMPONENT
// -------------------------------------------------------------
function ChefLogin({ onLogin, onBackToMenu }) {
  const [name, setName] = useState('');
  const [chefId, setChefId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (redirecting) return;
    if (!name.trim() || !chefId.trim()) {
      setError('Please enter both your Chef Name and Staff ID.');
      return;
    }
    setError('');
    setLoading(true);

    const normName = name.trim().toUpperCase().replace(/^CHEF\s*/, '');
    const normId = chefId.trim().toUpperCase().replace(/[\s-]/g, '');

    const matched = AUTHORIZED_CHEFS.find(c => {
      const chefCoreName = c.name.toUpperCase().replace(/^CHEF\s*/, '');
      const nameMatch = normName === chefCoreName || normName === c.name.toUpperCase();
      const idMatch = c.idVariations.some(v => v.replace(/[\s-]/g, '').toUpperCase() === normId);
      return nameMatch && idMatch;
    });

    if (!matched) {
      setError('Sorry, you are not a chef.');
      setRedirecting(true);
      setLoading(false);
      setTimeout(() => {
        onBackToMenu();
      }, 1800);
      return;
    }

    try {
      const res = await fetch('/api/chef/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), chefId: chefId.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        onLogin(data.chef, data.token);
        return;
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 || data.error) {
          setError(data.error || 'Sorry, you are not a chef.');
          setRedirecting(true);
          setTimeout(() => {
            onBackToMenu();
          }, 1800);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend server offline, logging in with verified local profile:', err);
    } finally {
      setLoading(false);
    }

    // Authenticated local login
    const fallbackChef = {
      id: matched.id,
      name: matched.name,
      role: matched.role,
      loggedInAt: new Date().toISOString()
    };
    const fallbackToken = `kds_token_${Date.now()}_${matched.id.replace(/\s+/g, '')}`;
    onLogin(fallbackChef, fallbackToken);
  };

  return (
    <div className="chef-login-screen">
      <div className="chef-login-card">
        <div className="chef-login-badge">
          <ChefHat size={32} />
        </div>
        <h2>Kitchen Portal Access</h2>
        <p className="chef-login-subtitle">THE PODDAR'S COURTYARD Kitchen Display System (KDS)</p>

        {error && (
          <div className="chef-login-error" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#dc2626', padding: '12px 14px', borderRadius: '10px' }}>
            <AlertTriangle size={16} />
            <div>
              <b style={{ display: 'block', fontSize: '13px' }}>{error}</b>
              {redirecting && <span style={{ fontSize: '11px', opacity: 0.85 }}>Returning back to menu page...</span>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="chef-login-form">
          <div className="chef-input-group">
            <label><User size={13} /> Chef Name</label>
            <div className="chef-input-box">
              <User size={16} />
              <input
                placeholder="e.g. CHEF AARAV"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={redirecting}
                autoFocus
              />
            </div>
          </div>

          <div className="chef-input-group">
            <label><Lock size={13} /> Staff ID / Passcode</label>
            <div className="chef-input-box">
              <Lock size={16} />
              <input
                placeholder="e.g. CHEF 1910"
                value={chefId}
                onChange={e => setChefId(e.target.value)}
                disabled={redirecting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="chef-login-btn"
            disabled={loading || redirecting}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Authenticating...' : redirecting ? 'Access Denied' : 'Enter Kitchen Display →'}</span>
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
  const [orders, setOrders] = useState(() => getLocalOrders());
  const [stats, setStats] = useState(() => calculateStats(getLocalOrders()));
  const [waiterCalls, setWaiterCalls] = useState(() => getLocalWaiterCalls());
  const [waiterFilter, setWaiterFilter] = useState('Active'); // 'Active' | 'Attended' | 'All'
  const [activeTab, setActiveTab] = useState('New'); // 'New' | 'Preparing' | 'Ready' | 'AllActive' | 'History' | 'ServiceCalls'
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Kitchen unable to fulfill order at this time.');
  const [prepTimes, setPrepTimes] = useState({}); // { [orderId]: 15 }
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const prevPendingCount = useRef(0);
  const prevPendingCallsCount = useRef(0);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrdersAndStats = async () => {
    let fetchedOrders = null;
    let fetchedStats = null;
    let fetchedCalls = null;
    try {
      const [ordersRes, statsRes, callsRes] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/stats').catch(() => null),
        fetch('/api/waiter-calls').catch(() => null)
      ]);
      if (ordersRes && ordersRes.ok) {
        fetchedOrders = await ordersRes.json();
      }
      if (statsRes && statsRes.ok) {
        fetchedStats = await statsRes.json();
      }
      if (callsRes && callsRes.ok) {
        fetchedCalls = await callsRes.json();
      }
    } catch (err) {
      console.warn('Backend API offline, syncing with local storage:', err);
    }

    if (fetchedOrders) {
      setOrders(fetchedOrders);
      saveLocalOrders(fetchedOrders);
    } else {
      const local = getLocalOrders();
      setOrders(local);
      fetchedOrders = local;
    }

    if (fetchedCalls) {
      setWaiterCalls(fetchedCalls);
      saveLocalWaiterCalls(fetchedCalls);
    } else {
      const localCalls = getLocalWaiterCalls();
      setWaiterCalls(localCalls);
      fetchedCalls = localCalls;
    }

    if (fetchedStats) {
      setStats(fetchedStats);
      if (onOrderStatsChange) onOrderStatsChange(fetchedStats);
    } else {
      const computed = calculateStats(fetchedOrders || []);
      setStats(computed);
      if (onOrderStatsChange) onOrderStatsChange(computed);
    }

    const currentPending = (fetchedStats ? fetchedStats.pendingCount : (fetchedOrders?.filter(o => o.status === 'New').length || 0));
    if (currentPending > prevPendingCount.current && soundEnabled) {
      playKitchenChime();
    }
    prevPendingCount.current = currentPending;

    const currentPendingCalls = (fetchedCalls ? fetchedCalls.filter(c => c.status === 'Pending').length : (getLocalWaiterCalls().filter(c => c.status === 'Pending').length));
    if (currentPendingCalls > prevPendingCallsCount.current && soundEnabled) {
      playWaiterCallChime();
    }
    prevPendingCallsCount.current = currentPendingCalls;
  };

  // SSE Stream and Polling fallback + Cross-tab local sync
  useEffect(() => {
    fetchOrdersAndStats();

    const handleLocalSync = (e) => {
      const list = e.detail || getLocalOrders();
      setOrders(list);
      const computed = calculateStats(list);
      setStats(computed);
      if (onOrderStatsChange) onOrderStatsChange(computed);
    };

    const handleWaiterLocalSync = (e) => {
      const list = e.detail || getLocalWaiterCalls();
      setWaiterCalls(list);
    };

    window.addEventListener('poddars_orders_sync', handleLocalSync);
    window.addEventListener('poddars_waiter_sync', handleWaiterLocalSync);
    window.addEventListener('storage', handleLocalSync);
    window.addEventListener('storage', handleWaiterLocalSync);

    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('order:created', (e) => {
        const newOrder = JSON.parse(e.data);
        setOrders(prev => {
          const list = [newOrder, ...prev.filter(o => o.id !== newOrder.id)];
          saveLocalOrders(list);
          return list;
        });
        fetchOrdersAndStats();
        if (soundEnabled) playKitchenChime();
      });
      eventSource.addEventListener('order:updated', (e) => {
        const updatedOrder = JSON.parse(e.data);
        setOrders(prev => {
          const list = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
          saveLocalOrders(list);
          return list;
        });
        fetchOrdersAndStats();
      });
      eventSource.addEventListener('order:deleted', (e) => {
        const { id } = JSON.parse(e.data);
        setOrders(prev => {
          const list = prev.filter(o => o.id !== id);
          saveLocalOrders(list);
          return list;
        });
        fetchOrdersAndStats();
      });

      // Waiter Call SSE Events
      eventSource.addEventListener('waiter:called', (e) => {
        const newCall = JSON.parse(e.data);
        setWaiterCalls(prev => {
          const list = [newCall, ...prev.filter(c => c.id !== newCall.id)];
          saveLocalWaiterCalls(list);
          return list;
        });
        if (soundEnabled) playWaiterCallChime();
      });
      eventSource.addEventListener('waiter:updated', (e) => {
        const updatedCall = JSON.parse(e.data);
        setWaiterCalls(prev => {
          const list = prev.map(c => c.id === updatedCall.id ? updatedCall : c);
          saveLocalWaiterCalls(list);
          return list;
        });
      });
      eventSource.addEventListener('waiter:deleted', (e) => {
        const { id } = JSON.parse(e.data);
        setWaiterCalls(prev => {
          const list = prev.filter(c => c.id !== id);
          saveLocalWaiterCalls(list);
          return list;
        });
      });
    } catch (e) {
      console.warn('SSE not available, falling back to polling');
    }

    const interval = setInterval(fetchOrdersAndStats, 3500);
    return () => {
      clearInterval(interval);
      window.removeEventListener('poddars_orders_sync', handleLocalSync);
      window.removeEventListener('poddars_waiter_sync', handleWaiterLocalSync);
      window.removeEventListener('storage', handleLocalSync);
      window.removeEventListener('storage', handleWaiterLocalSync);
      if (eventSource) eventSource.close();
    };
  }, [soundEnabled]);

  const handleAttendWaiterCall = async (callId) => {
    const now = new Date().toISOString();
    const staffName = chefAuth?.name || 'Chef';
    setWaiterCalls(prev => {
      const list = prev.map(c => c.id === callId ? { ...c, status: 'Attended', attendedAt: now, attendedBy: staffName } : c);
      saveLocalWaiterCalls(list);
      return list;
    });
    try {
      await fetch(`/api/waiter-calls/${callId}/attend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendedBy: staffName })
      });
    } catch (err) {
      console.warn('Attend call synced locally');
    }
  };

  const handleDismissWaiterCall = async (callId) => {
    const now = new Date().toISOString();
    setWaiterCalls(prev => {
      const list = prev.map(c => c.id === callId ? { ...c, status: 'Dismissed', attendedAt: now } : c);
      saveLocalWaiterCalls(list);
      return list;
    });
    try {
      await fetch(`/api/waiter-calls/${callId}/dismiss`, { method: 'PATCH' });
    } catch (err) {
      console.warn('Dismiss call synced locally');
    }
  };

  const handleDeleteWaiterCall = async (callId) => {
    setWaiterCalls(prev => {
      const list = prev.filter(c => c.id !== callId);
      saveLocalWaiterCalls(list);
      return list;
    });
    try {
      await fetch(`/api/waiter-calls/${callId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete call synced locally');
    }
  };

  const handleApprove = async (orderId) => {
    const prepTime = prepTimes[orderId] || 15;
    // Update local state immediately
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Preparing',
            approvedAt: new Date().toISOString(),
            estimatedPrepTime: prepTime,
            approvedBy: chefAuth?.name || 'Chef'
          };
        }
        return o;
      });
      saveLocalOrders(updated);
      setStats(calculateStats(updated));
      return updated;
    });

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
        setOrders(prev => {
          const list = prev.map(o => o.id === updated.id ? updated : o);
          saveLocalOrders(list);
          setStats(calculateStats(list));
          return list;
        });
      }
    } catch (err) {
      console.warn('Approve synced to local storage');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const now = new Date().toISOString();
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          const mod = { ...o, status: newStatus };
          if (newStatus === 'Preparing' && !mod.approvedAt) mod.approvedAt = now;
          if (newStatus === 'Ready') mod.readyAt = now;
          if (newStatus === 'Completed') mod.completedAt = now;
          if (newStatus === 'Cancelled') mod.cancelledAt = now;
          return mod;
        }
        return o;
      });
      saveLocalOrders(updated);
      setStats(calculateStats(updated));
      return updated;
    });

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => {
          const list = prev.map(o => o.id === updated.id ? updated : o);
          saveLocalOrders(list);
          setStats(calculateStats(list));
          return list;
        });
      }
    } catch (err) {
      console.warn('Status change synced to local storage');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingOrder) return;
    const orderId = rejectingOrder.id;
    const now = new Date().toISOString();
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Cancelled',
            cancelledAt: now,
            rejectionReason: rejectReason
          };
        }
        return o;
      });
      saveLocalOrders(updated);
      setStats(calculateStats(updated));
      return updated;
    });
    setRejectingOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => {
          const list = prev.map(o => o.id === updated.id ? updated : o);
          saveLocalOrders(list);
          setStats(calculateStats(list));
          return list;
        });
      }
    } catch (err) {
      console.warn('Rejection synced to local storage');
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Remove this order ticket from kitchen history?')) return;
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId);
      saveLocalOrders(updated);
      setStats(calculateStats(updated));
      return updated;
    });

    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete synced to local storage');
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
    const newDemoOrder = {
      id: `TP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
      guestName: 'Chef Table Test',
      mode: 'Dine in',
      table: `Table ${Math.floor(Math.random() * 12) + 1}`,
      items: demoItems,
      instructions: 'Extra spicy Butter Chicken, serve hot naan with melted butter.',
      subtotal,
      gst,
      total,
      estimatedPrepTime: null,
      approvedAt: null,
      readyAt: null,
      completedAt: null,
      cancelledAt: null,
      chefNote: '',
      rejectionReason: null
    };

    setOrders(prev => {
      const updated = [newDemoOrder, ...prev];
      saveLocalOrders(updated);
      setStats(calculateStats(updated));
      return updated;
    });

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: newDemoOrder.guestName,
          mode: newDemoOrder.mode,
          table: newDemoOrder.table,
          items: newDemoOrder.items,
          instructions: newDemoOrder.instructions,
          subtotal,
          gst,
          total
        })
      });
      fetchOrdersAndStats();
    } catch (e) {
      console.warn('Demo order created locally');
    }
  };

  const pendingCallsCount = waiterCalls.filter(c => c.status === 'Pending').length;
  const attendedCallsCount = waiterCalls.filter(c => c.status === 'Attended').length;

  const filteredWaiterCalls = useMemo(() => {
    return waiterCalls.filter(c => {
      let matchStatus = true;
      if (waiterFilter === 'Active') matchStatus = c.status === 'Pending';
      else if (waiterFilter === 'Attended') matchStatus = c.status === 'Attended';

      let matchSearch = true;
      if (search.trim()) {
        const q = search.toLowerCase();
        matchSearch = (
          (c.table && c.table.toLowerCase().includes(q)) ||
          (c.guestName && c.guestName.toLowerCase().includes(q)) ||
          (c.reason && c.reason.toLowerCase().includes(q)) ||
          (c.customNote && c.customNote.toLowerCase().includes(q))
        );
      }
      return matchStatus && matchSearch;
    });
  }, [waiterCalls, waiterFilter, search]);

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

      {/* Urgent Table Waiter Call Alert Banner */}
      {pendingCallsCount > 0 && (
        <div className="kds-urgent-service-banner" onClick={() => setActiveTab('ServiceCalls')}>
          <div className="kds-urgent-service-pulse">
            <BellRing size={20} className="kds-bell-shake" />
          </div>
          <div className="kds-urgent-service-text">
            <b>🚨 {pendingCallsCount} TABLE SERVICE CALL{pendingCallsCount > 1 ? 'S' : ''} PENDING ASSISTANCE!</b>
            <span>
              {waiterCalls.filter(c => c.status === 'Pending').map(c => `${c.table}: ${c.reason}`).slice(0, 3).join(' • ')}
              {pendingCallsCount > 3 ? ` • and ${pendingCallsCount - 3} more` : ''}
            </span>
          </div>
          <button
            type="button"
            className="kds-urgent-service-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('ServiceCalls');
            }}
          >
            <span>View Service Calls</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

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
          <div className="stat-icon-box revenue">
            <b style={{ fontSize: '20px' }}>₹</b>
          </div>
          <div className="stat-data">
            <span className="stat-val">{formatPrice(stats.revenueToday)}</span>
            <span className="stat-lbl">Today's Revenue</span>
          </div>
        </div>
      </div>

      {/* Authorized Kitchen Team Roster */}
      <div className="kds-team-roster-card">
        <div className="kds-team-header">
          <div className="kds-team-title">
            <ShieldCheck size={16} color="var(--brand-primary)" />
            <span>Authorized Kitchen Chefs (4 Verified Staff)</span>
          </div>
          <span className="kds-team-sub">Access Control: Only active registered staff can approve tickets</span>
        </div>
        <div className="kds-team-grid">
          {AUTHORIZED_CHEFS.map(chef => {
            const isCurrent = chefAuth?.id === chef.id || chefAuth?.name?.toUpperCase() === chef.name.toUpperCase();
            return (
              <div key={chef.id} className={`kds-team-member ${isCurrent ? 'active-duty' : ''}`}>
                <div className="kds-member-avatar">
                  {chef.name.includes('VANISHA') ? '👩‍🍳' : chef.name.includes('EKTA') ? '👩‍💼' : chef.name.includes('ANKIT') ? '👨‍💼' : '👨‍🍳'}
                </div>
                <div className="kds-member-info">
                  <div className="kds-member-top">
                    <b>{chef.name}</b>
                    {isCurrent && <span className="kds-active-badge">● Active Now</span>}
                  </div>
                  <span className="kds-member-role">{chef.role} • <code>{chef.id}</code></span>
                </div>
              </div>
            );
          })}
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

          {/* Waiter Calls Tab */}
          <button
            type="button"
            className={'kds-tab-btn ' + (activeTab === 'ServiceCalls' ? 'active' : '') + (pendingCallsCount > 0 ? ' has-service-alert' : '')}
            onClick={() => setActiveTab('ServiceCalls')}
          >
            <BellRing size={14} className={pendingCallsCount > 0 ? 'kds-bell-shake' : ''} />
            <span>Waiter Calls</span>
            {pendingCallsCount > 0 ? (
              <b className="kds-tab-count alert">{pendingCallsCount}</b>
            ) : waiterCalls.length > 0 ? (
              <b className="kds-tab-count">{waiterCalls.length}</b>
            ) : null}
          </button>
        </div>

        <div className="kds-search">
          <Search size={15} />
          <input
            placeholder="Search tickets, table #, items, service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* MAIN KDS CONTENT: Service Calls Board OR Orders Grid */}
      {activeTab === 'ServiceCalls' ? (
        <div className="kds-service-board">
          <div className="kds-service-board-header">
            <div className="kds-service-filter-group">
              <button
                type="button"
                className={`kds-service-subtab ${waiterFilter === 'Active' ? 'active' : ''}`}
                onClick={() => setWaiterFilter('Active')}
              >
                <span>🚨 Pending Calls</span>
                <b className="kds-tab-count alert">{pendingCallsCount}</b>
              </button>
              <button
                type="button"
                className={`kds-service-subtab ${waiterFilter === 'Attended' ? 'active' : ''}`}
                onClick={() => setWaiterFilter('Attended')}
              >
                <span>✅ Attended</span>
                <b className="kds-tab-count">{attendedCallsCount}</b>
              </button>
              <button
                type="button"
                className={`kds-service-subtab ${waiterFilter === 'All' ? 'active' : ''}`}
                onClick={() => setWaiterFilter('All')}
              >
                <span>All Calls</span>
                <b className="kds-tab-count">{waiterCalls.length}</b>
              </button>
            </div>

            <div className="kds-service-actions-right">
              {waiterCalls.length > 0 && (
                <button
                  type="button"
                  className="kds-btn-tool"
                  onClick={() => {
                    if (confirm('Clear all attended/dismissed service calls?')) {
                      const remaining = waiterCalls.filter(c => c.status === 'Pending');
                      setWaiterCalls(remaining);
                      saveLocalWaiterCalls(remaining);
                    }
                  }}
                >
                  <Trash2 size={14} /> Clear History
                </button>
              )}
            </div>
          </div>

          {filteredWaiterCalls.length > 0 ? (
            <div className="kds-service-cards-grid">
              {filteredWaiterCalls.map(call => {
                const isPending = call.status === 'Pending';
                const createdTime = new Date(call.createdAt || Date.now()).getTime();
                const elapsedMins = Math.max(0, Math.floor((Date.now() - createdTime) / 60000));
                const isUrgent = isPending && elapsedMins >= 3;

                return (
                  <div
                    key={call.id}
                    className={`kds-service-card ${isPending ? (isUrgent ? 'urgent' : 'pending') : 'attended'}`}
                  >
                    <div className="kds-service-card-head">
                      <div className="kds-service-table-badge">
                        <MapPin size={16} />
                        <b>{call.table}</b>
                      </div>
                      <span className={`kds-service-status-pill ${isPending ? (isUrgent ? 'urgent' : 'pending') : 'attended'}`}>
                        {isPending ? (isUrgent ? '⚠️ WAITING > 3m' : '🚨 PENDING') : '✅ ATTENDED'}
                      </span>
                    </div>

                    <div className="kds-service-reason-box">
                      <div className="kds-service-reason-title">
                        <b>{call.reason}</b>
                      </div>
                      {call.customNote && (
                        <p className="kds-service-note">
                          "{call.customNote}"
                        </p>
                      )}
                    </div>

                    <div className="kds-service-guest-meta">
                      <div>
                        <span>Guest:</span> <b>{call.guestName || 'Guest'}</b>
                      </div>
                      <div>
                        <span>Time:</span> <b>{timeAgo(call.createdAt)}</b>
                      </div>
                      {call.attendedBy && (
                        <div style={{ color: '#047857', fontSize: '11px', marginTop: '2px', fontWeight: '600' }}>
                          ✓ Attended by: <b>{call.attendedBy}</b>
                        </div>
                      )}
                    </div>

                    <div className="kds-service-card-actions">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            className="kds-btn-attend-service"
                            onClick={() => handleAttendWaiterCall(call.id)}
                          >
                            <CheckCircle2 size={16} />
                            <span>Mark Attended ({chefAuth?.name || 'Chef'})</span>
                          </button>
                          <button
                            type="button"
                            className="kds-btn-dismiss-service"
                            onClick={() => handleDismissWaiterCall(call.id)}
                            title="Dismiss call"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <div className="kds-service-attended-footer">
                          <span>Attended {timeAgo(call.attendedAt)}</span>
                          <button
                            type="button"
                            className="kds-btn-delete-mini"
                            onClick={() => handleDeleteWaiterCall(call.id)}
                            title="Delete call ticket"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="kds-empty-state" style={{ padding: '60px 20px' }}>
              <BellRing size={44} color="var(--brand-primary)" />
              <h3>No Waiter Service Calls</h3>
              <p>
                {waiterFilter === 'Active'
                  ? 'All table service calls have been attended! No guests are currently waiting for assistance.'
                  : 'No table calls match the selected filter.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Orders Grid */
        <div className="kds-orders-grid">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const selectedPrep = prepTimes[order.id] || order.estimatedPrepTime || 15;
              const createdTime = new Date(order.createdAt || Date.now()).getTime();
              const elapsedMins = Math.max(0, Math.floor((Date.now() - createdTime) / 60000));
              const targetPrep = order.estimatedPrepTime || selectedPrep || 15;
              const remainingMins = Math.max(0, targetPrep - elapsedMins);
              const isOverdue = order.status === 'Preparing' && elapsedMins > targetPrep;

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

                  {/* Metadata with High-Contrast Cooking Time Chip */}
                  <div className="kds-card-meta">
                    <span className="kds-order-time">
                      <Clock size={13} />
                      <span>Ordered {timeAgo(order.createdAt)}</span>
                    </span>
                    <span className={`kds-prep-chip status-chip-${order.status?.toLowerCase()}`}>
                      <Clock3 size={13} />
                      <b>{targetPrep}m Prep Target</b>
                    </span>
                  </div>

                  {/* High-Visibility Cooking In Progress Timer Banner */}
                  {order.status === 'Preparing' && (
                    <div className={`kds-cooking-banner ${isOverdue ? 'overdue' : 'on-track'}`}>
                      <div className="kds-cooking-pulse"></div>
                      <Flame size={18} className="kds-flame-icon" />
                      <div className="kds-cooking-info">
                        <div className="kds-cooking-timer-row">
                          <b className="kds-cooking-primary-timer">
                            {isOverdue ? `⚠️ OVERDUE (+${elapsedMins - targetPrep}m)` : `⏳ ~${remainingMins} mins remaining`}
                          </b>
                          <span className="kds-cooking-target-badge">{targetPrep}m Target</span>
                        </div>
                        <span className="kds-cooking-elapsed-sub">
                          Elapsed: {elapsedMins} mins • Placed {timeAgo(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status: Ready Banner */}
                  {order.status === 'Ready' && (
                    <div className="kds-ready-banner">
                      <UtensilsCrossed size={16} />
                      <div>
                        <b>FOOD READY & PLATED</b>
                        <span>Completed in ~{elapsedMins}m • Ready for table delivery</span>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
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

                    {/* Status: NEW (Needs Approval & Prep Time Selection) */}
                    {order.status === 'New' && (
                      <>
                        <div className="kds-prep-selector">
                          <span className="kds-prep-label">⏱️ COOK TIME:</span>
                          <div className="kds-prep-btns-wrap">
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
                        </div>

                        <div className="kds-action-buttons">
                          <button
                            type="button"
                            className="kds-btn-approve"
                            onClick={() => handleApprove(order.id)}
                          >
                            <Check size={16} />
                            <span>Approve & Start ({selectedPrep}m)</span>
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
                          <span>✓ Mark Cooking Complete & Food Ready</span>
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
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: '600' }}>
                          {order.status === 'Completed' ? '✓ Served & Done' : '✕ Cancelled Ticket'}
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
      )}

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
// FINAL BILL & INVOICE MODAL (SHOWS COMPLETE ITEMIZED BILL)
// -------------------------------------------------------------
function FinalBillModal({ order, onClose, onAddMore, onPrintAndLogout }) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'waiter'
  const [isPaid, setIsPaid] = useState(order?.paymentStatus === 'Paid' || false);
  const [settling, setSettling] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(order?.guestName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [waiterRequested, setWaiterRequested] = useState(false);

  const upiId = 'aaravpoddar19@okicici';
  const payeeName = 'Aarav Poddar';

  if (!order) return null;

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = orderDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subtotal = Number(order.subtotal || order.items?.reduce((s, i) => s + (i.price * i.qty), 0) || 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const gst = cgst + sgst;
  const total = subtotal + gst;

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    }
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
    setCardError('');
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
    setCardError('');
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCvv(val);
    setCardError('');
  };

  const handleProcessCardPayment = (e) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 15) {
      setCardError('Please enter a valid 16-digit card number');
      return;
    }
    if (!cardHolder.trim()) {
      setCardError('Please enter the name printed on your card');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('Please enter a valid 3 or 4-digit CVV');
      return;
    }

    setSettling(true);
    setCardError('');
    setTimeout(() => {
      setIsPaid(true);
      setSettling(false);
    }, 900);
  };

  const handleSettlePayment = () => {
    setSettling(true);
    setTimeout(() => {
      setIsPaid(true);
      setSettling(false);
    }, 600);
  };

  const handleRequestWaiter = () => {
    setSettling(true);
    setTimeout(() => {
      setWaiterRequested(true);
      setIsPaid(true);
      setSettling(false);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
    // After printing the bill, log out the customer and open the main menu login dialog
    if (onPrintAndLogout) {
      setTimeout(() => {
        onPrintAndLogout();
      }, 400);
    }
  };

  return (
    <div className="bill-modal-overlay" onClick={onClose}>
      <div className="bill-modal-card" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="bill-close-btn" onClick={onClose} aria-label="Close Bill">
          <X size={18} />
        </button>

        {/* Printable Bill Area */}
        <div className="bill-printable-content" id="printable-invoice">
          {/* Bill Restaurant Header */}
          <div className="bill-header">
            <div className="bill-brand-badge">
              <Sparkles size={15} />
              <span>THE PODDAR'S</span>
            </div>
            <h2>COURTYARD</h2>
            <p className="bill-tagline">Fine Dining • Signature Bar • Live Gourmet Kitchen</p>
            <p className="bill-tax-info">GSTIN: 07AABCT2024P1Z4 • FSSAI Lic: 10022011000452</p>
            <div className="bill-invoice-type">FINAL DINING TAX INVOICE</div>
          </div>

          {/* Bill Metadata Grid */}
          <div className="bill-meta-grid">
            <div>
              <span>INVOICE NUMBER:</span>
              <b>#INV-{order.id}</b>
            </div>
            <div>
              <span>DATE & TIME:</span>
              <b>{formattedDate}, {formattedTime}</b>
            </div>
            <div>
              <span>GUEST NAME:</span>
              <b>{order.guestName || 'Valued Guest'}</b>
            </div>
            <div>
              <span>SERVICE / TABLE:</span>
              <b className="bill-table-highlight">{order.mode === 'Dine in' ? (order.table || 'Table 1') : 'Self Pickup'}</b>
            </div>
          </div>

          <div className="bill-divider"></div>

          {/* Itemized Table */}
          <div className="bill-items-table">
            <div className="bill-table-head">
              <span className="col-item">ITEM DESCRIPTION</span>
              <span className="col-qty">QTY</span>
              <span className="col-rate">RATE</span>
              <span className="col-amount">AMOUNT</span>
            </div>

            <div className="bill-table-body">
              {order.items?.map((item, index) => (
                <div className="bill-item-row" key={index}>
                  <div className="col-item">
                    <span className="item-title">{item.name}</span>
                  </div>
                  <span className="col-qty">{item.qty}</span>
                  <span className="col-rate">{formatPrice(item.price)}</span>
                  <span className="col-amount"><b>{formatPrice(item.price * item.qty)}</b></span>
                </div>
              ))}
            </div>
          </div>

          {order.instructions && (
            <div className="bill-special-note">
              <span>Chef Cooking Note:</span> <i>"{order.instructions}"</i>
            </div>
          )}

          <div className="bill-divider"></div>

          {/* Calculation Breakdown */}
          <div className="bill-totals-breakdown">
            <div className="bill-row">
              <span>Food & Beverage Subtotal:</span>
              <b>{formatPrice(subtotal)}</b>
            </div>
            <div className="bill-row">
              <span>CGST (2.5%):</span>
              <b>{formatPrice(cgst)}</b>
            </div>
            <div className="bill-row">
              <span>SGST (2.5%):</span>
              <b>{formatPrice(sgst)}</b>
            </div>
            <div className="bill-row grand-total-row">
              <div>
                <span>FINAL PAYABLE BILL:</span>
                <small>Net inclusive of all taxes</small>
              </div>
              <b className="bill-final-amount">{formatPrice(total)}</b>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div className={`bill-status-banner ${isPaid ? 'paid' : 'pending'}`}>
            {isPaid ? (
              <>
                <CheckCircle2 size={20} />
                <div>
                  <b>BILL SETTLED & PAID IN FULL</b>
                  <span>
                    {waiterRequested
                      ? `Waiter has been requested for ${order.table || 'Table 1'}. Bill marked as in-process settlement.`
                      : "Thank you for dining at THE PODDAR'S COURTYARD! We hope you enjoyed your experience."}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Clock3 size={20} />
                <div>
                  <b>FINAL BILL TO BE PAID: {formatPrice(total)}</b>
                  <span>Select UPI QR, Online Card, or request a waiter for cash payment at table.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Payment Methods (If Not Paid) */}
        {!isPaid && (
          <div className="bill-payment-section">
            <span className="payment-section-title">SELECT PAYMENT METHOD</span>
            <div className="payment-options-tabs payment-three-tabs">
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <QrCode size={15} /> UPI / GPay
              </button>
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={15} /> Card Details
              </button>
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'waiter' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('waiter')}
              >
                <Banknote size={15} /> Pay Waiter (Cash)
              </button>
            </div>

            {/* TAB 1: UPI / GPAY */}
            {paymentMethod === 'upi' && (
              <div className="upi-payment-box">
                <div className="mock-qr-wrap">
                  <div className="upi-qr-card-container">
                    <img
                      src={resolveAsset('/payment-qr.jpg')}
                      alt="Aarav Poddar UPI QR Code"
                      className="upi-qr-image"
                    />
                  </div>
                  <small className="upi-scan-hint">Scan with GPay, PhonePe, Paytm, BHIM</small>
                </div>

                <div className="upi-details">
                  <div className="upi-info-card">
                    <div className="upi-info-row">
                      <span className="upi-label">PAYEE:</span>
                      <b className="upi-val">{payeeName}</b>
                    </div>
                    <div className="upi-info-row">
                      <span className="upi-label">UPI ID:</span>
                      <div className="upi-id-badge-wrap">
                        <code className="upi-val-mono">{upiId}</code>
                        <button
                          type="button"
                          className="upi-copy-action-btn"
                          onClick={handleCopyUpi}
                          title="Copy UPI ID"
                        >
                          <Copy size={12} /> {copiedUpi ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="upi-info-row">
                      <span className="upi-label">AMOUNT:</span>
                      <b className="upi-val-price">{formatPrice(total)}</b>
                    </div>
                  </div>

                  <a
                    href={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${total}&cu=INR&tn=The%20Poddars%20Courtyard%20Bill`}
                    className="pay-direct-app-link"
                  >
                    <Smartphone size={15} /> Open UPI App (GPay / PhonePe)
                  </a>

                  <button
                    type="button"
                    className="pay-settle-btn"
                    onClick={handleSettlePayment}
                    disabled={settling}
                  >
                    {settling ? 'Verifying payment...' : '✓ Confirm UPI Payment Completed'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD DETAILS */}
            {paymentMethod === 'card' && (
              <form className="card-payment-box" onSubmit={handleProcessCardPayment}>
                <div className="card-header-row">
                  <div className="card-security-badge">
                    <ShieldCheck size={14} /> 256-Bit SSL Encrypted
                  </div>
                  <div className="card-networks-list">
                    <span className="card-chip-tag visa">VISA</span>
                    <span className="card-chip-tag mc">Mastercard</span>
                    <span className="card-chip-tag rupay">RuPay</span>
                    <span className="card-chip-tag amex">AMEX</span>
                  </div>
                </div>

                {cardError && (
                  <div className="card-error-banner">
                    <AlertTriangle size={14} /> {cardError}
                  </div>
                )}

                <div className="card-inputs-grid">
                  <div className="card-input-group full-width">
                    <label>CARD NUMBER</label>
                    <div className="card-input-icon-wrap">
                      <CreditCard size={16} className="card-field-icon" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 8900 1234 5678"
                        maxLength={19}
                        required
                      />
                    </div>
                  </div>

                  <div className="card-input-group full-width">
                    <label>CARDHOLDER NAME</label>
                    <div className="card-input-icon-wrap">
                      <User size={16} className="card-field-icon" />
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        placeholder="NAME ON CARD"
                        style={{ textTransform: 'uppercase' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="card-input-group">
                    <label>EXPIRY DATE</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="card-input-group">
                    <label>CVV / CVC</label>
                    <div className="card-input-icon-wrap">
                      <Lock size={14} className="card-field-icon" />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        placeholder="•••"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="card-action-row">
                  <button
                    type="submit"
                    className="pay-card-submit-btn"
                    disabled={settling}
                  >
                    <Lock size={14} />
                    {settling
                      ? 'Authorizing card...'
                      : `Pay ${formatPrice(total)} with Card`}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PAY CASH TO WAITER */}
            {paymentMethod === 'waiter' && (
              <div className="waiter-payment-box">
                <div className="waiter-icon-badge">
                  <Banknote size={28} />
                </div>
                <div className="waiter-details-content">
                  <h4>Cash Payment at Table</h4>
                  <p>
                    A designated restaurant captain will arrive at <b>{order.mode === 'Dine in' ? (order.table || 'Table 1') : 'Pickup Counter'}</b> to collect cash, provide exact change, and hand over your stamped receipt.
                  </p>
                  <div className="waiter-summary-row">
                    <span>Payable in Cash:</span>
                    <b>{formatPrice(total)}</b>
                  </div>
                  <button
                    type="button"
                    className="pay-waiter-request-btn"
                    onClick={handleRequestWaiter}
                    disabled={settling}
                  >
                    <Banknote size={16} />
                    {settling ? 'Calling waiter...' : '🤵 Request Waiter to Table'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="bill-bottom-actions">
          <button type="button" className="bill-btn-print" onClick={handlePrint}>
            <Printer size={15} /> Print Bill & Finish Dining
          </button>
          <button
            type="button"
            className="bill-btn-add-more"
            onClick={onAddMore}
          >
            <Plus size={15} /> + Add More Items
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LIVE CUSTOMER ORDER TRACKER COMPONENT
// -------------------------------------------------------------
function CustomerTracker({ orderId, onClose, onNewOrder, onPrintAndLogout }) {
  const [order, setOrder] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          return;
        }
      } catch (err) {}
      // Local storage fallback
      const local = getLocalOrders();
      const match = local.find(o => o.id === orderId);
      if (match) setOrder(match);
    };
    fetchOrder();

    const handleLocalSync = (e) => {
      const list = e.detail || getLocalOrders();
      const match = list.find(o => o.id === orderId);
      if (match) setOrder(match);
    };
    window.addEventListener('poddars_orders_sync', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);

    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.addEventListener('order:updated', (e) => {
        const updated = JSON.parse(e.data);
        if (updated.id === orderId) {
          setOrder(updated);
          const list = getLocalOrders().map(o => o.id === updated.id ? updated : o);
          saveLocalOrders(list);
        }
      });
    } catch {}

    const interval = setInterval(fetchOrder, 3000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('poddars_orders_sync', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
      if (eventSource) eventSource.close();
    };
  }, [orderId]);

  if (!order) return null;

  const isApproved = order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Completed';
  const isReady = order.status === 'Ready' || order.status === 'Completed';
  const isCompleted = order.status === 'Completed';
  const isCancelled = order.status === 'Cancelled';

  return (
    <>
      <div className="tracker-card">
        <div className="tracker-header">
          <h4>
            <Flame size={18} color="var(--brand-primary)" />
            Live Kitchen Tracking: #{order.id}
          </h4>
          <button type="button" onClick={onClose} aria-label="Close tracker">
            <X size={18} />
          </button>
        </div>

        {isCancelled ? (
          <div style={{ padding: '10px 0', textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
              Order Cancelled by Kitchen
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
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
            <div style={{ marginTop: '4px', borderTop: '1px solid var(--line)', paddingTop: '4px' }}>
              <span>Note:</span> <i>"{order.instructions}"</i>
            </div>
          )}
        </div>

        {/* Action Buttons: View Final Bill, Add More Items, and Hide Tracker */}
        <div className="tracker-actions">
          <button
            type="button"
            className="tracker-btn-bill"
            onClick={() => setShowBillModal(true)}
          >
            <Receipt size={14} />
            <span>View Final Bill</span>
          </button>
          <button
            type="button"
            className="tracker-btn-primary"
            onClick={onNewOrder}
          >
            <Plus size={14} />
            <span>+ Add More Items</span>
          </button>
          <button
            type="button"
            className="tracker-btn-secondary"
            onClick={onClose}
          >
            Hide Tracker
          </button>
        </div>
      </div>

      {/* Final Bill Modal Popup */}
      {showBillModal && (
        <FinalBillModal
          order={order}
          onClose={() => setShowBillModal(false)}
          onAddMore={() => {
            setShowBillModal(false);
            onNewOrder();
          }}
          onPrintAndLogout={() => {
            setShowBillModal(false);
            if (onPrintAndLogout) onPrintAndLogout();
          }}
        />
      )}
    </>
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
  const [callWaiterModalOpen, setCallWaiterModalOpen] = useState(false);
  const [waiterCalls, setWaiterCalls] = useState(() => getLocalWaiterCalls());

  // Real-time synchronization for Waiter Calls in Customer View
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch('/api/waiter-calls');
        if (res.ok) {
          const data = await res.json();
          setWaiterCalls(data);
          saveLocalWaiterCalls(data);
        }
      } catch {}
    };
    fetchCalls();

    const handleSync = (e) => {
      setWaiterCalls(e.detail || getLocalWaiterCalls());
    };
    window.addEventListener('poddars_waiter_sync', handleSync);
    window.addEventListener('storage', handleSync);

    let es;
    try {
      es = new EventSource('/api/events');
      es.addEventListener('waiter:called', (e) => {
        const newCall = JSON.parse(e.data);
        setWaiterCalls(prev => [newCall, ...prev.filter(c => c.id !== newCall.id)]);
      });
      es.addEventListener('waiter:updated', (e) => {
        const updated = JSON.parse(e.data);
        setWaiterCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      });
      es.addEventListener('waiter:deleted', (e) => {
        const { id } = JSON.parse(e.data);
        setWaiterCalls(prev => prev.filter(c => c.id !== id));
      });
    } catch {}

    const interval = setInterval(fetchCalls, 4000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('poddars_waiter_sync', handleSync);
      window.removeEventListener('storage', handleSync);
      if (es) es.close();
    };
  }, []);

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
          (diet === 'Veg' && !nonVegIds.has(item.id)) ||
          (diet === 'Non-veg' && nonVegIds.has(item.id)) ||
          (diet === 'Bestseller' && bestsellerIds.has(item.id)) ||
          (diet === "Chef's Choice" && chefPickIds.has(item.id));
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.desc.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesDiet && matchesSearch;
      })
      .sort((first, second) => {
        const categoryOrder = eatingOrder.indexOf(first.category) - eatingOrder.indexOf(second.category);
        return categoryOrder || Number(nonVegIds.has(first.id)) - Number(nonVegIds.has(second.id));
      });
  }, [category, diet, search]);

  const activeTableCall = waiterCalls.find(c => c.status === 'Pending' && (guest?.table ? c.table === guest.table : c.table === 'Table 1'));

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

    const newOrderPayload = {
      id: `TP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
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
      total,
      estimatedPrepTime: null,
      approvedAt: null,
      readyAt: null,
      completedAt: null,
      cancelledAt: null,
      chefNote: '',
      rejectionReason: null
    };

    let finalOrder = newOrderPayload;

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
      if (response.ok) {
        finalOrder = await response.json();
      }
    } catch (error) {
      console.warn('Server offline, persisting order locally:', error);
    } finally {
      setSubmitting(false);
    }

    // Save to local storage cache so Kitchen Portal receives it immediately across tabs
    const existingOrders = getLocalOrders();
    const updatedOrders = [finalOrder, ...existingOrders.filter(o => o.id !== finalOrder.id)];
    saveLocalOrders(updatedOrders);

    // Open live tracker
    setActiveTrackingOrderId(finalOrder.id);
    setShowTracker(true);
    setCartOpen(false);
    setCart([]);
    setInstruction('');
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
                <i>courtyard</i>
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
              {/* Kitchen & Staff Portal Switch Button */}
              <button
                type="button"
                className="header-kitchen-btn"
                onClick={() => {
                  window.location.hash = 'kitchen';
                  setCurrentView('chef');
                }}
                title="Open Staff & Kitchen Portal"
              >
                <ChefHat size={16} />
                <span className="header-btn-label">Kitchen</span>
              </button>

              {/* Call Waiter Header Button */}
              <button
                type="button"
                className={'call-waiter-header-btn ' + (activeTableCall ? 'alert-active' : '')}
                onClick={() => setCallWaiterModalOpen(true)}
                title="Call waiter to your table"
              >
                <BellRing size={15} className={activeTableCall ? 'bell-ringing' : ''} />
                <span className="header-btn-label">{activeTableCall ? `Alerted (${activeTableCall.table.replace('Table ', 'T')})` : 'Call Waiter'}</span>
              </button>

              {activeTrackingOrderId && (
                <button
                  type="button"
                  className="kds-btn-tool active header-track-btn"
                  onClick={() => setShowTracker(true)}
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                  title="Track Active Order"
                >
                  <Flame size={14} color="var(--lime)" />
                  <span className="header-btn-label">Track</span>
                </button>
              )}

              <button
                type="button"
                className={'icon-btn notification-button ' + (notice ? 'has-notice' : '')}
                onClick={() => setNotice(!notice)}
                aria-label="Toggle order updates"
              >
                <Bell size={18} />
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

          <section className="welcome-hero">
            <div className="welcome-content">
              <div className="hero-top-badges">
                <span className="hero-live-badge">
                  <span className="live-pulse"></span>
                  <Zap size={13} />
                  <span>KITCHEN & BAR LIVE</span>
                </span>
                <span className="hero-feature-chip">
                  <Clock size={12} /> ~15-20m Express Prep
                </span>
                <span className="hero-feature-chip">
                  <Star size={12} color="var(--neon-yellow)" /> 4.9★ Rated Dining
                </span>
              </div>

              <h1>
                Welcome to <span className="neon-text-glow">THE PODDAR'S COURTYARD</span>
              </h1>
              <p className="subcopy">
                Gourmet dishes, signature cocktails & sizzling street delicacies crafted fresh for your table.
              </p>

              {/* Guest Session Card */}
              {!guest?.name ? (
                <div className="guest-hero-banner unauthenticated">
                  <div className="guest-banner-info">
                    <b>
                      <User size={16} /> Fast Table Check-in
                    </b>
                    <p>Enter your party name & table number for seamless kitchen service.</p>
                  </div>
                  <button
                    type="button"
                    className="guest-hero-btn"
                    onClick={() => setGuestModalOpen(true)}
                  >
                    <span>Check In Now</span>
                    <Sparkles size={14} />
                  </button>
                </div>
              ) : (
                <div className="guest-hero-banner authenticated">
                  <div className="guest-banner-info">
                    <span className="guest-vip-label">ACTIVE DINING PASS</span>
                    <b>
                      👤 {guest.name} • <span className="guest-table-highlight">{mode === 'Dine in' ? (guest.table || 'Table 1') : 'Self Pickup'}</span>
                    </b>
                  </div>
                  <button
                    type="button"
                    className="guest-switch-link"
                    onClick={() => setGuestModalOpen(true)}
                  >
                    Switch Table / Name
                  </button>
                </div>
              )}
            </div>

            {/* Dining Mode Selector */}
            <div className="hero-mode-container">
              <div className="mode-switch" role="group" aria-label="Order type">
                <button
                  type="button"
                  className={mode === 'Dine in' ? 'active' : ''}
                  onClick={() => {
                    setMode('Dine in');
                    if (!guest?.table) setGuestModalOpen(true);
                  }}
                >
                  <UtensilsCrossed size={18} />
                  <div>
                    <span>Dine-In Table</span>
                    <small>{guest?.table || 'Select Table #'}</small>
                  </div>
                </button>
                <button
                  type="button"
                  className={mode === 'Self pickup' ? 'active' : ''}
                  onClick={() => setMode('Self pickup')}
                >
                  <ShoppingBag size={18} />
                  <div>
                    <span>Takeaway / Pickup</span>
                    <small>Packed & Ready in 20m</small>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {orderError && (
            <div className="order-error">
              {orderError} Start the hotel server with <code>npm.cmd run server</code>.
            </div>
          )}

          {/* Menu Main Section */}
          <section className="menu-section">
            {/* Clean Integrated Controls Bar */}
            <div className="menu-controls-bar">
              <div className="search-wrap">
                <Search size={16} />
                <input
                  placeholder="Search dishes, drinks, desserts..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
                {search && (
                  <button type="button" className="search-clear" onClick={() => setSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Dietary & Highlight Filter Segmented Switch */}
              <div className="diet-filter-pill" role="group" aria-label="Diet and specialty filter">
                {[
                  { id: 'All', label: 'All', icon: null, classKey: 'all' },
                  { id: 'Veg', label: 'Veg', icon: <span className="diet-dot veg-dot"></span>, classKey: 'veg' },
                  { id: 'Non-veg', label: 'Non-Veg', icon: <span className="diet-dot nonveg-dot"></span>, classKey: 'nonveg' },
                  { id: 'Bestseller', label: 'Bestseller', icon: <Flame size={13} className="filter-icon-bestseller" />, classKey: 'bestseller' },
                  { id: "Chef's Choice", label: "Chef's Choice", icon: <ChefHat size={13} className="filter-icon-chef" />, classKey: 'chefschoice' }
                ].map(option => (
                  <button
                    type="button"
                    key={option.id}
                    className={`diet-filter-btn ${diet === option.id ? `selected ${option.classKey}` : ''}`}
                    onClick={() => setDiet(option.id)}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Navigation Pills */}
            <nav className="categories">
              {categories.map(itemCategory => {
                const meta = categoryMetadata[itemCategory] || { label: itemCategory, icon: '🍽️' };
                const countInCategory = menu.filter(i => {
                  const matchesCat = itemCategory === 'All' || i.category === itemCategory;
                  const matchesD =
                    diet === 'All' ||
                    (diet === 'Veg' && !nonVegIds.has(i.id)) ||
                    (diet === 'Non-veg' && nonVegIds.has(i.id)) ||
                    (diet === 'Bestseller' && bestsellerIds.has(i.id)) ||
                    (diet === "Chef's Choice" && chefPickIds.has(i.id));
                  const matchesS = search
                    ? (i.name.toLowerCase().includes(search.toLowerCase()) ||
                       i.desc.toLowerCase().includes(search.toLowerCase()) ||
                       i.category.toLowerCase().includes(search.toLowerCase()))
                    : true;
                  return matchesCat && matchesD && matchesS;
                }).length;
                return (
                  <button
                    type="button"
                    key={itemCategory}
                    onClick={() => setCategory(itemCategory)}
                    className={category === itemCategory ? 'selected' : ''}
                  >
                    <span className="cat-icon">{meta.icon}</span>
                    <span className="cat-label">{meta.label}</span>
                    <span className="cat-badge">{countInCategory}</span>
                  </button>
                );
              })}
            </nav>

            {/* Dishes Grid */}
            {visibleMenu.length === 0 ? (
              <div className="menu-empty-state">
                <ChefHat size={42} />
                <h3>No dishes found</h3>
                <p>No dishes match your selected filter ({diet !== 'All' ? diet : ''} {category !== 'All' ? `in ${category}` : ''}).</p>
                <button
                  type="button"
                  className="menu-reset-btn"
                  onClick={() => {
                    setCategory('All');
                    setDiet('All');
                    setSearch('');
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Show Full Menu</span>
                </button>
              </div>
            ) : (
              <div className="grid">
              {visibleMenu.map(item => {
                const cartItem = cart.find(entry => entry.id === item.id);
                const isBestseller = bestsellerIds.has(item.id);
                const isChefPick = chefPickIds.has(item.id);
                const rating = ratingMap[item.id] || '4.8';

                return (
                  <article className="dish" key={item.id}>
                    <div className="dish-image">
                      {item.image ? (
                        <img
                          src={resolveAsset(item.image)}
                          alt={item.name}
                          className="dish-photo"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}

                      {/* Top Badges */}
                      <div className="dish-top-badges">
                        <span className="dish-cuisine-badge">
                          {getCategoryIcon(item.category, item.id)}
                          <span>{item.category}</span>
                        </span>
                        
                        <div className="dish-diet-tag">
                          <span className={nonVegIds.has(item.id) ? 'tag-nonveg' : 'tag-veg'} title={nonVegIds.has(item.id) ? 'Non-Veg' : 'Pure Veg'}>
                            <i></i>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Image Badges */}
                      <div className="dish-img-footer-badges">
                        {isBestseller ? (
                          <span className="dish-highlight-badge bestseller">
                            <Flame size={11} /> BESTSELLER
                          </span>
                        ) : isChefPick ? (
                          <span className="dish-highlight-badge chefpick">
                            <Sparkles size={11} /> CHEF'S CHOICE
                          </span>
                        ) : null}

                        <span className="dish-rating-badge">
                          <Star size={11} color="var(--neon-yellow)" />
                          <span>{rating}</span>
                        </span>
                      </div>
                    </div>

                    <div className="dish-info">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
                      </div>

                      <div className="dish-bottom">
                        <div className="dish-price-box">
                          <span className="dish-price-label">PRICE</span>
                          <b>{formatPrice(item.price)}</b>
                        </div>

                        {cartItem ? (
                          <div className="menu-quantity">
                            <button
                              type="button"
                              aria-label={'Remove one ' + item.name}
                              onClick={() => updateCart(item, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <b>{cartItem.qty}</b>
                            <button
                              type="button"
                              aria-label={'Add one ' + item.name}
                              onClick={() => updateCart(item, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="add-btn"
                            aria-label={'Add ' + item.name}
                            onClick={() => updateCart(item, 1)}
                          >
                            <Plus size={15} />
                            <span>ADD</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            )}
          </section>

          {/* Floating Order Bar (Always Visible when items in cart) */}
          {count > 0 && (
            <aside className="floating-cart-bar">
              <div className="floating-cart-inner" onClick={() => setCartOpen(true)}>
                <div className="floating-cart-summary">
                  <div className="floating-cart-count-badge">
                    <ShoppingBag size={18} />
                    <span>{count}</span>
                  </div>
                  <div className="floating-cart-details">
                    <span className="floating-cart-items-title">
                      {count} {count === 1 ? 'item' : 'items'} in your order
                    </span>
                    <b className="floating-cart-total-price">{formatPrice(total)}</b>
                  </div>
                </div>
                
                <button type="button" className="floating-cart-cta">
                  <span>View Order</span>
                  <b>→</b>
                </button>
              </div>
            </aside>
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
                  <>
                    <div className="cart-items-list">
                      {cart.map(item => (
                        <div className="cart-item" key={item.id}>
                          <div className={'tiny ' + item.color}>
                            {item.image && (
                              <img
                                src={resolveAsset(item.image)}
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
                      ))}
                    </div>

                    {/* Cooking Instructions inside Drawer (Scrolls with items, never blocks totals/checkout) */}
                    <div className="cart-instructions-box">
                      <div className="cart-instructions-title">
                        <ChefHat size={14} />
                        <span>Cooking Instructions for Chef</span>
                      </div>
                      <textarea
                        value={instruction}
                        onChange={event => setInstruction(event.target.value)}
                        placeholder="E.g., less spicy, no onion, extra crispy, sauce on side..."
                        className="cart-instructions-input"
                        rows={2}
                      />
                    </div>
                  </>
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

      {/* Floating Call Waiter Button for Quick Access */}
      {currentView === 'customer' && (
        <div className="floating-waiter-call-wrap">
          <button
            type="button"
            className={`floating-waiter-btn ${activeTableCall ? 'alert-active' : ''}`}
            onClick={() => setCallWaiterModalOpen(true)}
            title="Call waiter to your table"
          >
            <BellRing size={18} className={activeTableCall ? 'bell-ringing' : ''} />
            <span>{activeTableCall ? `Staff Alerted (${activeTableCall.table})` : 'Call Waiter'}</span>
          </button>
        </div>
      )}

      {/* Guest Login / Table Check-in Modal */}
      <GuestLoginModal
        guest={guest}
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        onLogoutGuest={() => {
          setGuest(null);
          try {
            localStorage.removeItem('poddars_guest_session');
          } catch {}
          setGuestModalOpen(true);
        }}
        onSaveGuest={savedGuest => {
          setGuest(savedGuest);
          setMode(savedGuest.mode || 'Dine in');
          setGuestModalOpen(false);
          try {
            localStorage.setItem('poddars_guest_session', JSON.stringify(savedGuest));
          } catch {}
        }}
      />

      {/* Call Waiter Modal */}
      <CallWaiterModal
        isOpen={callWaiterModalOpen}
        onClose={() => setCallWaiterModalOpen(false)}
        guest={guest}
        onSaveGuest={savedGuest => {
          setGuest(savedGuest);
          setMode(savedGuest.mode || 'Dine in');
          try {
            localStorage.setItem('poddars_guest_session', JSON.stringify(savedGuest));
          } catch {}
        }}
        activeCalls={waiterCalls}
        onCallSuccess={newCall => {
          setWaiterCalls(prev => [newCall, ...prev.filter(c => c.id !== newCall.id)]);
          saveLocalWaiterCalls([newCall, ...waiterCalls.filter(c => c.id !== newCall.id)]);
        }}
        onCancelCall={async (callId) => {
          setWaiterCalls(prev => prev.map(c => c.id === callId ? { ...c, status: 'Dismissed' } : c));
          saveLocalWaiterCalls(waiterCalls.map(c => c.id === callId ? { ...c, status: 'Dismissed' } : c));
          try {
            await fetch(`/api/waiter-calls/${callId}/dismiss`, { method: 'PATCH' });
          } catch {}
        }}
        onOpenKitchen={() => {
          window.location.hash = 'kitchen';
          setCurrentView('chef');
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
          onPrintAndLogout={() => {
            setGuest(null);
            setCart([]);
            setActiveTrackingOrderId(null);
            setShowTracker(false);
            setInstruction('');
            try {
              localStorage.removeItem('poddars_guest_session');
            } catch {}
            setGuestModalOpen(true);
          }}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

