import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";
import { resolveImageUrl } from "../../utils/image";
import { useToast } from "../../context/ToastContext";

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [siteContent, setSiteContent] = useState({ founderName: "", founderBio: "", founderImageUrl: "", founderImageFile: null });
  const [savingSite, setSavingSite] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/orders"), api.get("/customers"), api.get("/templates"), api.get("/shop-items"), api.get("/site-content")])
      .then(([o, c, t, s, sc]) => {
        setOrders(o.data);
        setCustomers(c.data);
        setTemplates(t.data);
        setShopItems(s.data);
        setSiteContent({
          founderName: sc.data.founderName || "",
          founderBio: sc.data.founderBio || "",
          founderImageUrl: sc.data.founderImageUrl || "",
          founderImageFile: null
        });
      })
      .catch(() => showToast("Some dashboard data failed to load.", "error"));
  }, []);

  const completedCount = orders.filter((o) => o.transactionCompleted).length;
  const readyForPickupCount = orders.filter((o) => !o.transactionCompleted && o.status === "Ready for Pickup").length;

  const saveSiteContent = async (e) => {
    e.preventDefault();
    setSavingSite(true);
    const payload = new FormData();
    payload.append("founderName", siteContent.founderName);
    payload.append("founderBio", siteContent.founderBio);
    if (siteContent.founderImageFile) payload.append("founderImage", siteContent.founderImageFile);
    else if (siteContent.founderImageUrl) payload.append("founderImageUrl", siteContent.founderImageUrl);

    try {
      const { data } = await api.put("/site-content", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSiteContent((prev) => ({
        ...prev,
        founderName: data.founderName || "",
        founderBio: data.founderBio || "",
        founderImageUrl: data.founderImageUrl || "",
        founderImageFile: null
      }));
      showToast("About section updated successfully.");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update about section.", "error");
    } finally {
      setSavingSite(false);
    }
  };

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

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/templates" className="panel card-hover p-4 font-semibold">Manage Templates</Link>
        <Link to="/admin/shop-items" className="panel card-hover p-4 font-semibold">Manage Shop</Link>
        <Link to="/admin/customers" className="panel card-hover p-4 font-semibold">Manage Customers</Link>
        <Link to="/admin/orders" className="panel card-hover p-4 font-semibold">Manage Orders</Link>
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
                <img src={orderImage ? resolveImageUrl(orderImage) : "https://via.placeholder.com/48x48?text=-"} alt={orderName || "Order"} className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1">{order.orderCode} - {order.customer?.fullName} - {orderName}</span>
                <span className="badge border-slate-200 bg-slate-100 text-slate-700">{statusLabel}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-xl font-semibold">Face Behind Nanbell Couture</h2>
        <p className="mt-1 text-sm text-slate-600">Update the founder profile shown on the About page.</p>
        <form onSubmit={saveSiteContent} className="mt-4 space-y-3">
          <input
            className="field"
            placeholder="Founder section title"
            value={siteContent.founderName}
            onChange={(e) => setSiteContent((prev) => ({ ...prev, founderName: e.target.value }))}
          />
          <textarea
            className="field"
            rows="3"
            placeholder="Short founder message"
            value={siteContent.founderBio}
            onChange={(e) => setSiteContent((prev) => ({ ...prev, founderBio: e.target.value }))}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="field"
              placeholder="Founder image URL (optional if uploading)"
              value={siteContent.founderImageUrl}
              onChange={(e) => setSiteContent((prev) => ({ ...prev, founderImageUrl: e.target.value }))}
            />
            <input
              className="field"
              type="file"
              accept="image/*"
              onChange={(e) => setSiteContent((prev) => ({ ...prev, founderImageFile: e.target.files?.[0] || null }))}
            />
          </div>
          {siteContent.founderImageUrl && (
            <img
              src={resolveImageUrl(siteContent.founderImageUrl)}
              alt="Founder"
              className="h-44 w-full rounded-xl object-cover md:w-72"
            />
          )}
          <button disabled={savingSite} className={`btn-primary ${savingSite ? "cursor-not-allowed opacity-80" : ""}`}>
            {savingSite ? "Saving..." : "Save Founder Section"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
