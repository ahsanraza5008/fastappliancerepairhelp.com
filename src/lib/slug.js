export const slugify = (str) =>
  String(str || "").toLowerCase().trim().replace(/&/g, "").replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/-+/g, "-");
export const capitalize = (str) => {
  const t = String(str || "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};
