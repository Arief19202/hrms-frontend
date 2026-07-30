function DepartmentSearch({
  search,
  setSearch,
  onSearch,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5">

      <div className="flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Search department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="w-full sm:flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />

        <button
          onClick={onSearch}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Search
        </button>

      </div>

    </div>
  );
}

export default DepartmentSearch;