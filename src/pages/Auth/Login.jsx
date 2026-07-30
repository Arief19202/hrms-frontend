import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(response.data);

      // store JWT
      localStorage.setItem("token", response.data.data.token);

      // store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );

      alert("Login Successful!");

      const role = response.data.data.user?.role;
      if (role === "employee") {
        navigate("/profile");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 sm:p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          HR Management System
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>

          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;