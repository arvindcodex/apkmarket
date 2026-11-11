"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const TEMPLATES_PRESETS = [
  {
    id: "TRANSFORMER V1",
    name: "TRANSFORMER V1",
    desc: "Cyber Gold Laser HUD • All Game Working",
    tag: "Trending",
    icon: "/assets/images/856705_6aec037222b81_logo.jpg",
    color: "#00ff66",
  },
  {
    id: "APEX WINGS MOD",
    name: "APEX WINGS MOD",
    desc: "Cyber Rose Pink Wings • Floating Target HUD",
    tag: "Popular",
    icon: "/assets/images/035f56_6aed94c205584_logo.jpg",
    color: "#ff1a8c",
  },
  {
    id: "APEX PANEL",
    name: "APEX PANEL",
    desc: "Ice Blue Signal HUD • 4 Color Editions",
    tag: "Multi-Color",
    icon: "/assets/images/a6f2c6_6aed9468300e2_logo.jpg",
    color: "#00f0ff",
  },
  {
    id: "GLAXY VISION",
    name: "GLAXY VISION",
    desc: "Matrix Hologram Radar HUD • Complete Setup",
    tag: "VIP",
    icon: "/assets/images/f10700_6aec02dba2d7a_logo.jpg",
    color: "#a855f7",
  },
];

const PLATFORM_PRESETS = [
  { name: "Raxi-Win", img: "/assets/images/6cf19d_h5setting_20260505202958ehbj.png" },
  { name: "Veer-Game", img: "/assets/images/8077d1_h5setting_20260829151532fqt9.png" },
  { name: "6 Club", img: "/assets/images/4840cb_h5setting_20251117111952gfbg.png" },
  { name: "DmWin", img: "/assets/images/8a4ad5_h5setting_20240917171851as5n.png" },
  { name: "Maan Win", img: "/assets/images/cfacce_q1876w.png" },
  { name: "Tiranga", img: "/assets/images/11574f_h5setting_20231018190159b8rt.png" },
  { name: "Big Mumbai", img: "/assets/images/4cc39a_h5setting_202308141709544lm1.png" },
  { name: "BDG Win", img: "/assets/images/66ccbe_h5setting_20240313181416lh4e.png" },
];

const COLOR_EDITIONS = [
  { name: "Cyber Green", hex: "#10b981" },
  { name: "Neon Purple", hex: "#a855f7" },
  { name: "Vibrant Cyan", hex: "#06b6d4" },
  { name: "Sunset Orange", hex: "#f97316" },
  { name: "Electric Pink", hex: "#ec4899" },
  { name: "Dark Stealth", hex: "#334155" },
];

