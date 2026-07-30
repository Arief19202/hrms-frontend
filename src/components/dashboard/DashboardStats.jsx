import StatCard from "./StatCard";

function DashboardStats({ statistics }) {

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <StatCard
                title="Employees"
                value={statistics.employees}
                color="blue"
            />

            <StatCard
                title="Departments"
                value={statistics.departments}
                color="green"
            />

            <StatCard
                title="Attendance"
                value={statistics.attendance}
                color="purple"
            />

            <StatCard
                title="Pending Leave"
                value={statistics.pendingLeaves}
                color="yellow"
            />

            <StatCard
                title="Approved Leave"
                value={statistics.approvedLeaves}
                color="green"
            />

            <StatCard
                title="Rejected Leave"
                value={statistics.rejectedLeaves}
                color="red"
            />

        </div>

    );

}

export default DashboardStats;