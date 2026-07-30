function DepartmentPagination({
  pagination,
  onPageChange,
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center bg-white rounded-xl shadow p-5">

      <div className="text-gray-600">
        Page <strong>{pagination.page}</strong> of{" "}
        <strong>{pagination.totalPages}</strong>
      </div>

      <div className="flex gap-2">

        <button
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className={`px-4 py-2 rounded-lg ${
            pagination.page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          Previous
        </button>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          className={`px-4 py-2 rounded-lg ${
            pagination.page === pagination.totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default DepartmentPagination;