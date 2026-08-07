import {
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

function StatCard({
  title,
  value,
  color = "blue"
}) {
  const getIcon = () => {
    const t = (title || "").toLowerCase();
    if (t.includes("employee")) return <UsersIcon className="w-6 h-6" />;
    if (t.includes("department")) return <BuildingOfficeIcon className="w-6 h-6" />;
    if (t.includes("attendance")) return <ClockIcon className="w-6 h-6" />;
    if (t.includes("approved")) return <CheckCircleIcon className="w-6 h-6" />;
    if (t.includes("rejected")) return <XCircleIcon className="w-6 h-6" />;
    if (t.includes("pending")) return <ExclamationTriangleIcon className="w-6 h-6" />;
    return <ChartBarIcon className="w-6 h-6" />;
  };

  const themeStyles = {
    blue: {
      bg: "bg-blue-50/80 text-blue-600 border-blue-100",
      ring: "group-hover:border-blue-300",
    },
    green: {
      bg: "bg-emerald-50/80 text-emerald-600 border-emerald-100",
      ring: "group-hover:border-emerald-300",
    },
    yellow: {
      bg: "bg-amber-50/80 text-amber-600 border-amber-100",
      ring: "group-hover:border-amber-300",
    },
    red: {
      bg: "bg-rose-50/80 text-rose-600 border-rose-100",
      ring: "group-hover:border-rose-300",
    },
    purple: {
      bg: "bg-indigo-50/80 text-indigo-600 border-indigo-100",
      ring: "group-hover:border-indigo-300",
    },
    indigo: {
      bg: "bg-violet-50/80 text-violet-600 border-violet-100",
      ring: "group-hover:border-violet-300",
    }
  };

  const style = themeStyles[color] || themeStyles.blue;

  return (
    <div className={`group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex justify-between items-center ${style.ring}`}>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
          {value !== undefined && value !== null ? value : 0}
        </h2>
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${style.bg} transition-transform group-hover:scale-105`}>
        {getIcon()}
      </div>
    </div>
  );
}

export default StatCard;