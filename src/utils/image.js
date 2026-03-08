const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiBase = apiUrl.replace(/\/api\/?$/, "");

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  const normalized = String(imageUrl).replace(/\\/g, "/").trim();
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  return `${apiBase}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
};
