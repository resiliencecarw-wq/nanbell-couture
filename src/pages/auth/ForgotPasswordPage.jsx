import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message || "If the account exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel overflow-hidden">
        <div className="bg-gradient-to-r from-[#0f8b6e] via-[#d17353] to-[#f2c35f] px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-1 text-sm text-[#e9fff8]">Enter your account email to receive a reset link.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-6">
          <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button disabled={submitting} className={`btn-primary w-full ${submitting ? "cursor-not-allowed opacity-80" : ""}`}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
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

export default ForgotPasswordPage;
