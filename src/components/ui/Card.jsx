function Card({ title, value, icon: Icon, trend }) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    {title}
                </p>
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>

            <p className="text-3xl font-extrabold text-slate-900 mt-3 font-heading">
                {value}
            </p>

            {trend && (
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    <span>↑</span> {trend}
                </p>
            )}
        </div>
    );
}

export default Card;