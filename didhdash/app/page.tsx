"use client";

import { Bell, ChevronRight, CreditCard, MapPin, Search, Wallet, Home as HomeIcon, ShoppingBag, Heart, MessageCircle, Clock, Receipt, Settings } from "lucide-react";
import Image from "next/image";

import Link from 'next/link';
import { useState, useEffect, useContext } from "react";
import "../styles/style.css";
import "../styles/globals.css";
import { fetchCategories, fetchRestaurants, fetchMenuItemsByCategory, fetchRestaurantMenuByCategory, searchRestaurants, createOrder, fetchOrders } from "./services/api";
import { AuthContext } from '../context/page'; // Add this line to import AuthContext
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { MenuItem, Order, OrderStatus } from './services/api';

import Career from "./career/page";



const orderMenu = [
  { name: "Margherita Pizza", icon: "🍕", price: 12.99 },
  { name: "Cheeseburger", icon: "🍔", price: 8.99 },
  { name: "California Roll", icon: "🍣", price: 10.99 }
];

const navItems = [
  { name: 'Dashboard', icon: <span className="nav-icon"><HomeIcon /></span> },
  { name: 'Food Order', icon: <ShoppingBag className="nav-icon" /> },
  { name: 'Favorite', icon: <Heart className="nav-icon" /> },
  { name: 'Message', icon: <MessageCircle className="nav-icon" /> },
  { name: 'Order History', icon: <Clock className="nav-icon" /> },
  { name: 'Bills', icon: <Receipt className="nav-icon" /> },
  { name: 'Setting', icon: <Settings className="nav-icon" /> },
];

// Update the default image constants at the top of the file
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop";
const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop";
const DEFAULT_PROFILE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop";

// Add interface for cart item
interface CartItem extends MenuItem {
  quantity: number;
}

