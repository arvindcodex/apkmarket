import fs from "fs";
import path from "path";
import Script from "next/script";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "public", "processed_body.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return (
    <>
      <div
        id="apkmarket-app-root"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <Script src="/script0.js" strategy="afterInteractive" />
      <Script src="/script1.js" strategy="afterInteractive" />
    </>
  );
}
