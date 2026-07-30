function EmployeeSearch({
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments = [],
  onSearch,
  onDepartmentChange,
  onStatusChange,
  onReset,
}) {
  const hasActiveFilters = search || departmentFilter || statusFilter;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow mb-5">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by employee name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Department Filter Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={departmentFilter}
            onChange={(e) => {
              const val = e.target.value;
              setDepartmentFilter(val);
              if (onDepartmentChange) onDepartmentChange(val);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val);
              if (onStatusChange) onStatusChange(val);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
          >
            Search
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex-1 md:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeSearch;