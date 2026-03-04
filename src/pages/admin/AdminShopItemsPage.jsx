import { useEffect, useState } from "react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/image";

const emptyForm = { name: "", description: "", imageUrl: "", price: "", available: true, imageFile: null };

const AdminShopItemsPage = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const { data } = await api.get("/shop-items");
      setItems(data);
    } catch (_e) {
      showToast("Failed to load shop items.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("price", Number(form.price));
    payload.append("available", form.available);
    if (form.imageFile) payload.append("image", form.imageFile);
    else if (form.imageUrl) payload.append("imageUrl", form.imageUrl);

    try {
      if (editingId) {
        await api.put(`/shop-items/${editingId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/shop-items", payload, { headers: { "Content-Type": "multipart/form-data" } });
      }
      showToast(editingId ? "Shop item updated." : "Shop item created.");
      setForm(emptyForm);
      setEditingId("");
      await loadItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save shop item");
      showToast(err.response?.data?.message || "Failed to save shop item", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      price: String(item.price),
      available: item.available,
      imageFile: null
    });
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/shop-items/${id}`);
      showToast("Shop item deleted.");
      await loadItems();
    } catch (_e) {
      showToast("Failed to delete shop item.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Manage Shop Items</h1>
        <p className="text-slate-600">Add and update products, price, visibility, and imagery.</p>
      </div>

      <form onSubmit={onSubmit} className="panel space-y-3 p-5">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Shop Item" : "Add Shop Item"}</h2>
        <input name="name" value={form.name} onChange={onChange} placeholder="Item name" className="field" required />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="field" required />
        <div className="grid gap-3 md:grid-cols-2">
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Image URL (optional if uploading file)" className="field" />
          <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))} className="field" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input name="price" type="number" min="0" value={form.price} onChange={onChange} placeholder="Price" className="field" required />
          <label className="field flex items-center gap-2">
            <input type="checkbox" checked={!!form.available} onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))} />
            Available in shop
          </label>
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="flex gap-2">
          <button className="btn-primary">{editingId ? "Update" : "Create"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      {loading && <div className="panel p-6 text-sm text-slate-600">Loading shop items...</div>}
      {!loading && items.length === 0 && <div className="panel p-6 text-sm text-slate-600">No shop items added yet.</div>}

      <section className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item._id} className="panel card-hover overflow-hidden">
            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="img-fit h-56 w-full" />
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-600">${item.price}</p>
                </div>
                <span className={`badge ${item.available ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>{item.available ? "Available" : "Hidden"}</span>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
              <div className="flex gap-2 text-sm">
                <button onClick={() => startEdit(item)} className="btn-ghost px-3 py-1">Edit</button>
                <button onClick={() => removeItem(item._id)} className="rounded-xl border border-rose-200 px-3 py-1 text-rose-700">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminShopItemsPage;
