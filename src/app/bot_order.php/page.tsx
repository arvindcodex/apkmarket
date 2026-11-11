"use client";

import { useRouter } from "next/navigation";

export default function BotOrderPage() {
  const router = useRouter();

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: "30px 20px",
      minHeight: "100vh",
      background: "#07090e",
      color: "#fff",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(236, 72, 153, 0.3)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Deploy Telegram Bot</h2>
        </div>

        <div style={{
          padding: 16,
          background: "rgba(0,0,0,0.3)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 20
        }}>
          <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Package</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: "#ec4899" }}>Telegram Prediction & Hack Bot</div>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8, lineHeight: 1.4 }}>
            Full turnkey deployment with automatic signal generator, channel broadcaster, and admin panel.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ color: "#94a3b8" }}>Server Setup & Config:</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>₹1,500.00</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Telegram Bot Token (from @BotFather)</label>
            <input
              type="text"
              placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Target Channel / Group ID</label>
            <input
              type="text"
              placeholder="@your_channel_name or -100xxxxxxxxx"
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                outline: "none"
              }}
            />
          </div>

          <button
            onClick={() => alert("Deployment request received! Your bot will be configured and deployed within 1-2 hours.")}
            style={{
              marginTop: 10,
              padding: "14px",
              background: "linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #8b5cf6 100%)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)"
            }}
          >
            Deploy My Bot Now
          </button>
        </div>
      </div>
    </div>
  );
}
