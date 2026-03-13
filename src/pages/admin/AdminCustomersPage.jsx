import { useEffect, useState, useCallback } from "react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

const AdminCustomersPage = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });

  const loadCustomers = useCallback(async (query = "") => {
    try {
      const { data } = await api.get(`/customers?search=${encodeURIComponent(query)}`);
      setCustomers(data);
    } catch (_e) {
      showToast("Failed to load customers.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const startEdit = (customer) => {
    setEditId(customer._id);
    setForm({ fullName: customer.fullName, phone: customer.phone, email: customer.email });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/customers/${id}`, form);
      showToast("Customer updated.");
      setEditId("");
      await loadCustomers(search);
    } catch (_e) {
      showToast("Failed to update customer.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Manage Customers</h1>
        <p className="text-slate-600">Search and update registered customer details.</p>
      </div>

      <div className="panel flex flex-col gap-2 p-4 sm:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone" className="field" />
        <button onClick={() => loadCustomers(search)} className="btn-primary">Search</button>
      </div>

      {loading && <div className="panel p-6 text-sm text-slate-600">Loading customers...</div>}
      {!loading && customers.length === 0 && <div className="panel p-6 text-sm text-slate-600">No customers found.</div>}

      <section className="space-y-3">
        {customers.map((customer) => (
          <article key={customer._id} className="panel p-4">
            {editId === customer._id ? (
              <div className="space-y-2">
                <input className="field" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                <input className="field" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                <input className="field" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(customer._id)} className="btn-primary">Save</button>
                  <button onClick={() => setEditId("")} className="btn-ghost">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{customer.fullName}</p>
                  <p className="text-sm text-slate-600">{customer.phone} | {customer.email}</p>
                </div>
                <button onClick={() => startEdit(customer)} className="btn-ghost px-3 py-1.5">Edit</button>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminCustomersPage;
