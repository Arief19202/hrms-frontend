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
    <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-card mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input with Icon */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by employee name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Department Filter Dropdown */}
        <div className="w-full md:w-52 relative">
          <select
            value={departmentFilter}
            onChange={(e) => {
              const val = e.target.value;
              setDepartmentFilter(val);
              if (onDepartmentChange) onDepartmentChange(val);
            }}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <FunnelIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full md:w-40 relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val);
              if (onStatusChange) onStatusChange(val);
            }}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <FunnelIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>Search</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex-1 md:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5"
              title="Reset Filters"
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