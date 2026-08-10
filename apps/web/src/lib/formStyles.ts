export function inputClass(hasError?: boolean): string {
  return `w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600 ${
    hasError ? "border-red-500" : "border-gray-300"
  }`;
}
