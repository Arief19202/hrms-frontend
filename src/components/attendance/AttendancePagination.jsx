function AttendancePagination({
    pagination,
    onPageChange
}) {

    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    const pages = [];

    for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-between items-center mt-6">

            <div className="text-sm text-gray-600">
                Total Records: {pagination.totalRecords}
            </div>

            <div className="flex gap-2">

                <button
                    disabled={pagination.page === 1}
                    onClick={() => onPageChange(pagination.page - 1)}
                    className={`px-4 py-2 rounded-lg border
                        ${
                            pagination.page === 1
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                        }`}
                >
                    Previous
                </button>

                {pages.map((page) => (

                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border
                            ${
                                page === pagination.page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>

                ))}

                <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => onPageChange(pagination.page + 1)}
                    className={`px-4 py-2 rounded-lg border
                        ${
                            pagination.page === pagination.totalPages
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                        }`}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default AttendancePagination;