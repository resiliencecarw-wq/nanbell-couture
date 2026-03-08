import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get("/templates")
      .then(({ data }) => setTemplates(data))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* Header */}
      <div className="panel p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Design Templates</h1>
            <p className="mt-1 text-slate-600">Browse our gallery of custom design inspirations for your perfect outfit</p>
          </div>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Request Custom Design
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="panel p-4">
              <div className="skeleton aspect-[4/5] w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && templates.length === 0 && (
        <div className="panel p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No Templates Available</h3>
          <p className="text-slate-600 mt-2">Check back soon for new design inspirations!</p>
          <Link to="/contact" className="btn-primary inline-flex mt-4">
            Contact Us for Custom Designs
          </Link>
        </div>
      )}

      {/* Templates Grid */}
      {!loading && templates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((item) => (
            <article key={item._id} className="panel card-hover group overflow-hidden flex flex-col">
              {/* Image with Hover Zoom */}
              <div 
                className="relative h-80 w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50 cursor-pointer"
                onClick={() => openLightbox(item.imageUrl)}
              >
                <div className="img-hover-zoom h-full w-full p-3 flex items-center justify-center">
                  <img 
                    src={resolveImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    className="img-fit max-h-full max-w-full rounded-lg" 
                    loading="lazy"
                  />
                </div>
                
                {/* View Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                      <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-3 p-5">
                <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
                <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                <button 
                  onClick={() => openLightbox(item.imageUrl)}
                  className="btn-ghost w-full text-sm"
                >
                  View Full Size
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CTA Section */}
      {!loading && templates.length > 0 && (
        <section className="panel p-6 md:p-8 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Can't find what you're looking for?</h3>
              <p className="text-slate-600 mt-1">We also create custom designs tailored to your preferences.</p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0">
              Request Custom Design
            </Link>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeLightbox}
              className="absolute -right-10 top-0 text-white hover:text-amber-300"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <img 
              src={resolveImageUrl(selectedImage)} 
              alt="Full size view" 
              className="max-h-[85vh] max-w-[90vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
