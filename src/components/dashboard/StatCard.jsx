import {
    UserGroupIcon,
    BuildingOfficeIcon,
    ClockIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

function StatCard({
    title,
    value,
    color = "blue",
    iconKey
}) {
    const themeStyles = {
        blue: {
            bg: "bg-blue-50/80 text-blue-600 border-blue-100",
            glow: "hover:border-blue-200",
            trend: "+2 this month",
            trendColor: "text-blue-600"
        },
        green: {
            bg: "bg-emerald-50/80 text-emerald-600 border-emerald-100",
            glow: "hover:border-emerald-200",
            trend: "Active & Healthy",
            trendColor: "text-emerald-600"
        },
        purple: {
            bg: "bg-purple-50/80 text-purple-600 border-purple-100",
            glow: "hover:border-purple-200",
            trend: "Today's Log",
            trendColor: "text-purple-600"
        },
        yellow: {
            bg: "bg-amber-50/80 text-amber-600 border-amber-100",
            glow: "hover:border-amber-200",
            trend: "Needs Review",
            trendColor: "text-amber-600"
        },
        red: {
            bg: "bg-rose-50/80 text-rose-600 border-rose-100",
            glow: "hover:border-rose-200",
            trend: "Declined",
            trendColor: "text-rose-600"
        },
        indigo: {
            bg: "bg-indigo-50/80 text-indigo-600 border-indigo-100",
            glow: "hover:border-indigo-200",
            trend: "Updated",
            trendColor: "text-indigo-600"
        }
    };

    const getIcon = () => {
        if (iconKey === "employees" || title?.toLowerCase().includes("employee")) return UserGroupIcon;
        if (iconKey === "departments" || title?.toLowerCase().includes("department")) return BuildingOfficeIcon;
        if (iconKey === "attendance" || title?.toLowerCase().includes("attendance")) return ClockIcon;
        if (title?.toLowerCase().includes("pending")) return ClipboardDocumentListIcon;
        if (title?.toLowerCase().includes("approved")) return CheckCircleIcon;
        if (title?.toLowerCase().includes("rejected")) return XCircleIcon;
        return ChartBarIcon;
    };

    const Icon = getIcon();
    const style = themeStyles[color] || themeStyles.blue;

    return (
        <div className={`bg-white border border-slate-200/80 rounded-2xl shadow-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${style.glow}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        {title}
                    </p>

                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2.5 font-heading">
                        {value}
                    </h3>
                </div>

                <div className={`w-12 h-12 rounded-2xl border ${style.bg} flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${style.trendColor}`}>
                    {style.trend}
                </span>
                <span className="text-slate-400 text-[11px]">Real-time stat</span>
            </div>
        </div>
    );
}

export default StatCard;