function AttendanceSearch({
    search,
    setSearch,
    onSearch
}) {
    return (
        <div className="bg-white rounded-lg shadow p-4">

            <div className="flex flex-col md:flex-row gap-4">

                <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch();
                        }
                    }}
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={onSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Search
                </button>

            </div>

        </div>
    );
}

export default AttendanceSearch;