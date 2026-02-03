export default function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label={label}>
      <div
        className="animate-spin rounded-full h-12 w-12 border-2 border-pink-500 border-t-transparent"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
