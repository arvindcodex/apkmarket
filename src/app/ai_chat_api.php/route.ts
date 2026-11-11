import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;
    const msg = (message || "").toLowerCase();

    let reply = "";

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      reply = "👋 Welcome to **ApkMarket AI Assistant**! How can I assist you today? You can ask about our **Complete App Setup**, **Telegram Hack Bots**, **Pricing**, or **Custom APKs**.";
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("rate")) {
      reply = "💰 **ApkMarket Pricing Overview**:\n\n- **Complete App Setup:** Starting at ₹300.00\n- **Universal Key:** Instant activation\n- **Telegram Prediction Bot:** ₹1,500.00 (Ready to deploy)\n- **Fake Site Setup:** ₹800.00\n\nClick on any featured card to view full details and editions.";
    } else if (msg.includes("bot") || msg.includes("telegram")) {
      reply = "🤖 **Telegram Hack & Prediction Bot**:\n\n- Real-time prediction algorithm\n- Automatic game sync & channel broadcasting\n- 24/7 uptime server deployment\n- Full admin control panel included\n\nCheck the **Telegram Hack Bot Deployment** section on the homepage to order!";
    } else if (msg.includes("complete setup") || msg.includes("apex")) {
      reply = "🚀 **APEX PANEL - Complete Setup**:\n\n- Supports 19+ popular platforms (Raxi-Win, Veer-Game, 6 Club, DmWin, Tiranga, etc.)\n- Color Editions: Green, Orange, Purple, Blue, Red, Pink, Black\n- Fast installation within minutes!";
    } else if (msg.includes("order") || msg.includes("buy") || msg.includes("purchase")) {
      reply = "🛒 **How to Order**:\n1. Browse through the **Featured Layouts** or **Popular Platforms**.\n2. Click on the card to open the preview and color edition selector.\n3. Tap **Order Now** or fill out the Universal Custom Setup form with your app name and package ID.";
    } else {
      reply = `Thanks for reaching out! Regarding "${message}", our team provides 24/7 dedicated support for APK source codes, bot deployments, and customized game platforms. Feel free to explore the featured cards or use the Universal Setup option above!`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
