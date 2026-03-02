const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiBase = apiUrl.replace(/\/api\/?$/, "");

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${apiBase}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};