function OrderContent() {
  const params = useSearchParams();
  const router = useRouter();

  const queryDesignId = params.get("design_id") || "APEX WINGS MOD";
  const queryTitle = params.get("title") || queryDesignId;
  const queryPrice = params.get("price") || "300.00";
  const queryWebsiteUrl = params.get("website_url") || "";
  const queryAppName = params.get("app_name") || "";
  const queryAppLogo = params.get("app_logo") || "";

  // State with smart defaults so it NEVER blocks build
  const [websiteUrl, setWebsiteUrl] = useState(queryWebsiteUrl || "https://raxi-win.com");
  const [appName, setAppName] = useState(queryAppName || queryTitle.replace("MOD", "").trim() || "ApkMarket VIP");
  const [appLogo, setAppLogo] = useState(queryAppLogo || "/assets/images/856705_6aec037222b81_logo.jpg");
  const [selectedPlatform, setSelectedPlatform] = useState("Raxi-Win");
  const [selectedColor, setSelectedColor] = useState("Cyber Green");
  const [telegramContact, setTelegramContact] = useState("@guest_user");
  const [transactionId, setTransactionId] = useState("");
  const [packageName, setPackageName] = useState("com.apkmarket.app");

  // Build simulator state
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [buildDone, setBuildDone] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const fileName = `${(appName || "custom_apk").toLowerCase().replace(/[^a-z0-9]/g, "_")}_v1.0.apk`;

    // Trigger direct file download
    const link = document.createElement("a");
    link.href = "/assets/downloads/base.apk";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const slug = (appName || "app").toLowerCase().replace(/[^a-z0-9]/g, "");
    setPackageName(`com.${slug || "apkmarket"}.app`);
  }, [appName]);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("apkmarket_user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.telegram_id) {
          setTelegramContact(u.telegram_id);
        }
      }
    } catch (e) {}
  }, []);

  const handleStartBuild = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let finalUrl = websiteUrl.trim();
    if (!finalUrl) {
      finalUrl = "https://raxi-win.com";
      setWebsiteUrl(finalUrl);
    } else if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
      setWebsiteUrl(finalUrl);
    }

    setBuildDone(false);
    setIsBuilding(true);
    setBuildStep(1);

    try {
      const compilePromise = fetch("/api/build_apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: finalUrl,
          appName: appName || queryTitle,
          designId: queryDesignId,
          platform: selectedPlatform,
          packageName: packageName || `com.${(appName || "app").toLowerCase().replace(/[^a-z0-9]/g, "")}.app`,
        }),
      });

      setTimeout(() => setBuildStep(2), 700);
      setTimeout(() => setBuildStep(3), 1500);

      await compilePromise;

      setBuildStep(4);
      setBuildDone(true);
    } catch (err) {
      setBuildStep(4);
      setBuildDone(true);
    }
  };

  return (
    <div className="order-page-wrapper">
      <div className="ambient-glow"></div>

      {/* Build Progress Modal */}
      {isBuilding && (
        <div className="build-modal-overlay">
          <div className="build-modal-card">
            {!buildDone ? (
              <>
                <div className="build-spinner-wrap">
                  <i className="fa-solid fa-gear fa-spin build-gear-icon"></i>
                </div>
                <h3 className="build-heading">Compiling Your Custom APK</h3>
                <p className="build-subheading">Target: {websiteUrl}</p>

                <div className="build-steps-list">
                  <div className={`step-item ${buildStep >= 1 ? "active" : ""}`}>
                    <i className={`fa-solid ${buildStep > 1 ? "fa-circle-check text-success" : "fa-circle-dot"}`}></i>
                    <span>Verifying target website &amp; SSL protocol...</span>
                  </div>
                  <div className={`step-item ${buildStep >= 2 ? "active" : ""}`}>
                    <i className={`fa-solid ${buildStep > 2 ? "fa-circle-check text-success" : "fa-circle-dot"}`}></i>
                    <span>Injecting APK assets, app icon &amp; theme [{selectedColor}]...</span>
                  </div>
                  <div className={`step-item ${buildStep >= 3 ? "active" : ""}`}>
                    <i className={`fa-solid ${buildStep > 3 ? "fa-circle-check text-success" : "fa-circle-dot"}`}></i>
                    <span>Compiling Android package [{packageName}]...</span>
                  </div>
                  <div className={`step-item ${buildStep >= 4 ? "active" : ""}`}>
                    <i className="fa-solid fa-circle-check text-success"></i>
                    <span>Signing APK with Release Keystore...</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="success-icon-wrap">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 className="build-heading" style={{ color: "#10b981" }}>APK Build Successful!</h3>
                <p className="build-subheading">
                  Your customized package <strong>{appName}</strong> has been configured with target URL: <strong>{websiteUrl}</strong>.
                </p>

                <div className="build-summary-box">
                  <div className="summary-row">
                    <span>Package ID:</span>
                    <code>{packageName}</code>
                  </div>
                  <div className="summary-row">
                    <span>Platform:</span>
                    <span>{selectedPlatform}</span>
                  </div>
                  <div className="summary-row">
                    <span>Amount:</span>
                    <strong style={{ color: "#34d399" }}>₹{queryPrice}</strong>
                  </div>
                </div>

                {downloadStarted && (
                  <div style={{
                    marginTop: "14px",
                    padding: "10px 14px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: "10px",
                    color: "#34d399",
                    fontSize: "0.82rem",
                    textAlign: "center"
                  }}>
                    <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }}></i>
                    APK File <strong>{`${(appName || "app").toLowerCase().replace(/[^a-z0-9]/g, "_")}_v1.0.apk`}</strong> download started!
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: "13px",
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontWeight: "700",
                      color: "#fff",
                      borderRadius: "10px"
                    }}
                    onClick={handleDownloadApk}
                  >
                    <i className={`fa-solid ${downloadStarted ? "fa-circle-check" : "fa-download"}`}></i>
                    <span>{downloadStarted ? "Re-Download APK" : "Download APK File"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{
                      padding: "13px 18px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#cbd5e1",
                      borderRadius: "10px",
                      fontWeight: "600"
                    }}
                    onClick={() => router.push("/")}
                  >
                    Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="order-nav">
        <button type="button" onClick={() => router.back()} className="back-btn">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <div className="order-nav-title">
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "#8b5cf6" }}></i>
          <span>APK Builder &amp; Checkout</span>
        </div>
        <Link href="/" className="home-icon-btn">
          <i className="fa-solid fa-house"></i>
        </Link>
      </div>

      <div className="order-container">
        {/* Selected Template Badge Banner */}
        <div className="template-banner">
          <div className="tmpl-banner-left">
            <img src={appLogo || "/assets/img/icon.png"} alt="App Logo" className="tmpl-banner-thumb" />
            <div>
              <div className="tmpl-banner-badge">{queryDesignId}</div>
              <h1 className="tmpl-banner-title">{queryTitle}</h1>
              <div className="tmpl-banner-meta">
                <span className="price-tag">₹{queryPrice}</span>
                <span className="pill-tag">Universal APK Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* NON-BLOCKING DIV INSTEAD OF NATIVE FORM TO PREVENT SCROLL JUMP */}
        <div className="order-form-container">
          {/* SECTION 1: TARGET WEBSITE LINK */}
          <div className="card-section">
            <div className="section-header">
              <i className="fa-solid fa-globe section-icon"></i>
              <div>
                <h2 className="section-title">1. Website Link / Target Game URL</h2>
                <p className="section-desc">Enter the website or prediction game link to wrap inside the APK</p>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <i className="fa-solid fa-link input-prefix-icon"></i>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="e.g. https://yourgame.com or yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <div className="quick-suggestions">
                <span className="suggestion-label">Quick test links:</span>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setWebsiteUrl("https://raxi-win.com")}
                >
                  Raxi-Win
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setWebsiteUrl("https://6club.com")}
                >
                  6 Club
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setWebsiteUrl("https://dmwin.com")}
                >
                  DmWin
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: APP IDENTITY */}
          <div className="card-section">
            <div className="section-header">
              <i className="fa-solid fa-mobile-screen-button section-icon"></i>
              <div>
                <h2 className="section-title">2. App Name &amp; Logo Setup</h2>
                <p className="section-desc">Configure APK title, app logo icon, and package identifier</p>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="field-label">App Title (Display Name)</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="e.g. Royal Win VIP"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label">Package Name (Auto-Generated)</label>
                <input
                  type="text"
                  className="cyber-input"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  style={{ color: "#94a3b8", fontFamily: "monospace" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="field-label">App Logo Image URL (PNG / JPG / WEBP)</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <i className="fa-solid fa-image input-prefix-icon"></i>
                  <input
                    type="text"
                    className="cyber-input"
                    placeholder="https://example.com/logo.png"
                    value={appLogo}
                    onChange={(e) => setAppLogo(e.target.value)}
                  />
                </div>
                <div className="logo-preview-box">
                  <img src={appLogo || "/assets/img/icon.png"} alt="Preview" onError={(e) => { (e.target as any).src = "/assets/img/icon.png"; }} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PLATFORM & COLOR EDITION */}
          <div className="card-section">
            <div className="section-header">
              <i className="fa-solid fa-palette section-icon"></i>
              <div>
                <h2 className="section-title">3. Platform Server &amp; Theme Color</h2>
                <p className="section-desc">Select platform compatibility and appearance styling</p>
              </div>
            </div>

            <label className="field-label" style={{ marginBottom: 8, display: "block" }}>Select Game Platform</label>
            <div className="platforms-grid">
              {PLATFORM_PRESETS.map((p) => (
                <div
                  key={p.name}
                  className={`platform-card ${selectedPlatform === p.name ? "selected" : ""}`}
                  onClick={() => setSelectedPlatform(p.name)}
                >
                  <img src={p.img} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>

            <label className="field-label" style={{ marginTop: 16, marginBottom: 8, display: "block" }}>Color Edition</label>
            <div className="color-strip">
              {COLOR_EDITIONS.map((c) => (
                <div
                  key={c.name}
                  className={`color-pill ${selectedColor === c.name ? "selected" : ""}`}
                  onClick={() => setSelectedColor(c.name)}
                >
                  <span className="dot" style={{ background: c.hex }}></span>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: CONTACT & PAYMENT */}
          <div className="card-section">
            <div className="section-header">
              <i className="fa-solid fa-shield-halved section-icon"></i>
              <div>
                <h2 className="section-title">4. Delivery &amp; Confirmation</h2>
                <p className="section-desc">Enter your Telegram ID to receive your completed APK build</p>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="field-label">Telegram / WhatsApp Contact</label>
                <div className="input-wrapper">
                  <i className="fa-brands fa-telegram input-prefix-icon"></i>
                  <input
                    type="text"
                    className="cyber-input"
                    placeholder="@username or mobile number"
                    value={telegramContact}
                    onChange={(e) => setTelegramContact(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Transaction ID / Reference (Optional)</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-receipt input-prefix-icon"></i>
                  <input
                    type="text"
                    className="cyber-input"
                    placeholder="UPI / UTR reference number"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="price-checkout-bar">
              <div>
                <span className="total-label">Total Amount:</span>
                <div className="total-value">₹{queryPrice}</div>
              </div>
              <button
                type="button"
                className="build-submit-btn"
                onClick={handleStartBuild}
                id="mainBuildConfirmBtn"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>Build APK &amp; Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .order-page-wrapper {
          min-height: 100vh;
          background-color: #07090e;
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-bottom: 50px;
          position: relative;
        }

        .ambient-glow {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 350px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
        }

        .order-nav {
          max-width: 520px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(7, 9, 14, 0.85);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          padding: 7px 12px;
          border-radius: 9px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .order-nav-title {
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.2s;
        }
        .home-icon-btn:hover {
          color: #fff;
          background: rgba(99, 102, 241, 0.25);
        }

        .order-container {
          max-width: 520px;
          margin: 0 auto;
          padding: 18px;
          position: relative;
          z-index: 1;
        }

        .template-banner {
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
          border: 1px solid rgba(99, 102, 241, 0.35);
          border-radius: 18px;
          padding: 16px;
          margin-bottom: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.15);
        }

        .tmpl-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .tmpl-banner-thumb {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          object-fit: cover;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .tmpl-banner-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tmpl-banner-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 2px 0 6px 0;
        }

        .tmpl-banner-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .price-tag {
          font-size: 1.1rem;
          font-weight: 800;
          color: #10b981;
        }

        .pill-tag {
          font-size: 0.72rem;
          font-weight: 700;
          background: rgba(168, 85, 247, 0.2);
          color: #c084fc;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .card-section {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px 16px;
          margin-bottom: 16px;
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .section-icon {
          font-size: 1.1rem;
          color: #818cf8;
          margin-top: 2px;
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .section-desc {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 6px;
          display: block;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          font-size: 0.9rem;
          pointer-events: none;
        }

        .cyber-input {
          width: 100%;
          height: 46px;
          background: rgba(10, 14, 26, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          padding: 0 14px 0 40px;
          color: #fff;
          font-size: 0.88rem;
          outline: none;
          transition: all 0.2s;
        }
        .cyber-input:focus {
          border-color: rgba(99, 102, 241, 0.65);
          background: rgba(10, 14, 26, 0.95);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .quick-suggestions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .suggestion-label {
          font-size: 0.72rem;
          color: #64748b;
        }

        .chip-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .chip-btn:hover {
          color: #fff;
          border-color: #818cf8;
          background: rgba(99, 102, 241, 0.15);
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .logo-preview-box {
          width: 46px;
          height: 46px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #0f172a;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-preview-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .platform-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .platform-card img {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          object-fit: contain;
        }
        .platform-card span {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
          text-align: center;
        }
        .platform-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(99, 102, 241, 0.08);
        }
        .platform-card.selected {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.2);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
        }
        .platform-card.selected span {
          color: #fff;
        }

        .color-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.75rem;
          color: #94a3b8;
          transition: all 0.2s;
        }
        .color-pill .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .color-pill.selected {
          border-color: #fff;
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }

        .price-checkout-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          margin-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .total-label {
          font-size: 0.75rem;
          color: #94a3b8;
          display: block;
        }

        .total-value {
          font-size: 1.45rem;
          font-weight: 800;
          color: #10b981;
        }

        .build-submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          border: none;
          color: #fff;
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
          transition: all 0.2s;
        }
        .build-submit-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        /* Build Modal Overlay */
        .build-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(14px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .build-modal-card {
          width: 100%;
          max-width: 440px;
          background: #0f172a;
          border: 1px solid rgba(99, 102, 241, 0.4);
          border-radius: 20px;
          padding: 26px 20px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25);
        }

        .build-spinner-wrap {
          margin-bottom: 14px;
        }

        .build-gear-icon {
          font-size: 2.8rem;
          color: #8b5cf6;
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
        }

        .success-icon-wrap {
          font-size: 3rem;
          color: #10b981;
          margin-bottom: 12px;
        }

        .build-heading {
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .build-subheading {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 6px;
        }

        .build-steps-list {
          text-align: left;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 12px 14px;
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #64748b;
        }
        .step-item.active {
          color: #e2e8f0;
          font-weight: 600;
        }
        .text-success {
          color: #10b981;
        }

        .build-summary-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          margin-top: 16px;
          text-align: left;
          font-size: 0.82rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          color: #94a3b8;
        }
        .summary-row code {
          color: #38bdf8;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          border-radius: 10px;
          font-weight: 700;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#07090e" }}></div>}>
      <OrderContent />
    </Suspense>
  );
}
