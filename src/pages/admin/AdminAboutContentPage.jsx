import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { resolveImageUrl } from "../../utils/image";
import { useToast } from "../../context/ToastContext";

const readFounderImages = (data) => {
  const list = Array.isArray(data?.founderImageUrls) ? data.founderImageUrls : [];
  if (list.length > 0) return list;
  if (data?.founderImageUrl) return [data.founderImageUrl];
  return [];
};

const AdminAboutContentPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [siteContent, setSiteContent] = useState({
    founderName: "",
    founderBio: "",
    founderImageUrls: [],
    founderImageFiles: [],
    founderImageUrlsText: ""
  });

  useEffect(() => {
    api.get("/site-content")
      .then(({ data }) => {
        setSiteContent({
          founderName: data.founderName || "",
          founderBio: data.founderBio || "",
          founderImageUrls: readFounderImages(data),
          founderImageFiles: [],
          founderImageUrlsText: ""
        });
      })
      .catch(() => showToast("Failed to load about content.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggleRemoveImage = (url) => {
    setImagesToRemove((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  const saveSiteContent = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    payload.append("founderName", siteContent.founderName);
    payload.append("founderBio", siteContent.founderBio);
    siteContent.founderImageFiles.forEach((file) => payload.append("founderImages", file));
    if (siteContent.founderImageUrlsText.trim()) {
      payload.append("founderImageUrlsText", siteContent.founderImageUrlsText);
    }
    payload.append("imagesToRemove", JSON.stringify(imagesToRemove));

    try {
      const { data } = await api.put("/site-content", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSiteContent((prev) => ({
        ...prev,
        founderName: data.founderName || "",
        founderBio: data.founderBio || "",
        founderImageUrls: readFounderImages(data),
        founderImageFiles: [],
        founderImageUrlsText: ""
      }));
      setImagesToRemove([]);
      showToast("About content updated.");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save about content.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Manage About Content</h1>
            <p className="text-slate-600">Edit the Face Behind Nanbell Couture section shown on the About page.</p>
          </div>
          <Link to="/admin/dashboard" className="btn-ghost">Back to Dashboard</Link>
        </div>
      </div>

      {loading ? (
        <div className="panel p-6 text-sm text-slate-600">Loading about content...</div>
      ) : (
        <form onSubmit={saveSiteContent} className="panel space-y-3 p-5">
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
          <input
            className="field"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setSiteContent((prev) => ({ ...prev, founderImageFiles: Array.from(e.target.files || []) }))}
          />
          <textarea
            className="field"
            rows="3"
            placeholder="Image URL(s) optional - one per line"
            value={siteContent.founderImageUrlsText}
            onChange={(e) => setSiteContent((prev) => ({ ...prev, founderImageUrlsText: e.target.value }))}
          />

          {siteContent.founderImageUrls.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siteContent.founderImageUrls.map((url) => {
                const marked = imagesToRemove.includes(url);
                return (
                  <div key={url} className={`relative overflow-hidden rounded-xl border ${marked ? "border-rose-400" : "border-slate-200"}`}>
                    <img src={resolveImageUrl(url)} alt="Founder" className="h-36 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleRemoveImage(url)}
                      className={`absolute right-2 top-2 rounded-lg px-2 py-1 text-xs font-semibold ${marked ? "bg-rose-600 text-white" : "bg-white/90 text-rose-700"}`}
                    >
                      {marked ? "Undo" : "Remove"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {siteContent.founderImageFiles.length > 0 && (
            <p className="text-sm text-slate-600">{siteContent.founderImageFiles.length} new image(s) selected for upload.</p>
          )}

          <button disabled={saving} className={`btn-primary ${saving ? "cursor-not-allowed opacity-80" : ""}`}>
            {saving ? "Saving..." : "Save About Content"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminAboutContentPage;
