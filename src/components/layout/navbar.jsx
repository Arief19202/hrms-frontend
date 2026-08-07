function Navbar({ title }) {
    return (
        <nav className="bg-blue-600 text-white p-4">
            <h1 className="text-xl font-bold">
                {title}
            </h1>
        </nav>
    );
}

export default Navbar;