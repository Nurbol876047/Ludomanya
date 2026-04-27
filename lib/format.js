export function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("kk-KZ", {
    maximumFractionDigits
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("kk-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}
