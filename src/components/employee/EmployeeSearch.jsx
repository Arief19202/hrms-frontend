import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by employee name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeSearch;