function LeaveSearch({
    search,
    setSearch
}) {

    return (

        <div className="bg-white rounded-xl shadow p-4">

            <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
            />

        </div>

    );

}

export default LeaveSearch;