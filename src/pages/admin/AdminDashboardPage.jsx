import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";
import { resolveImageUrl } from "../../utils/image";

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/orders"), api.get("/customers"), api.get("/templates"), api.get("/shop-items")])
      .then(([o, c, t, s]) => {
        setOrders(o.data);
        setCustomers(c.data);
        setTemplates(t.data);
        setShopItems(s.data);
      });
  }, []);

  const completedCount = orders.filter((o) => o.transactionCompleted).length;
  const readyForPickupCount = orders.filter((o) => !o.transactionCompleted && o.status === "Ready for Pickup").length;

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-600">Manage designs, shop products, customers, and order progress from one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="panel card-hover p-4"><p className="text-sm text-slate-500">Total Customers</p><p className="text-3xl font-bold text-[#b8322f]">{customers.length}</p></div>
        <div className="panel card-hover p-4"><p className="text-sm text-slate-500">Total Orders</p><p className="text-3xl font-bold text-[#b8322f]">{orders.length}</p></div>
        <div className="panel card-hover p-4"><p className="text-sm text-slate-500">Ready for Pickup</p><p className="text-3xl font-bold text-[#b67600]">{readyForPickupCount}</p></div>
        <div className="panel card-hover p-4"><p className="text-sm text-slate-500">Transaction Completed</p><p className="text-3xl font-bold text-[#0f8b6e]">{completedCount}</p></div>
        <div className="panel card-hover p-4"><p className="text-sm text-slate-500">Shop Items</p><p className="text-3xl font-bold text-[#b8322f]">{shopItems.length}</p></div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Link to="/admin/templates" className="panel card-hover p-4 font-semibold">Manage Templates</Link>
        <Link to="/admin/shop-items" className="panel card-hover p-4 font-semibold">Manage Shop</Link>
        <Link to="/admin/customers" className="panel card-hover p-4 font-semibold">Manage Customers</Link>
        <Link to="/admin/orders" className="panel card-hover p-4 font-semibold">Manage Orders</Link>
        <Link to="/admin/about-content" className="panel card-hover p-4 font-semibold">Manage About Content</Link>
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-xl font-semibold">Recent Orders</h2>
        <div className="space-y-2">
          {orders.slice(0, 8).map((order) => {
            const orderName = order.orderType === "shop" ? order.shopItem?.name : (order.dressType || order.template?.name);
            const orderImage = order.shopItem?.imageUrl || order.template?.imageUrl;
            const statusLabel = order.transactionCompleted ? "Transaction Completed" : order.status;
            return (
              <div key={order._id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <img src={orderImage ? resolveImageUrl(orderImage) : "https://via.placeholder.com/48x48?text=-"} alt={orderName || "Order"} className="img-fit h-12 w-12 rounded-lg" />
                <span className="flex-1">{order.orderCode} - {order.customer?.fullName} - {orderName}</span>
                <span className="badge border-slate-200 bg-slate-100 text-slate-700">{statusLabel}</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default AdminDashboardPage;
