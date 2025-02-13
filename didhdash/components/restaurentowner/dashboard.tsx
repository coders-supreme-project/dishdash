import Image from 'next/image';
import "./dashboard.css"
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1e293b]">Good morning, Sarah</h1>
          <p className="text-[#64748b]">Here's what's happening with your store today</p>
        </div>
        <button className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors">
          Add New Product
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Sales', value: '$48,783.91', change: '+12.5%' },
          { title: 'Visitors', value: '1,438', change: '+8.2%' },
          { title: 'Total Orders', value: '357', change: '+3.1%' },
          { title: 'Refunded', value: '$125.00', change: '-0.5%' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-[#64748b] text-sm mb-2">{stat.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-[#1e293b]">{stat.value}</span>
              <span className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b]">Recent Orders</h2>
            <button className="text-[#3b82f6] text-sm hover:text-[#2563eb]">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { customer: 'John Cooper', product: 'Nike Air Max 270', price: '$235.00', status: 'Completed' },
              { customer: 'Sarah Blake', product: 'Adidas Ultra Boost', price: '$195.00', status: 'Processing' },
              { customer: 'Mike Wilson', product: 'Puma RS-X', price: '$155.00', status: 'Completed' },
              { customer: 'Lisa Anderson', product: 'New Balance 990', price: '$175.00', status: 'Processing' }
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div>
                    <p className="font-medium text-[#1e293b]">{order.customer}</p>
                    <p className="text-sm text-[#64748b]">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#1e293b]">{order.price}</p>
                  <p className={`text-sm ${
                    order.status === 'Completed' ? 'text-green-500' : 'text-orange-500'
                  }`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b]">Popular Products</h2>
            <button className="text-[#3b82f6] text-sm hover:text-[#2563eb]">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Nike Air Max 270', sales: '123 sales', price: '$235.00' },
              { name: 'Adidas Ultra Boost', sales: '98 sales', price: '$195.00' },
              { name: 'Puma RS-X', sales: '89 sales', price: '$155.00' },
              { name: 'New Balance 990', sales: '76 sales', price: '$175.00' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-[#1e293b]">{product.name}</p>
                    <p className="text-sm text-[#64748b]">{product.sales}</p>
                  </div>
                </div>
                <p className="font-medium text-[#1e293b]">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}