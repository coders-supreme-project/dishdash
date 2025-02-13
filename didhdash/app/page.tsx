"use client";

import { Bell, ChevronRight, CreditCard, MapPin, Search, Wallet, Home as HomeIcon, ShoppingBag, Heart, MessageCircle, Clock, Receipt, Settings } from "lucide-react";
import Image from "next/image";

import Link from 'next/link';
import { useState, useEffect } from "react";
import "../styles/style.css";
import "../styles/globals.css";
import { fetchCategories, fetchRestaurants, fetchMenuItemsByCategory, fetchRestaurantMenuByCategory, searchRestaurants } from "./services/api";
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

export default function Home() {
  const [balance] = useState(12000);
  const [categories, setCategories] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAllCategories, setViewAllCategories] = useState(false);
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
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
                onClick={() => setActiveNav(item.name)}
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
              <div className="flex gap-2">
                <Link href="/login" className="px-3 py-2 bg-blue-500 text-white rounded">
                  Login
                </Link>
                <Link href="/register" className="px-3 py-2 bg-green-500 text-white rounded">
                  Register
                </Link>
              </div>
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
                            <button className="add-btn">+</button>
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
                                <div className="font-medium text-yellow">${item.price}</div>
                                <button className="add-btn">+</button>
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
              {orderMenu.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">x1</div>
                    </div>
                  </div>
                  <div className="dish-price">+${item.price}</div>
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
                <div className="dish-price">$202.00</div>
              </div>
            </div>

            <button className="coupon-btn mb-4">
              <div className="flex items-center gap-2">
                <div className="coupon-icon">%</div>
                <div>Have a coupon code?</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button className="checkout-btn">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
