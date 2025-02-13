"use client";

import { Bell, ChevronRight, CreditCard, MapPin, Search, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import "../styles/style.css";
import "../styles/globals.css";
import Career from "./career/page";
const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Sushi", icon: "🍣" },
  { name: "Dessert", icon: "🍰" },
  { name: "Drinks", icon: "🍹" },
  { name: "Salad", icon: "🥗" },
];

const popularDishes = [
  {
    name: "Margherita Pizza",
    image: "https://example.com/margherita.jpg",
    discount: "10% OFF",
    price: 12.99,
  },
  {
    name: "Cheeseburger",
    image: "https://example.com/cheeseburger.jpg",
    discount: "15% OFF",
    price: 8.99,
  },
  {
    name: "California Roll",
    image: "https://example.com/california-roll.jpg",
    discount: "20% OFF",
    price: 10.99,
  },
]

const recentOrders = [
  {
    name: "Pepperoni Pizza",
    image: "https://example.com/pepperoni.jpg",
    price: 14.99,
    distance: "2 miles",
    time: "30 mins",
  },
  {
    name: "Veggie Burger",
    image: "https://example.com/veggie-burger.jpg",
    price: 9.99,
    distance: "1.5 miles",
    time: "25 mins",
  },
  {
    name: "Spicy Tuna Roll",
    image: "https://example.com/spicy-tuna.jpg",
    price: 11.99,
    distance: "3 miles",
    time: "40 mins",
  },
];

const orderMenu = [
  { name: "Margherita Pizza", icon: "🍕", price: 12.99 },
  { name: "Cheeseburger", icon: "🍔", price: 8.99 },
  { name: "California Roll", icon: "🍣", price: 10.99 },
];

// ... (keep all the existing constants: popularDishes, recentOrders, orderMenu)

export default function Home() {
  const [balance] = useState(12000);
  
  return (
    <div className="min-h-screen bg-gray-50">
            <Career/>     
   <div className="max-w-[1400px] mx-auto p-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-[200px] bg-white rounded-2xl p-4 h-[calc(100vh-2rem)] flex flex-col">
          <div className="text-xl font-bold mb-8">
            <span className="text-black">Go</span>
            <span className="text-yellow">Meal</span>
            <span>.</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            <button className="dashboard-btn">
              Dashboard
            </button>
            <button className="nav-btn">
              Food Order
            </button>
            <button className="nav-btn">
              Favorite
            </button>
            <button className="nav-btn">
              Message
            </button>
            <button className="nav-btn">
              Order History
            </button>
            <button className="nav-btn">
              Bills
            </button>
            <button className="nav-btn">
              Setting
            </button>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="What do you want eat today..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-[300px]"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="banner">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Get Discount Voucher</h2>
              <p className="text-sm opacity-90">Up To 20%</p>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"
              alt="Banner"
              width={200}
              height={200}
              className="rounded-full absolute right-6 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Category</h2>
              <button className="text-yellow flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="category-card"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Dishes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Popular Restaurants</h2>
              <button className="text-yellow flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {popularDishes.map((dish) => (
                <div key={dish.name} className="dish-card">
                  <div className="relative">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={500}
                      height={300}
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="dish-discount">
                      {dish.discount}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{dish.name}</h3>
                      <div className="dish-price">${dish.price}</div>
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
                      src={order.image}
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

        {/* Right Sidebar */}
        <div className="w-[300px] bg-white rounded-2xl p-4 h-[calc(100vh-2rem)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Your Balance</h2>
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
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
            <div className="text-2xl font-bold mb-4">${balance.toLocaleString()}</div>
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