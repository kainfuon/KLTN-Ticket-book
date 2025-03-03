import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    //confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // if (formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match!");
    //   return;
    // }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!data.success) {
        setError(data.message);
        return;
      }

      alert("Signup successful! Redirecting to login...");
      navigate("/login");

    } catch (error) {
      setLoading(false);
      setError("Error connecting to server.");
    }
  };

  return (
    <section className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">
                Create an account
            </h1>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                </div>

                <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                </div>

                <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                </div>

                {/* <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                </div> */}

                <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                >
                {loading ? "Creating account..." : "Sign up"}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <a href="/login" className="text-primary-600 hover:underline text-white">
                    Sign in
                </a>
                </p>
            </form>
            </div>
        </div>
    </section>

  );
  
};

export default SignupPage;
