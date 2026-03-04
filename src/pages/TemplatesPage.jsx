import { useEffect, useState } from "react";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/templates")
      .then(({ data }) => setTemplates(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Design Templates</h1>
        <p className="mt-1 text-slate-600">Style inspiration gallery clients can choose for custom sewing requests.</p>
      </div>

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="panel p-4">
              <div className="skeleton h-52 w-full" />
              <div className="mt-3 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && templates.length === 0 && (
        <div className="panel p-6 text-sm text-slate-600">No templates have been uploaded yet.</div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((item) => (
          <article key={item._id} className="panel card-hover overflow-hidden">
            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="img-fit h-72 w-full" />
            <div className="space-y-2 p-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
