"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user = {
      identifier: identifier || "@demouser",
      telegram_id: identifier.startsWith("@") ? identifier : `@${identifier}`,
      name: identifier.replace("@", "") || "Demo User",
      loggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("apkmarket_user", JSON.stringify(user));
    setToastMsg("Login Successful! Redirecting...");

    setTimeout(() => {
      router.push(redirectUrl);
    }, 600);
  };

  const handleSkipLogin = () => {
    setIsLoading(true);
    const guestUser = {
      identifier: "@guest_user",
      telegram_id: "@guest_user",
      name: "Guest Explorer",
      isGuest: true,
      loggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("apkmarket_user", JSON.stringify(guestUser));
    setToastMsg("⚡ Skipped login! Direct access granted.");

    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  return (
    <div className="login-page-root">
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {toastMsg && (
        <div className="login-toast">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="auth-container">
        {/* Top Brand Bar */}
        <Link href="/" className="auth-brand">
          <div className="brand-logo-wrap">
            <i className="fa-brands fa-app-store-ios"></i>
          </div>
          <div className="brand-title">ApkMarket</div>
          <div className="brand-subtitle">Sign in to your account</div>
        </Link>

        {/* Glass Auth Card */}
        <div className="auth-card">
          <div className="auth-nav-tabs">
            <Link href="/login.php" className="auth-nav-tab active">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In</span>
            </Link>
            <Link href="/register.php" className="auth-nav-tab">
              <i className="fa-solid fa-user-plus"></i>
              <span>Register</span>
            </Link>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <div className="form-label">
                <span>Telegram ID or Email</span>
                <span className="form-label-hint">e.g. @username</span>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name="identifier"
                  className="form-input"
                  placeholder="Enter username or email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
                <i className="fa-solid fa-user input-icon-left"></i>
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Password</span>
              </div>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <i className="fa-solid fa-lock input-icon-left"></i>
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} input-toggle-right`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          {/* OR DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* SKIP LOGIN BUTTON */}
          <button
            type="button"
            className="btn-skip-login"
            onClick={handleSkipLogin}
            disabled={isLoading}
            id="skipLoginBtn"
          >
            <i className="fa-solid fa-bolt" style={{ color: "#10b981" }}></i>
            <span>Skip Login (Direct Demo Access)</span>
          </button>

          <div className="auth-footer-text">
            Don&apos;t have an account? <Link href="/register.php">Create one free</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="auth-bottom-bar">
          <Link href="/" className="back-store-link">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Store</span>
          </Link>
          <div className="ssl-badge">
            <i className="fa-solid fa-shield-halved"></i>
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .login-page-root {
          background-color: #07090e;
          color: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 18px;
          position: relative;
          overflow-x: hidden;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .ambient-glow-1 {
          position: fixed;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 480px;
          height: 380px;
          background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(50px);
        }

        .ambient-glow-2 {
          position: fixed;
          bottom: -80px;
          right: 0;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
        }

        .login-toast {
          position: fixed;
          top: 24px;
          z-index: 100;
          background: rgba(16, 185, 129, 0.9);
          backdrop-filter: blur(12px);
          color: #fff;
          padding: 12px 24px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .auth-container {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          margin: auto;
        }

        .auth-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          margin-bottom: 22px;
        }

        .brand-logo-wrap {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -4px rgba(99, 102, 241, 0.45);
          margin-bottom: 12px;
          position: relative;
        }
        .brand-logo-wrap i {
          font-size: 1.65rem;
          color: #ffffff;
        }

        .brand-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.4px;
          line-height: 1.2;
        }
        .brand-subtitle {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 3px;
        }

        .auth-card {
          background: rgba(18, 24, 38, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px 22px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .auth-nav-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: rgba(10, 14, 24, 0.6);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 22px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .auth-nav-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 9px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .auth-nav-tab.active {
          background: rgba(99, 102, 241, 0.2);
          color: #ffffff;
          border: 1px solid rgba(99, 102, 241, 0.4);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 7px;
        }

        .form-label-hint {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 500;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          height: 48px;
          background: rgba(10, 14, 26, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          padding: 0 44px 0 42px;
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(10, 14, 26, 0.95);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .input-icon-left {
          position: absolute;
          left: 15px;
          color: #64748b;
          font-size: 0.95rem;
          pointer-events: none;
        }

        .input-toggle-right {
          position: absolute;
          right: 15px;
          color: #64748b;
          font-size: 0.95rem;
          padding: 6px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .input-toggle-right:hover {
          color: #cbd5e1;
        }

        .btn-submit {
          width: 100%;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.45);
          transition: all 0.2s ease;
          margin-top: 20px;
        }
        .btn-submit:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 12px 28px -4px rgba(99, 102, 241, 0.55);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 18px 0 14px 0;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }
        .auth-divider span {
          padding: 0 12px;
        }

        /* SKIP LOGIN SPECIAL BUTTON */
        .btn-skip-login {
          width: 100%;
          height: 48px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
          border: 1px solid rgba(52, 211, 153, 0.4);
          border-radius: 12px;
          color: #34d399;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-skip-login:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%);
          color: #ffffff;
          border-color: rgba(52, 211, 153, 0.7);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
          transform: translateY(-1.5px);
        }
        .btn-skip-login:active {
          transform: scale(0.98);
        }

        .auth-footer-text {
          text-align: center;
          margin-top: 18px;
          font-size: 0.84rem;
          color: #94a3b8;
        }
        .auth-footer-text a {
          color: #818cf8;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-footer-text a:hover {
          color: #a5b4fc;
          text-decoration: underline;
        }

        .auth-bottom-bar {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
        }

        .back-store-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .back-store-link:hover {
          color: #ffffff;
          transform: translateX(-2px);
        }

        .ssl-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 600;
        }
        .ssl-badge i {
          color: #10b981;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#07090e" }}></div>}>
      <LoginContent />
    </Suspense>
  );
}
