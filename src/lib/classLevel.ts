export const normalizeClassValue = (value?: string | null): string => {
  if (!value) return "";
  const match = String(value).match(/(\d{1,2})/);
  return match ? match[1] : "";
};
