function EmployeeSearch({
  search,
  setSearch,
  onSearch,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-5">

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Search by employee name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
        >
          Search
        </button>

      </div>

    </div>
  );
}

export default EmployeeSearch;