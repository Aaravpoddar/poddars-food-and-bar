import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, Bell, Clock3, MapPin, Minus, Plus, Search, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import './style.css';

const menu = [
  { id: 1, name: 'Butter Chicken', desc: 'Tandoori chicken in creamy tomato gravy', price: 289, category: 'Indian', color: 'coral', mark: 'BC' },
  { id: 2, name: 'Paneer Tikka Masala', desc: 'Charred paneer in rich makhani gravy', price: 249, category: 'Indian', color: 'cream', mark: 'PT' },
  { id: 3, name: 'Rajma Chawal', desc: 'Slow-cooked rajma with steamed basmati rice', price: 159, category: 'Indian', color: 'green', mark: 'RC' },
  { id: 4, name: 'Chicken Biryani', desc: 'Aromatic basmati, chicken, fried onions and raita', price: 249, category: 'Indian', color: 'blue', mark: 'CB' },
  { id: 5, name: 'Samosa Chaat', desc: 'Crisp samosa, chickpeas, chutneys and sev', price: 99, category: 'Starters', color: 'yellow', mark: 'SC' },
  { id: 6, name: 'Masala Dosa', desc: 'Crisp dosa, potato masala, sambar and chutney', price: 129, category: 'Dosa', color: 'purple', mark: 'MD' },
  { id: 7, name: 'Veg Hakka Noodles', desc: 'Wok-tossed noodles with crunchy vegetables', price: 169, category: 'Chinese', color: 'pink', mark: 'VN' },
  { id: 8, name: 'Chilli Chicken', desc: 'Crispy chicken, peppers and chilli sauce', price: 219, category: 'Chinese', color: 'orange', mark: 'CC' },
  { id: 9, name: 'Veg Manchurian', desc: 'Vegetable dumplings in a tangy soy sauce', price: 179, category: 'Chinese', color: 'green', mark: 'VM' },
  { id: 10, name: 'Chicken Fried Rice', desc: 'Wok-fried rice, chicken, egg and vegetables', price: 199, category: 'Chinese', color: 'coral', mark: 'FR' },
  { id: 11, name: 'Margherita Pizza', desc: 'Tomato, mozzarella and fresh basil', price: 229, category: 'Italian', color: 'yellow', mark: 'MP' },
  { id: 12, name: 'White Sauce Pasta', desc: 'Penne, creamy herb sauce and sweet corn', price: 199, category: 'Italian', color: 'cream', mark: 'WP' },
  { id: 13, name: 'Chicken Alfredo Pasta', desc: 'Grilled chicken, penne and parmesan sauce', price: 269, category: 'Italian', color: 'blue', mark: 'CA' },
  { id: 14, name: 'Veg Club Sandwich', desc: 'Grilled vegetables, cheese and house spread', price: 159, category: 'Continental', color: 'purple', mark: 'VS' },
  { id: 15, name: 'Crispy Chicken Burger', desc: 'Fried chicken, lettuce, cheese and fries', price: 229, category: 'Continental', color: 'orange', mark: 'CB' },
  { id: 16, name: 'French Fries', desc: 'Crisp golden fries with seasoning', price: 89, category: 'Starters', color: 'yellow', mark: 'FF' },
  { id: 17, name: 'Gulab Jamun', desc: 'Warm milk dumplings in rose syrup', price: 79, category: 'Dessert', color: 'pink', mark: 'GJ' },
  { id: 18, name: 'Brownie with Ice Cream', desc: 'Warm chocolate brownie and vanilla scoop', price: 119, category: 'Dessert', color: 'coral', mark: 'BI' },
  { id: 19, name: 'Masala Chai', desc: 'Assam tea with ginger and cardamom', price: 35, category: 'Drinks', color: 'orange', mark: 'MC' },
  { id: 20, name: 'Fresh Lime Soda', desc: 'Sweet or salted chilled lime soda', price: 59, category: 'Drinks', color: 'green', mark: 'LS' },
  { id: 21, name: 'Mysore Masala Dosa', desc: 'Spicy red chutney, potato masala, sambar', price: 149, category: 'Dosa', color: 'coral', mark: 'MM' },
  { id: 22, name: 'Onion Rava Dosa', desc: 'Crispy semolina dosa with onion and pepper', price: 139, category: 'Dosa', color: 'yellow', mark: 'OR' },
  { id: 23, name: 'Cheese Dosa', desc: 'Golden dosa, cheese, potato masala and chutney', price: 159, category: 'Dosa', color: 'cream', mark: 'CD' },
  { id: 24, name: 'Plain Dosa', desc: 'Classic crisp dosa served with sambar and chutneys', price: 89, category: 'Dosa', color: 'green', mark: 'PD' },
  { id: 25, name: 'Butter Naan', desc: 'Soft tandoor-baked naan brushed with butter', price: 45, category: 'Breads', color: 'orange', mark: 'BN' },
  { id: 26, name: 'Garlic Naan', desc: 'Tandoor naan with garlic, coriander and butter', price: 55, category: 'Breads', color: 'purple', mark: 'GN' },
  { id: 27, name: 'Tandoori Roti', desc: 'Whole-wheat bread straight from the tandoor', price: 25, category: 'Breads', color: 'yellow', mark: 'TR' },
  { id: 28, name: 'Laccha Paratha', desc: 'Flaky layered whole-wheat paratha', price: 45, category: 'Breads', color: 'blue', mark: 'LP' },
  { id: 29, name: 'Rasmalai', desc: 'Saffron milk dumplings with pistachio', price: 99, category: 'Dessert', color: 'cream', mark: 'RM' },
  { id: 30, name: 'Kulfi Falooda', desc: 'Malai kulfi, vermicelli, basil seeds and rose syrup', price: 109, category: 'Dessert', color: 'pink', mark: 'KF' },
  { id: 31, name: 'Ice Cream Sundae', desc: 'Vanilla ice cream, chocolate sauce and nuts', price: 89, category: 'Dessert', color: 'blue', mark: 'IS' },
  { id: 32, name: 'Carrot Halwa', desc: 'Slow-cooked gajar halwa with almonds', price: 79, category: 'Dessert', color: 'orange', mark: 'GH' },
  { id: 33, name: 'Dal Makhani', desc: 'Creamy black lentils slow-cooked overnight', price: 189, category: 'Indian', color: 'purple', mark: 'DM' },
  { id: 34, name: 'Kadai Paneer', desc: 'Paneer, capsicum and onion in a spiced gravy', price: 239, category: 'Indian', color: 'coral', mark: 'KP' },
  { id: 35, name: 'Veg Thali', desc: 'Dal, seasonal vegetables, rice, roti and salad', price: 199, category: 'Indian', color: 'yellow', mark: 'VT' },
  { id: 36, name: 'Idli Sambar', desc: 'Four soft idlis with sambar and chutneys', price: 99, category: 'Dosa', color: 'cream', mark: 'IS' },
  { id: 37, name: 'Spring Rolls', desc: 'Crisp vegetable rolls with sweet chilli dip', price: 129, category: 'Starters', color: 'green', mark: 'SR' },
  { id: 38, name: 'Chicken Tikka', desc: 'Char-grilled chicken with mint chutney', price: 249, category: 'Starters', color: 'orange', mark: 'CT' },
  { id: 39, name: 'Mexican Veg Pizza', desc: 'Corn, peppers, jalapenos and mozzarella', price: 259, category: 'Italian', color: 'pink', mark: 'MX' },
  { id: 40, name: 'Grilled Chicken Sandwich', desc: 'Herbed chicken, lettuce, cheese and fries', price: 219, category: 'Continental', color: 'blue', mark: 'GS' },
  { id: 41, name: 'Cold Coffee', desc: 'Creamy chilled coffee with vanilla ice cream', price: 89, category: 'Drinks', color: 'cream', mark: 'CF' },
  { id: 42, name: 'Mango Lassi', desc: 'Thick yogurt drink with ripe mango', price: 79, category: 'Drinks', color: 'yellow', mark: 'ML' },
  { id: 43, name: 'Chole Bhature', desc: 'Spiced chickpeas with fluffy fried bread', price: 159, category: 'Indian', color: 'orange', mark: 'CB' },
  { id: 44, name: 'Palak Paneer', desc: 'Paneer in a smooth spinach and garlic gravy', price: 229, category: 'Indian', color: 'green', mark: 'PP' },
  { id: 45, name: 'Chicken Curry', desc: 'Home-style chicken curry with warming spices', price: 269, category: 'Indian', color: 'coral', mark: 'CC' },
  { id: 46, name: 'Podi Dosa', desc: 'Crisp dosa dusted with spiced lentil powder', price: 139, category: 'Dosa', color: 'orange', mark: 'PD' },
  { id: 47, name: 'Stuffed Kulcha', desc: 'Tandoor bread filled with potato and spices', price: 75, category: 'Breads', color: 'yellow', mark: 'SK' },
  { id: 48, name: 'Missi Roti', desc: 'Spiced gram flour and wheat flatbread', price: 35, category: 'Breads', color: 'cream', mark: 'MR' },
  { id: 49, name: 'Cheese Garlic Bread', desc: 'Toasted bread with garlic butter and cheese', price: 89, category: 'Breads', color: 'pink', mark: 'GB' },
  { id: 50, name: 'Veg Schezwan Rice', desc: 'Wok-fried rice in a bold schezwan sauce', price: 179, category: 'Chinese', color: 'red', mark: 'SR' },
  { id: 51, name: 'Chicken Momos', desc: 'Steamed chicken dumplings with chilli chutney', price: 149, category: 'Chinese', color: 'blue', mark: 'CM' },
  { id: 52, name: 'Honey Chilli Potato', desc: 'Crisp potato tossed in sweet chilli sauce', price: 139, category: 'Chinese', color: 'yellow', mark: 'HP' },
  { id: 53, name: 'Sweet Corn Soup', desc: 'Comforting soup with corn and vegetables', price: 99, category: 'Chinese', color: 'cream', mark: 'CS' },
  { id: 54, name: 'Veg Arrabbiata Pasta', desc: 'Penne in a spicy tomato and herb sauce', price: 189, category: 'Italian', color: 'coral', mark: 'AP' },
  { id: 55, name: 'Farmhouse Pizza', desc: 'Mushroom, corn, peppers and mozzarella', price: 279, category: 'Italian', color: 'green', mark: 'FP' },
  { id: 56, name: 'Chicken Lasagna', desc: 'Layers of chicken, pasta and béchamel sauce', price: 299, category: 'Italian', color: 'orange', mark: 'CL' },
  { id: 57, name: 'Veg Burger', desc: 'Crispy veg patty, cheese and fries', price: 169, category: 'Continental', color: 'green', mark: 'VB' },
  { id: 58, name: 'Fish and Chips', desc: 'Crispy fish fillet with seasoned fries', price: 279, category: 'Continental', color: 'blue', mark: 'FC' },
  { id: 59, name: 'Grilled Veggies', desc: 'Seasonal vegetables with herb butter', price: 149, category: 'Continental', color: 'purple', mark: 'GV' },
  { id: 60, name: 'Tomato Basil Soup', desc: 'Creamy tomato soup with croutons', price: 99, category: 'Continental', color: 'coral', mark: 'TS' },
  { id: 61, name: 'Paneer Tikka', desc: 'Char-grilled paneer with mint chutney', price: 199, category: 'Starters', color: 'yellow', mark: 'PK' },
  { id: 62, name: 'Nachos Supreme', desc: 'Crisp nachos, salsa, beans and cheese', price: 169, category: 'Starters', color: 'orange', mark: 'NS' },
  { id: 63, name: 'Crispy Corn', desc: 'Golden fried corn with spices and lime', price: 129, category: 'Starters', color: 'green', mark: 'CC' },
  { id: 64, name: 'Kesar Pista Kulfi', desc: 'Traditional saffron and pistachio kulfi', price: 89, category: 'Dessert', color: 'cream', mark: 'KP' },
  { id: 65, name: 'Chocolate Shake', desc: 'Thick chocolate shake with a scoop of ice cream', price: 99, category: 'Drinks', color: 'coral', mark: 'CS' },
  { id: 66, name: 'Virgin Mojito', desc: 'Mint, lime and sparkling soda', price: 89, category: 'Drinks', color: 'green', mark: 'VM' },
  { id: 67, name: 'Iced Tea', desc: 'Chilled lemon tea with mint', price: 69, category: 'Drinks', color: 'orange', mark: 'IT' }
];
const eatingOrder = ['Starters', 'Dosa', 'Chinese', 'Italian', 'Continental', 'Indian', 'Breads', 'Dessert', 'Drinks'];
const categories = ['All', ...eatingOrder];
const nonVegIds = new Set([1, 4, 8, 10, 13, 15, 38, 40, 45, 51, 56, 58]);
const formatPrice = amount => `₹${Math.round(amount).toLocaleString('en-IN')}`;

