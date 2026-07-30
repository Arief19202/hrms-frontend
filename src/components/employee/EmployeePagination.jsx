function EmployeePagination({
  pagination,
  onPageChange,
}) {

  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= pagination.totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">

      <button
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            page === pagination.page
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}

export default EmployeePagination;