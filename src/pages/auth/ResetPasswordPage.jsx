import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel overflow-hidden">
        <div className="bg-gradient-to-r from-[#b8322f] via-[#d17353] to-[#f2c35f] px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="mt-1 text-sm text-[#fff4e8]">Create a new password for your account.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-6">
          <div className="relative">
            <input className="field pr-20" type={showPassword ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#fff2e8] px-2 py-1 text-xs font-semibold text-[#b8322f]">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input className="field" type={showPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button className="btn-primary w-full">Reset Password</button>
          <p className="text-center text-sm text-slate-600">
            Back to{" "}
            <Link to="/login" className="font-semibold text-[#b8322f] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
