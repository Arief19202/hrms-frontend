function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-5xl mb-3">📭</div>

      <h2 className="text-lg font-semibold text-gray-700">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;