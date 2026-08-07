function Card({ title, value }) {
    return (
        <div className="bg-wite shadow rounded-lg p-6 w-64">
            <h2 classname="text-gray-500">
                {title}
            </h2>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}

export default Card;