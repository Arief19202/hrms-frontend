import StatCard from "./StatCard";

function DashboardStats({ statistics }) {

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

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
                title="Today's Attendance"
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