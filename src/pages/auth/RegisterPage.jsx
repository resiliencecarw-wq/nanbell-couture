import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel overflow-hidden">
        <div className="bg-gradient-to-r from-[#0f8b6e] via-[#d17353] to-[#f2c35f] px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-[#e9fff8]">Join and start tracking your orders.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-6">
          <input name="fullName" className="field" placeholder="Full name" value={form.fullName} onChange={onChange} />
          <input name="phone" className="field" placeholder="Phone" value={form.phone} onChange={onChange} />
          <input name="email" className="field" placeholder="Email" value={form.email} onChange={onChange} />
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} className="field pr-20" placeholder="Password" value={form.password} onChange={onChange} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#fff2e8] px-2 py-1 text-xs font-semibold text-[#b8322f]">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button className="btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