// Add this interface near the top with other interfaces
interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCategories = searchParams?.get('showCategories') === 'true';
  const [balance] = useState(12000);
  const [categories, setCategories] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAllCategories, setViewAllCategories] = useState(showCategories);
  const [viewAllRestaurants, setViewAllRestaurants] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [restaurantMenu, setRestaurantMenu] = useState<any>({});
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(12000); // Replace static balance
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.user != null;

  // Move loadData inside the component and implement it
  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, restaurantsData] = await Promise.all([
        fetchCategories(),
        fetchRestaurants()
      ]);
      
      setCategories(categoriesData);
      setRestaurants(restaurantsData);
      // For recent orders, we'll use the first 3 restaurants as an example
      setRecentOrders(restaurantsData.slice(0, 3).map((restaurant: any) => ({
        name: restaurant.name,
        image: restaurant.image,
        price: restaurant.menuItems?.[0]?.price || 0,
        distance: "2 miles", // You might want to calculate this based on user location
        time: "30 mins"
      })));
    } catch (error) {
      throw error; 

    } finally {
      setLoading(false);
    }
  };

  const getUserIdFromToken = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

 
  
  // Update the initial useEffect to use the new loadData function
  useEffect(() => {
    loadData();
  }, []);

  // Add function to handle category click
  const handleCategoryClick = async (categoryId: number) => {
    try {
      setIsLoadingMenuItems(true);
      setSelectedCategory(categoryId);
      const items = await fetchMenuItemsByCategory(categoryId);
      
      if (Array.isArray(items)) {
        setMenuItems(items);
      } else {
        setMenuItems([]);
        console.error('Invalid menu items data received');
      }
      
      setViewAllRestaurants(false); // Reset restaurant view
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    } finally {
      setIsLoadingMenuItems(false);
    }
  };

  // Add function to handle restaurant selection
  const handleRestaurantClick = async (restaurantId: number) => {
    try {
      setIsLoadingMenu(true);
      setSelectedRestaurant(restaurantId);
      setRestaurantId(restaurantId);
      const menuData = await fetchRestaurantMenuByCategory(restaurantId);
      setRestaurantMenu(menuData);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // Add search function
  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const results = await searchRestaurants({
        name: searchQuery,
        minPrice: priceRange.min ? Number(priceRange.min) : undefined,
        maxPrice: priceRange.max ? Number(priceRange.max) : undefined
      });
      setRestaurants(results);
      setSelectedCategory(null);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery || priceRange.min || priceRange.max) {
        handleSearch();
      } else {
        // Reset to original data if search is cleared
        loadData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, priceRange.min, priceRange.max]);

  // Add function to handle adding items to cart
  const handleAddToCart = (item: MenuItem, type: 'menuItem' | 'restaurant') => {
    const newItem: CartItem = {
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      imageUrl: item.imageUrl,
      restaurantId: type === 'menuItem' ? item.restaurantId : item.id
    };

    setCart(prevCart => {
      // Check if adding item from different restaurant
      if (prevCart.length > 0 && prevCart[0].restaurantId !== newItem.restaurantId) {
        if (confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
          return [newItem];
        }
        return prevCart;
      }

      const existingItem = prevCart.find(cartItem => cartItem.id === newItem.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === newItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, newItem];
    });
  };

  // Add function to remove items from cart
  const handleRemoveFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      
      return prevCart.filter(item => item.id !== itemId);
    });
  };

  // Calculate total amount whenever cart changes
  useEffect(() => {
    const serviceCharge = 1.00;
    const itemsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalAmount(itemsTotal + serviceCharge);
  }, [cart]);

  // Add this function to load orders
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      if ((error as any).response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleCheckout function
  const handleCheckout = async () => {
    if (isSubmitting) return;

    const userId = getUserIdFromToken();
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      if (restaurantId === null) {
        alert('Please select a restaurant.');
        return;
      }

      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price // Ensure this is a number
        })),
        totalAmount: totalAmount, // Ensure this is a number
        restaurant: restaurantId, // Use the defined restaurantId
        status: 'pending',
        paymentStatus: 'unpaid',
        deliveryAddress: '123 Main St' // Replace with actual delivery address
      };

      const response = await createOrder(orderData);
      
      if (response && response.success) {
        setCart([]);
        alert('Order placed successfully!');
        router.push('/food-order');
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the auth check useEffect
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      router.push('/login');
    }
  }, []);

  const handleNavClick = (navItem: string) => {
    setActiveNav(navItem);
    if (navItem === 'Food Order') {
      router.push('/food-order');
    } else if (navItem === 'Dashboard') {
      // Reset all states to initial values
      setSelectedCategory(null);
      setSelectedRestaurant(null);
      setViewAllCategories(false);
      setViewAllRestaurants(false);
      setSearchQuery('');
      setPriceRange({ min: '', max: '' });
      loadData(); // Reload initial data
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const displayedCategories = viewAllCategories ? categories : categories.slice(0, 6);
  const displayedRestaurants = viewAllRestaurants ? restaurants : restaurants.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="max-w-[1400px] mx-auto p-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-[200px] bg-white rounded-2xl p-4 h-[calc(100vh-2rem)] flex flex-col">
          <div className="text-xl font-bold mb-8">
            <span className="text-black">Go</span>
            <span className="text-yellow">Meal</span>
            <span>.</span>
          </div>
          
          <nav className="nav-menu">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`nav-item ${activeNav === item.name ? 'active' : ''}`}
                onClick={() => handleNavClick(item.name)}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="bg-yellow rounded-2xl p-4 text-white">
            <p className="font-semibold mb-2">Upgrade your Account to Get Free Voucher</p>
            <button className="bg-white text-yellow px-4 py-2 rounded-lg text-sm font-medium">
              Upgrade
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Hello, Patricia</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants..."
                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-[300px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="Min $"
                    className="w-20 px-3 py-2 rounded-xl border border-gray-200"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="Max $"
                    className="w-20 px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                {isSearching && (
                  <div className="animate-spin h-4 w-4 border-2 border-yellow border-t-transparent rounded-full" />
                )}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <Link href="/login" className="px-3 py-2 bg-blue-500 text-white rounded">
                    Login
                  </Link>
                  <Link href="/register" className="px-3 py-2 bg-green-500 text-white rounded">
                    Register
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={() => authContext?.logout()} 
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="banner">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Get Discount Voucher</h2>
              <p className="text-sm opacity-90">Up To 20%</p>
            </div>
            <Image
              src={DEFAULT_PROFILE}
              width={300}
              height={300}
              alt="Banner"
             
              className="rounded-full absolute right-6 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Category</h2>
              <button 
                className="text-yellow flex items-center gap-1"
                onClick={() => {
                  setViewAllCategories(!viewAllCategories);
                  setSelectedCategory(null); // Reset selection when toggling view
                }}
              >
                {viewAllCategories ? 'Show Less' : 'View all'} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className={`grid ${viewAllCategories ? 'grid-cols-4' : 'grid-cols-6'} gap-4`}>
              {displayedCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'ring-2 ring-yellow' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="text-3xl mb-2">🍽️</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Section - Show when category is selected */}
          {selectedCategory && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Menu Items</h2>
                <button 
                  className="text-yellow flex items-center gap-1"
                  onClick={() => setSelectedCategory(null)}
                >
                  Back to All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {isLoadingMenuItems ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-yellow border-t-transparent rounded-full"></div>
                </div>
              ) : (
                menuItems.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="relative h-48">
                          <Image
                            src={item.imageUrl || DEFAULT_FOOD_IMAGE}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-yellow">
                              ${Number(item.price).toFixed(2)}
                            </div>
                            <button 
                              className="add-btn"
                              onClick={() => handleAddToCart(item, 'menuItem')}
                            >
                              +
                            </button>
                          </div>
                          {item.restaurant && (
                            <div className="text-sm text-gray-500 mt-2">
                              {item.restaurant.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No menu items found for this category
                  </div>
                )
              )}
            </div>
          )}

          {/* Show Restaurants section only when no category is selected */}
          {!selectedCategory && !selectedRestaurant && (
            <div>
              {/* Popular Restaurants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Popular Restaurants</h2>
                  <button 
                    className="text-yellow flex items-center gap-1"
                    onClick={() => setViewAllRestaurants(!viewAllRestaurants)}
                  >
                    {viewAllRestaurants ? 'Show Less' : 'View all'} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className={`grid ${viewAllRestaurants ? 'grid-cols-4' : 'grid-cols-3'} gap-6`}>
                  {displayedRestaurants.map((restaurant) => (
                    <div 
                      key={restaurant.id} 
                      className="dish-card cursor-pointer"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <div className="relative">
                        <Image
                          src={restaurant.image || DEFAULT_FOOD_IMAGE}
                          alt={restaurant.name}
                          width={500}
                          height={300}
                          className="w-full h-[200px] object-cover"
                        />
                        {restaurant.discount && (
                          <div className="dish-discount">
                            {restaurant.discount}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="dish-price">
                            ${restaurant.menuItems?.[0]?.price || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex text-yellow-400">
                            {"★".repeat(5)}
                          </div>
                          <button className="add-btn">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Order</h2>
                  <button className="text-yellow flex items-center gap-1">
                    View all <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {recentOrders.map((order) => (
                    <div key={order.name} className="bg-white p-4 rounded-xl">
                      <div className="flex gap-4">
                        <Image
                          src={order.image || DEFAULT_FOOD_IMAGE}
                          alt={order.name}
                          width={80}
                          height={80}
                          className="rounded-xl"
                        />
                        <div>
                          <h3 className="font-semibold mb-1">{order.name}</h3>
                          <div className="dish-price">${order.price}</div>
                          <div className="text-sm text-gray-500 mt-2">
                            {order.distance} • {order.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Restaurant Menu Section */}
          {selectedRestaurant && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {restaurants.find(r => r.id === selectedRestaurant)?.name} Menu
                </h2>
                <button 
                  className="text-yellow flex items-center gap-1"
                  onClick={() => setSelectedRestaurant(null)}
                >
                  Back to Restaurants <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {isLoadingMenu ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-yellow border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(restaurantMenu).map(([categoryId, category]: [string, any]) => (
                    <div key={categoryId} className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">{category.categoryName}</h3>
                      <div className="grid grid-cols-3 gap-6">
                        {category.items.map((item: any) => (
                          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                            <div className="relative h-48">
                              <Image
                                src={item.imageUrl || DEFAULT_FOOD_IMAGE}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold mb-2">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-yellow">${Number(item.price).toFixed(2)}</div>
                                <button 
                                  className="add-btn"
                                  onClick={() => handleAddToCart(item, 'menuItem')}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <div className="w-[300px] bg-white rounded-2xl p-4 h-[calc(100vh-2rem)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Your Balance</h2> < Career/>
            <Image
              src={DEFAULT_PROFILE}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          <div className="balance-card mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>Balance</div>
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="balance-btn">
                <CreditCard className="h-4 w-4" /> Top Up
              </button>
              <button className="balance-btn">
                Transfer
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Your Address</h3>
              <button className="text-yellow">Change</button>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-black">Elm Street, 23</div>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ad minim tempor incididunt.</div>
                <div className="flex gap-2 mt-2">
                  <button className="address-btn">Add Note</button>
                  <button className="address-btn">Add Details</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Order Menu</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🍽️</div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">x{item.quantity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="dish-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-gray-500">Service</div>
                <div>+$1.00</div>
              </div>
              <div className="flex justify-between font-semibold">
                <div>Total</div>
                <div className="dish-price">${totalAmount.toFixed(2)}</div>
              </div>
            </div>

            <button className="coupon-btn mb-4">
              <div className="flex items-center gap-2">
                <div className="coupon-icon">%</div>
                <div>Have a coupon code?</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button 
              className={`checkout-btn ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCheckout}
              disabled={cart.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Checkout'}
            </button>
            
          </div>
        </div>
        </div>
{!selectedCategory && !selectedRestaurant && (
  <footer className="bg-white border-t mt-16 py-12">
    <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-4 gap-8">
      {/* About Section */}
      <div className="space-y-4">
        <div className="text-xl font-bold">
          <span className="text-black">Go</span>
          <span className="text-yellow">Meal</span>
          <span>.</span>
        </div>
        <p className="text-gray-600 text-sm">
          Delivering delicious meals to your doorstep. Experience the best of local cuisine with just a few clicks.
        </p>
        <div className="flex gap-3">
          <button className="social-icon">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>
          <button className="social-icon">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
            </svg>
          </button>
          <button className="social-icon">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Quick Links</h4>
        <ul className="space-y-2 text-gray-600">
          <li><a href="#" className="hover:text-yellow transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-yellow transition-colors">Our Menu</a></li>
          <li><a href="#" className="hover:text-yellow transition-colors">How It Works</a></li>
          <li><a href="#" className="hover:text-yellow transition-colors">FAQs</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Contact</h4>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>123 Food Street, Culinary City</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>hello@gomeal.com</span>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Newsletter</h4>
        <p className="text-gray-600 text-sm">Subscribe to receive updates and special offers</p>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
          />
          <button className="px-4 py-2 bg-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t mt-8 pt-8 text-center text-gray-600">
      <p>© {new Date().getFullYear()} GoMeal. All rights reserved.</p>
      <div className="mt-2 flex justify-center gap-4">
        <a href="#" className="hover:text-yellow transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-yellow transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
)}
      </div>
      
    
  );
}