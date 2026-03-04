import { useEffect, useState } from "react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/image";

const emptyForm = { name: "", description: "", imageUrl: "", imageFile: null };

const AdminTemplatesPage = () => {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadTemplates = async () => {
    try {
      const { data } = await api.get("/templates");
      setTemplates(data);
    } catch (_e) {
      showToast("Failed to load templates.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    if (form.imageFile) payload.append("image", form.imageFile);
    else if (form.imageUrl) payload.append("imageUrl", form.imageUrl);

    try {
      if (editingId) {
        await api.put(`/templates/${editingId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/templates", payload, { headers: { "Content-Type": "multipart/form-data" } });
      }
      showToast(editingId ? "Template updated." : "Template created.");
      setForm(emptyForm);
      setEditingId("");
      await loadTemplates();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save template");
      showToast(err.response?.data?.message || "Failed to save template", "error");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, description: item.description, imageUrl: item.imageUrl, imageFile: null });
  };

  const removeTemplate = async (id) => {
    try {
      await api.delete(`/templates/${id}`);
      showToast("Template deleted.");
      await loadTemplates();
    } catch (_e) {
      showToast("Failed to delete template.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Manage Design Templates</h1>
        <p className="text-slate-600">Upload and curate design inspirations for custom requests.</p>
      </div>

      <form onSubmit={onSubmit} className="panel space-y-3 p-5">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Template" : "Add Template"}</h2>
        <input name="name" value={form.name} onChange={onChange} placeholder="Design name" className="field" required />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Design description" className="field" required />
        <div className="grid gap-3 md:grid-cols-2">
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Image URL (optional if uploading file)" className="field" />
          <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))} className="field" />
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="flex gap-2">
          <button className="btn-primary">{editingId ? "Update" : "Create"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      {loading && <div className="panel p-6 text-sm text-slate-600">Loading templates...</div>}
      {!loading && templates.length === 0 && <div className="panel p-6 text-sm text-slate-600">No templates added yet.</div>}

      <section className="grid gap-4 md:grid-cols-2">
        {templates.map((item) => (
          <article key={item._id} className="panel card-hover overflow-hidden">
            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="h-56 w-full bg-[#f8f3ee] object-contain" />
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="btn-ghost px-3 py-1">Edit</button>
                  <button onClick={() => removeTemplate(item._id)} className="rounded-xl border border-rose-200 px-3 py-1 text-rose-700">Delete</button>
                </div>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminTemplatesPage;
