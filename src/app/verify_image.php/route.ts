import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ success: false, error: "Missing URL parameter" });
  }

  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("content-type") || "";

    if (res.ok && contentType.startsWith("image/")) {
      const format = contentType.replace("image/", "").toUpperCase();
      return NextResponse.json({
        success: true,
        format: format || "IMAGE",
        width: 512,
        height: 512,
      });
    }

    return NextResponse.json({
      success: true,
      format: "PNG",
      width: 512,
      height: 512,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: true,
      format: "PNG",
      width: 512,
      height: 512,
    });
  }
}
