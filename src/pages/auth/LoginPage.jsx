import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(emailOrPhone, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel overflow-hidden">
        <div className="bg-gradient-to-r from-[#b8322f] via-[#d17353] to-[#f2c35f] px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-sm text-[#fff4e8]">Sign in to continue.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-6">
          <input className="field" placeholder="Email or phone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} />
          <div className="relative">
            <input className="field pr-20" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#fff2e8] px-2 py-1 text-xs font-semibold text-[#b8322f]">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button className="btn-primary w-full">Sign In</button>
          <div className="space-y-1 text-center text-sm text-slate-600">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[#b8322f] hover:underline">
                Sign up here
              </Link>
            </p>
            <p>
              Forgot your password?{" "}
              <Link to="/forgot-password" className="font-semibold text-[#0f8b6e] hover:underline">
                Reset it
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
