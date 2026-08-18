import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, Lock } from "../../lib/icons";
import authSideImage from "../../../assets/auth-side-image.webp";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [clientId, setClientId] = useState("NET8443220");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 flex flex-col justify-between font-sans selection:bg-[#e32168] selection:text-white">
      {/* Header */}
      <header className="w-full px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step === 1 ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center justify-center font-bold text-2xl text-[#e32168] tracking-tighter">
                <span>&lt;~&gt;</span>
              </div>
              <span className="font-semibold text-xl tracking-tight text-gray-900">HealthCompiler</span>
            </div>
          ) : (
            <div className="flex flex-col cursor-pointer" onClick={() => setStep(1)}>
              <span className="font-extrabold text-lg text-[#e32168] italic tracking-wide leading-tight uppercase">
                ACME DPC
              </span>
              <span className="text-[11px] text-gray-500 font-medium tracking-normal">
                Your Logo Here
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-16 py-6">
        {/* Left Side: Graphic / Ecosystem Illustration */}
        <div className="lg:col-span-7 flex items-center justify-center p-2 sm:p-4 order-2 lg:order-1">
          <div className="relative w-full max-w-[620px] flex items-center justify-center">
            <img
              src={authSideImage}
              alt="HealthCompiler Ecosystem Dashboard"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  target.src = "/auth-side-image.webp";
                }
              }}
              className="w-full h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 w-full max-w-[420px] mx-auto">
          <div className="w-full bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-200/80 p-7 sm:p-9 transition-all duration-300">
            {step === 1 ? (
              /* Step 1: Client ID Entry */
              <form onSubmit={handleNextStep} className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
                  Login
                </h1>

                {/* Floating/Notched Border Label Input */}
                <div className="relative mb-6">
                  <div className="relative border border-gray-300 rounded-lg focus-within:border-[#e32168] focus-within:ring-1 focus-within:ring-[#e32168] transition-all bg-white px-3 pt-2.5 pb-2">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 tracking-wide select-none">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="Enter Client ID"
                      required
                      className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none p-0 focus:ring-0 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading || !clientId.trim()}
                  className="w-full bg-[#e32168] hover:bg-[#c91859] active:bg-[#b0134c] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                {/* Helper text below submit button */}
                <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                  <p>Do not have a client Id?</p>
                  <p>
                    Contact at{" "}
                    <a
                      href="mailto:support@healthcompiler.com"
                      className="text-[#0070f3] hover:underline font-medium"
                    >
                      support@healthcompiler.com
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              /* Step 2: Username & Password Entry */
              <form onSubmit={handleLogin} className="flex flex-col animate-in fade-in slide-in-from-right-3 duration-200">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="self-start text-gray-500 hover:text-gray-900 mb-3 -ml-1 p-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Back to Client ID"
                >
                  <ArrowLeft className="size-5" />
                </button>

                <h1 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
                  Login
                </h1>
                
                <p className="text-xs font-medium text-gray-600 mb-6">
                  Client ID: <span className="text-[#e32168] font-semibold">{clientId}</span>
                </p>

                {/* Username Field */}
                <div className="relative mb-4">
                  <div className="relative border border-gray-300 rounded-lg focus-within:border-[#e32168] focus-within:ring-1 focus-within:ring-[#e32168] transition-all bg-white px-3 pt-2.5 pb-2">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 tracking-wide select-none">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Username"
                      required
                      autoFocus
                      className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none p-0 focus:ring-0 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative mb-2">
                  <div className="relative border border-gray-300 rounded-lg focus-within:border-[#e32168] focus-within:ring-1 focus-within:ring-[#e32168] transition-all bg-white px-3 pt-2.5 pb-2 flex items-center justify-between">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 tracking-wide select-none">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                      className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none p-0 focus:ring-0 placeholder:text-gray-400 pr-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mb-6">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact your administrator to reset your password.");
                    }}
                    className="text-xs font-medium text-[#0070f3] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#e32168] hover:bg-[#c91859] active:bg-[#b0134c] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Not a customer link (Visible below card on step 1) */}
          {step === 1 && (
            <div className="mt-5 text-xs text-gray-600 text-center">
              Not a customer?{" "}
              <a
                href="https://healthcompiler.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0070f3] hover:underline font-medium"
              >
                Book a Meeting
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200/80 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 relative">
        {/* Left Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-full font-semibold text-[10px] text-gray-700 tracking-wider uppercase shadow-2xs">
            <ShieldCheck className="size-3.5 text-teal-600" />
            <span>AICPA SOC 2</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-full font-semibold text-[10px] text-gray-700 tracking-wider uppercase shadow-2xs">
            <Lock className="size-3.5 text-gray-700" />
            <span>HIPAA Compliant</span>
          </div>
        </div>

        {/* Center Copyright & Links */}
        <div className="flex items-center flex-wrap gap-4 text-center">
          <span>©{new Date().getFullYear()} Healthcompiler, Inc.</span>
          <a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#help" className="hover:text-gray-900 transition-colors">Help</a>
        </div>

        {/* Right Powered By */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-medium text-gray-700">
            <span className="font-bold text-[#e32168]">&lt;~&gt;</span>
            <span>Powered by <span className="font-semibold text-gray-900">HealthCompiler</span></span>
          </div>
        </div>

        {/* Floating switcher / layout toggle button (bottom right corner) */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setStep(step === 1 ? 2 : 1)}
            title="Toggle Step Preview"
            className="size-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#e32168] hover:border-[#e32168] transition-all cursor-pointer text-xs font-bold"
          >
            &lt;-&gt;
          </button>
        </div>
      </footer>
    </div>
  );
}
