
///////////////////////////////////////////////////
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../utils/axioClient";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Login request
    const loginRes = await axiosClient.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    // Check success
    if (loginRes.data.success) {

      // Wait a little for mobile browsers
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // Fetch authenticated user
      const userRes = await axiosClient.get(
        "/auth/me"
      );

      setUser(userRes.data);

      navigate("/chat");
    }

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "Login failed"
    );
  }
};
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
