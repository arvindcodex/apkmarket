import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { websiteUrl, appName, designId, packageName } = body;

    const web = websiteUrl || "https://raxi-win.com";
    const name = appName || designId || "APEX WINGS MOD";
    const design = designId || "APEX WINGS MOD";
    const pkg = packageName || `com.${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "apkmarket"}.app`;

    const scriptPath = path.join(process.cwd(), "apk_compiler.py");
    const outputPath = path.join(process.cwd(), "public", "assets", "downloads", "base.apk");

    const cmd = `python3 "${scriptPath}" "${web}" "${name}" "${design}" "${outputPath}" "${pkg}"`;
    await execPromise(cmd);

    return NextResponse.json({
      success: true,
      downloadUrl: "/assets/downloads/base.apk",
      appName: name,
      websiteUrl: web,
      packageName: pkg,
    });
  } catch (err: any) {
    console.error("APK compilation error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Compilation failed",
    }, { status: 500 });
  }
}