function App() {
  const [mode, setMode] = useState('Dine in'); const [category, setCategory] = useState('All'); const [diet, setDiet] = useState('All'); const [search, setSearch] = useState(''); const [cart, setCart] = useState([]); const [cartOpen, setCartOpen] = useState(false); const [confirmed, setConfirmedState] = useState(false); const [notice, setNotice] = useState(false); const [addedItem, setAddedItem] = useState(''); const [instruction, setInstruction] = useState(''); const [submitting, setSubmitting] = useState(false); const [orderError, setOrderError] = useState('');
  const visibleMenu = useMemo(() => menu.filter(item => (category === 'All' || item.category === category) && (diet === 'All' || (diet === 'Veg' ? !nonVegIds.has(item.id) : nonVegIds.has(item.id))) && item.name.toLowerCase().includes(search.toLowerCase())).sort((first, second) => { const categoryOrder = eatingOrder.indexOf(first.category) - eatingOrder.indexOf(second.category); return categoryOrder || Number(nonVegIds.has(first.id)) - Number(nonVegIds.has(second.id)); }), [category, diet, search]);
  const count = cart.reduce((sum, item) => sum + item.qty, 0); const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0); const gst = subtotal * .05; const total = subtotal + gst;
  const updateCart = (item, delta) => { if (delta > 0) setAddedItem(item.name); setCart(current => { const found = current.find(cartItem => cartItem.id === item.id); if (!found && delta > 0) return [...current, { ...item, qty: 1 }]; return current.map(cartItem => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + delta } : cartItem).filter(cartItem => cartItem.qty > 0); }); };
  const submitOrder = async () => { if (!cart.length || submitting) return; setSubmitting(true); setOrderError(''); try { const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })), instructions: instruction, subtotal, gst, total }) }); if (!response.ok) throw new Error('The hotel server could not receive the order.'); setConfirmedState(true); } catch (error) { setOrderError(error.message); } finally { setSubmitting(false); } };
  const setConfirmed = value => value ? submitOrder() : setConfirmedState(false);
  return <main>
    <header><div className="brand"><span className="brand-mark"><UtensilsCrossed size={19}/></span><span>THE PODDARS<br/><i>food & bar</i></span></div><div className="service-status"><span></span>Kitchen is accepting orders</div><div className="header-actions"><button type="button" className={'icon-btn notification-button ' + (notice ? 'has-notice' : '')} onClick={() => setNotice(!notice)} aria-label="Toggle order updates"><Bell size={19}/></button><button type="button" className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={18}/> <b>{count}</b></button></div></header>
    <section className="welcome"><div><p className="eyebrow">WELCOME TO SAFFRON</p><h1>Good food,<br/>on your terms.</h1><p className="subcopy">Freshly made, ready when you are. Choose how you would like to enjoy your meal.</p></div><div className="mode-switch" role="group" aria-label="Order type"><button type="button" className={mode === 'Dine in' ? 'active' : ''} onClick={() => setMode('Dine in')}><UtensilsCrossed size={20}/><span>Dine in<small>Table 12</small></span></button><button type="button" className={mode === 'Self pickup' ? 'active' : ''} onClick={() => setMode('Self pickup')}><ShoppingBag size={20}/><span>Self pickup<small>Ready in 20 min</small></span></button></div></section>
    <nav className="diet-filter" aria-label="Diet preference"><span>SHOWING</span>{['All', 'Veg', 'Non-veg'].map(option => <button type="button" key={option} className={diet === option ? 'selected' : ''} onClick={() => setDiet(option)}>{option}</button>)}</nav>
    {orderError && <div className="order-error">{orderError} Start the hotel server with <code>npm.cmd run server</code>.</div>}
    <section className="menu-section"><div className="menu-top"><div><p className="eyebrow">EXPLORE THE MENU</p><h2>Indian favourites, made fresh.</h2></div><label className="search"><Search size={18}/><input placeholder="Search the menu" value={search} onChange={event => setSearch(event.target.value)}/></label></div><nav className="categories">{categories.map(itemCategory => <button type="button" key={itemCategory} onClick={() => setCategory(itemCategory)} className={category === itemCategory ? 'selected' : ''}>{itemCategory}</button>)}</nav><div className="grid">{visibleMenu.map(item => { const cartItem = cart.find(entry => entry.id === item.id); return <article className="dish" key={item.id}><div className={'dish-image ' + item.color}><span>{item.mark}</span><div className="plate"></div></div><div className="dish-info"><div><h3>{item.name}</h3><p>{item.desc}</p></div><div className="dish-bottom"><b>{formatPrice(item.price)}</b>{cartItem ? <div className="menu-quantity"><button type="button" aria-label={'Remove one ' + item.name} onClick={() => updateCart(item, -1)}><Minus size={15}/></button><b>{cartItem.qty}</b><button type="button" aria-label={'Add one ' + item.name} onClick={() => updateCart(item, 1)}><Plus size={15}/></button></div> : <button type="button" className="add" aria-label={'Add ' + item.name} onClick={() => updateCart(item, 1)}><Plus size={18}/></button>}</div></div></article>; })}</div></section>
    <div className="mobile-cart"><button type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={18}/><span>View order</span><b>{count ? formatPrice(total) : 'Empty'}</b></button></div>
    {cartOpen && <aside className="drawer"><div className="drawer-head"><button type="button" className="icon-btn" onClick={() => setCartOpen(false)}><ArrowLeft size={20}/></button><h2>Your order</h2><span className="item-count">{count} items</span></div><div className="order-type"><span>{mode === 'Dine in' ? <UtensilsCrossed size={18}/> : <MapPin size={18}/>}</span><div><b>{mode}</b><small>{mode === 'Dine in' ? 'Table 12, main dining room' : 'Pick up at the counter'}</small></div><button type="button" onClick={() => setMode(mode === 'Dine in' ? 'Self pickup' : 'Dine in')}>Change</button></div><div className="cart-items">{cart.length ? cart.map(item => <div className="cart-item" key={item.id}><div className={'tiny ' + item.color}>{item.mark}</div><div className="cart-name"><b>{item.name}</b><span>{formatPrice(item.price)}</span></div><div className="quantity"><button type="button" onClick={() => updateCart(item, -1)}><Minus size={14}/></button><b>{item.qty}</b><button type="button" onClick={() => updateCart(item, 1)}><Plus size={14}/></button></div></div>) : <div className="empty"><ShoppingBag size={30}/><p>Your bag is waiting for something delicious.</p></div>}</div><div className="drawer-footer"><div className="totals"><span>Subtotal</span><b>{formatPrice(subtotal)}</b><span>GST (5%)</span><b>{formatPrice(gst)}</b><strong>Total <b>{formatPrice(total)}</b></strong></div><button type="button" className="checkout" disabled={!cart.length} onClick={() => setConfirmed(true)}>{mode === 'Dine in' ? 'Send to kitchen' : 'Place pickup order'} <span>→</span></button></div></aside>}
    {cartOpen && <div className="backdrop" onClick={() => setCartOpen(false)}></div>}{cartOpen && cart.length > 0 && <label className="instructions-panel"><span>Special cooking instructions</span><textarea value={instruction} onChange={event => setInstruction(event.target.value)} placeholder="For example: less spicy, no onion, extra sauce..." /></label>}{notice && <div className="notification-popover"><b>Order updates are on</b><span>We will let you know when your food is ready.</span></div>}{addedItem && <button type="button" className="cart-toast" onClick={() => { setCartOpen(true); setAddedItem(''); }}>{addedItem} added <ShoppingBag size={16}/></button>}{confirmed && <div className="confirmation"><div><span className="check">✓</span><p className="eyebrow">ORDER CONFIRMED</p><h2>{mode === 'Dine in' ? 'The kitchen has it.' : 'We will see you soon.'}</h2><p>{mode === 'Dine in' ? 'Your order is on its way to Table 12.' : 'Your order will be ready at the pickup counter in about 20 minutes.'}</p><div className="ready"><Clock3 size={19}/><span>Estimated ready time <b>{mode === 'Dine in' ? '18 minutes' : '20 minutes'}</b></span></div><button type="button" className="checkout" onClick={() => { setConfirmed(false); setCartOpen(false); setCart([]); setAddedItem(''); setInstruction(''); }}>Done</button></div></div>}
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
