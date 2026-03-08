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
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(emailOrPhone, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="panel overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#b8322f] via-[#d17353] to-[#f2c35f] px-8 py-8 text-white">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-amber-100">Sign in to continue to your account</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-5 p-8">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {error}
                </span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email or Phone</label>
              <input 
                className="field" 
                placeholder="Enter your email or phone number" 
                value={emailOrPhone} 
                onChange={(e) => setEmailOrPhone(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input 
                  className="field pr-20" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword((v) => !v)} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-[#b8322f] transition-colors hover:bg-amber-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            
            <button 
              disabled={submitting} 
              className={`btn-primary w-full py-3 text-base ${submitting ? "cursor-not-allowed opacity-80" : ""}`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing you in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            
            <div className="space-y-3 pt-2 text-center text-sm text-slate-600">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-[#b8322f] hover:underline">
                  Create one
                </Link>
              </p>
              <p>
                Forgot your password?{" "}
                <Link to="/forgot-password" className="font-semibold text-emerald-600 hover:underline">
                  Reset it
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

