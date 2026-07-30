function StatCard({
    title,
    value,
    color = "blue"
}) {

    const colors = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
        indigo: "bg-indigo-500"
    };

    return (

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">

            <div>

                <p className="text-gray-500 text-sm">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {value}
                </h2>

            </div>

            <div
                className={`${colors[color]} w-12 h-12 rounded-full`}
            />

        </div>

    );

}

export default StatCard;