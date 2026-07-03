export default function EmptyState({
  title = "No products found",
  message = "Please check back later.",
}) {
  return (
    <div className="text-center py-16 px-4 bg-white border border-gray-200 rounded-2xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
