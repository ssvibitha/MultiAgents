export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-200 h-64 w-full"></div>

      <div className="p-4 space-y-3">
        <div className="bg-gray-200 h-5 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        <div className="bg-gray-200 h-10 rounded w-full"></div>
      </div>
    </div>
  );
}