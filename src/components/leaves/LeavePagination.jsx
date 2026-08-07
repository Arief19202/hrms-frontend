function LeavePagination({
    pagination,
    setPagination
}) {

    const previousPage = () => {

        if (pagination.page > 1) {

            setPagination((prev) => ({
                ...prev,
                page: prev.page - 1
            }));

        }

    };

    const nextPage = () => {

        if (pagination.page < pagination.totalPages) {

            setPagination((prev) => ({
                ...prev,
                page: prev.page + 1
            }));

        }

    };

    return (

        <div className="flex justify-between items-center">

            <button
                onClick={previousPage}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
                Previous
            </button>

            <span>

                Page {pagination.page} of {pagination.totalPages}

            </span>

            <button
                onClick={nextPage}
                disabled={
                    pagination.page === pagination.totalPages
                }
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
                Next
            </button>

        </div>

    );

}

export default LeavePagination;