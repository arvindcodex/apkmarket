import os
import sys
import json
import shutil
import base64
import glob
import re
import subprocess

def sanitize_package_name(pkg_str, app_name):
    clean = re.sub(r'[^a-zA-Z0-9_\.]', '', pkg_str or "").strip('.').lower()
    parts = [p for p in clean.split('.') if p]
    if len(parts) < 2:
        name_slug = re.sub(r'[^a-zA-Z0-9_]', '', (app_name or "mod").lower()) or "vip"
        parts = ["com", name_slug, "app"]
    # Ensure segments start with a letter
    valid_parts = []
    for p in parts:
        if not p[0].isalpha():
            p = "a" + p
        valid_parts.append(p)
    return ".".join(valid_parts)

def compile_custom_apk(website_url, app_name, design_id, output_path, package_name="com.apkmarket.app"):
    BUILD_DIR = "apk_build_worker"
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)

    pkg = sanitize_package_name(package_name, app_name)
    pkg_path = pkg.replace(".", "/")

    os.makedirs(f"{BUILD_DIR}/src/{pkg_path}", exist_ok=True)
    os.makedirs(f"{BUILD_DIR}/res/values", exist_ok=True)
    os.makedirs(f"{BUILD_DIR}/res/mipmap", exist_ok=True)
    os.makedirs(f"{BUILD_DIR}/assets", exist_ok=True)
    os.makedirs(f"{BUILD_DIR}/classes", exist_ok=True)

    # 1. Template selection
    d_clean = (design_id or "").upper().strip()
    if "CYBER" in d_clean or d_clean == "4" or d_clean == "46":
        template_file = "template_4_CYBER_PANEL.html"
    elif "TRANSFORMER" in d_clean or d_clean == "0":
        template_file = "template_0_TRANSFORMER_V1.html"
    elif "VISION" in d_clean or "GLAXY" in d_clean or d_clean == "1":
        template_file = "template_1_GLAXY_VISION.html"
    elif "PANEL" in d_clean or "SIGNAL" in d_clean or d_clean == "3":
        template_file = "template_3_APEX_PANEL.html"
    else:
        template_file = "template_2_APEX_WINGS_MOD.html"

    if not os.path.exists(template_file):
        template_file = "template_2_APEX_WINGS_MOD.html"

    with open(template_file, "r", encoding="utf-8") as f:
        html = f.read()

    # 2. Local Assets (Base64)
    if "CYBER" in d_clean:
        logo_path = "public/assets/images/cyber_panel_icon.png"
    elif "VISION" in d_clean or "GLAXY" in d_clean:
        logo_path = "public/assets/images/035f56_6aed94c205584_logo.jpg"
    elif "TRANSFORMER" in d_clean:
        logo_path = "public/assets/images/logo.png"
    else:
        logo_path = "public/assets/images/cyber_panel_icon.png" if "CYBER" in d_clean else "public/assets/images/logo.png"

    if not os.path.exists(logo_path):
        logo_path = "public/assets/images/logo.png"
    if not os.path.exists(logo_path):
        logo_path = "public/assets/img/icon.png"

    with open(logo_path, "rb") as f:
        logo_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

    wings_path = "public/assets/images/wings.png"
    wings_b64 = ""
    if os.path.exists(wings_path):
        with open(wings_path, "rb") as f:
            wings_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

    # Load balls (0-9)
    balls_b64 = {}
    for fn in sorted(glob.glob("public/assets/balls/ball_*.*")):
        try:
            num = int(fn.split("ball_")[1].split(".")[0])
            ext = "webp" if fn.endswith(".webp") else "png"
            with open(fn, "rb") as bf:
                balls_b64[num] = f"data:image/{ext};base64," + base64.b64encode(bf.read()).decode("utf-8")
        except Exception:
            pass

    # Load numbers (0-9)
    nums_b64 = {}
    for fn in sorted(glob.glob("public/assets/numbers/num_*.png")):
        try:
            num = int(fn.split("num_")[1].split(".")[0])
            with open(fn, "rb") as nf:
                nums_b64[num] = "data:image/png;base64," + base64.b64encode(nf.read()).decode("utf-8")
        except Exception:
            pass

    # Load audio data
    audio_data = {}
    if os.path.exists("public/assets/audio/audio_data.json"):
        with open("public/assets/audio/audio_data.json", "r") as ajf:
            audio_data = json.load(ajf)

    # 3. Parameter Normalization
    target_url = website_url.strip() if website_url else "https://raxi-win.com"
    if not target_url.startswith("http://") and not target_url.startswith("https://"):
        target_url = "https://" + target_url

    domain_with_slash = target_url if target_url.endswith("/") else target_url + "/"
    clean_app_name = app_name.strip() if app_name else design_id or "APEX VIP MOD"

    # Replace placeholders
    html = html.replace('{name}', clean_app_name)
    html = html.replace('{domain}', domain_with_slash)
    html = html.replace('{web}', target_url)
    html = html.replace('{appid}', pkg)
    html = html.replace('{deposit}', '0')
    html = html.replace('{minDeposit}', '0')
    html = html.replace('{bal}', '500')
    html = html.replace('{invitecode}', '')
    default_ball = balls_b64.get(0, logo_b64)
    html = html.replace('{ballImg}', default_ball)

    # Replace image URLs with embedded Base64
    html = html.replace('src="logo.png"', f'src="{logo_b64}"')
    html = html.replace("src='logo.png'", f'src="{logo_b64}"')
    html = html.replace('src="file:///android_asset/logo.png"', f'src="{logo_b64}"')

    if wings_b64:
        html = html.replace("https://files.catbox.moe/b2krfe.png", wings_b64)

    if balls_b64:
        js_ball_dict = "var BALL_IMAGES = {\n" + ",\n".join([f"  {k}: '{v}'" for k, v in balls_b64.items()]) + "\n};"
        html = re.sub(r'var\s+BALL_IMAGES\s*=\s*\{[^}]+\};', js_ball_dict, html)

    glaxy_num_urls = {
        0: 'https://i.ibb.co/WvTR3Jrx/num0.png',
        1: 'https://i.ibb.co/yFQwGPZv/num1.png',
        2: 'https://i.ibb.co/XZNjXwjq/num2.png',
        3: 'https://i.ibb.co/233fFQqz/num3.png',
        4: 'https://i.ibb.co/mVsBYfQR/num4.png',
        5: 'https://i.ibb.co/Dg5kjr9L/num5.png',
        6: 'https://i.ibb.co/Z1HMQSPM/num6.png',
        7: 'https://i.ibb.co/0y8yYzDH/num7.png',
        8: 'https://i.ibb.co/dsRvZmSf/num8.png',
        9: 'https://i.ibb.co/prMV31Ng/num9.png'
    }
    for n_idx, n_url in glaxy_num_urls.items():
        if n_idx in nums_b64:
            html = html.replace(n_url, nums_b64[n_idx])

    # Target website iframe
    html = html.replace('src="about:blank"', f'src="{target_url}"')
    html = html.replace('src=""', f'src="{target_url}"')

    # Unblock logic & bypass register/deposit locks safely with valid syntax
    html = html.replace('var fbDepositCondition = true;', 'var fbDepositCondition = false;')
    html = html.replace('var fbRegCondition = true;', 'var fbRegCondition = false;')
    html = html.replace('var userRegistered = false;', 'var userRegistered = true;')
    html = html.replace("var curState = 'wait';", "var curState = 'wingo';")
    html = html.replace("var curState='wait'", "var curState='wingo'")
    html = html.replace("var isOnWingoPage = false;", "var isOnWingoPage = true;")
    html = html.replace("if (!isOnWingoPage) { navTo(DEPOSIT_URL); return; }", "{ /* bypassed */ }")
    html = html.replace("if (!isOnWingoPage) {", "if (false) {")
    html = html.replace("if(!userRegistered){ _goState('wait'); return; }", "{ /* bypassed */ }")
    html = html.replace("if(!userRegistered){ lastPageState='wingo'; _goState('wait'); return; }", "{ /* bypassed */ }")
    html = html.replace("showWarnOverlay();", "hideWarnOverlay();")
    html = html.replace("function showWarnOverlay(){", "function showWarnOverlay(){ return; ")

    # Direct launch HUD without intro overlay or audio
    clean_injection = f"""
    <!-- CLEAN HUD INJECTION (NO INTRO / NO AUDIO) -->
    <style>
      html, body {{
        overflow: hidden !important;
        position: fixed !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
      }}
      #warnOverlay, .warn-overlay, .wo-box {{
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }}
    </style>

    <script>
    (function(){{
      // Audio completely disabled as requested
      window.playAudioForce = window.playAudio = function(){{}};
      window.speak = function(){{}};
      window.stopAudio = function(){{}};

      // Force registered state
      try {{ localStorage.setItem('slex_user_registered', '1'); }} catch(e){{}}
    }})();
    </script>
    """

    html = html.replace('</body>', f'{clean_injection}\n</body>')

    with open(f"{BUILD_DIR}/assets/index.html", "w", encoding="utf-8") as f:
        f.write(html)

    # Copy files into assets/
    if os.path.exists(logo_path):
        shutil.copy(logo_path, f"{BUILD_DIR}/assets/logo.png")
        shutil.copy(logo_path, f"{BUILD_DIR}/res/mipmap/ic_launcher.png")
    elif os.path.exists("public/assets/images/logo.png"):
        shutil.copy("public/assets/images/logo.png", f"{BUILD_DIR}/assets/logo.png")
        shutil.copy("public/assets/images/logo.png", f"{BUILD_DIR}/res/mipmap/ic_launcher.png")
    elif os.path.exists("public/assets/img/icon.png"):
        shutil.copy("public/assets/img/icon.png", f"{BUILD_DIR}/assets/logo.png")
        shutil.copy("public/assets/img/icon.png", f"{BUILD_DIR}/res/mipmap/ic_launcher.png")

    if os.path.exists(wings_path):
        shutil.copy(wings_path, f"{BUILD_DIR}/assets/wings.png")

    # Copy audio files to assets/
    for afile in glob.glob("public/assets/audio/*.*"):
        if afile.endswith(('.mp3', '.m4a', '.wav')):
            shutil.copy(afile, f"{BUILD_DIR}/assets/{os.path.basename(afile)}")

    # strings.xml
    safe_name = clean_app_name.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', '&quot;')
    with open(f"{BUILD_DIR}/res/values/strings.xml", "w", encoding="utf-8") as f:
        f.write(f'<?xml version="1.0" encoding="utf-8"?><resources><string name="app_name">{safe_name}</string></resources>')

    # AndroidManifest.xml
    manifest_content = f"""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{pkg}"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true"
        android:supportsRtl="true"
        android:allowBackup="true"
        android:hardwareAccelerated="true">
        <activity
            android:name="{pkg}.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
    with open(f"{BUILD_DIR}/AndroidManifest.xml", "w", encoding="utf-8") as f:
        f.write(manifest_content)

    # MainActivity.java
    main_activity_content = f"""package {pkg};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {{
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {{
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        webView.loadUrl("file:///android_asset/index.html");
    }}

    @Override
    public void onBackPressed() {{
        if (webView != null && webView.canGoBack()) {{
            webView.goBack();
        }} else {{
            super.onBackPressed();
        }}
    }}
}}
"""
    with open(f"{BUILD_DIR}/src/{pkg_path}/MainActivity.java", "w", encoding="utf-8") as f:
        f.write(main_activity_content)

    JAVA_HOME = "/Applications/Android Studio.app/Contents/jbr/Contents/Home"
    JAVAC = f"{JAVA_HOME}/bin/javac"
    KEYTOOL = f"{JAVA_HOME}/bin/keytool"
    SDK = "/Users/arvindcodex/Library/Android/sdk"
    BUILD_TOOLS = f"{SDK}/build-tools/35.0.0"
    AAPT2 = f"{BUILD_TOOLS}/aapt2"
    D8 = f"{BUILD_TOOLS}/d8"
    ZIPALIGN = f"{BUILD_TOOLS}/zipalign"
    APKSIGNER = f"{BUILD_TOOLS}/apksigner"
    ANDROID_JAR = f"{SDK}/platforms/android-35/android.jar"

    subprocess.check_call([AAPT2, "compile", "--dir", f"{BUILD_DIR}/res", "-o", f"{BUILD_DIR}/compiled_res.zip"])

    subprocess.check_call([
        AAPT2, "link",
        "-I", ANDROID_JAR,
        "--min-sdk-version", "21",
        "--target-sdk-version", "34",
        "--manifest", f"{BUILD_DIR}/AndroidManifest.xml",
        "-o", f"{BUILD_DIR}/unaligned.apk",
        "--java", f"{BUILD_DIR}/src",
        "-A", f"{BUILD_DIR}/assets",
        "--auto-add-overlay",
        f"{BUILD_DIR}/compiled_res.zip"
    ])

    java_files = [f"{BUILD_DIR}/src/{pkg_path}/MainActivity.java"]
    r_java = f"{BUILD_DIR}/src/{pkg_path}/R.java"
    if os.path.exists(r_java):
        java_files.append(r_java)

    subprocess.check_call([
        JAVAC,
        "--release", "17",
        "-cp", ANDROID_JAR,
        "-d", f"{BUILD_DIR}/classes",
        *java_files
    ])

    class_files = []
    for root, _, files in os.walk(f"{BUILD_DIR}/classes"):
        for file in files:
            if file.endswith(".class"):
                class_files.append(os.path.join(root, file))

    subprocess.check_call([
        D8,
        "--output", BUILD_DIR,
        "--lib", ANDROID_JAR,
        "--min-api", "21",
        *class_files
    ])

    import zipfile
    with zipfile.ZipFile(f"{BUILD_DIR}/unaligned.apk", "a") as apk_zip:
        apk_zip.write(f"{BUILD_DIR}/classes.dex", "classes.dex")

    subprocess.check_call([
        ZIPALIGN, "-f", "-p", "4",
        f"{BUILD_DIR}/unaligned.apk",
        f"{BUILD_DIR}/aligned.apk"
    ])

    keystore_path = f"{BUILD_DIR}/apkmarket.jks"
    subprocess.check_call([
        KEYTOOL, "-genkeypair", "-v",
        "-keystore", keystore_path,
        "-alias", "apkmarket",
        "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000",
        "-storepass", "android", "-keypass", "android",
        "-dname", f"CN={clean_app_name}, OU={pkg}, O={clean_app_name}, L=Delhi, ST=Delhi, C=IN"
    ])

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    subprocess.check_call([
        APKSIGNER, "sign",
        "--ks", keystore_path,
        "--ks-key-alias", "apkmarket",
        "--ks-pass", "pass:android",
        "--key-pass", "pass:android",
        "--out", output_path,
        f"{BUILD_DIR}/aligned.apk"
    ])

    shutil.rmtree(BUILD_DIR)
    print(f"SUCCESS: Compiled custom APK for {clean_app_name} [{pkg}] with template {template_file} -> {output_path}")

if __name__ == "__main__":
    web = sys.argv[1] if len(sys.argv) > 1 else "https://raxi-win.com"
    name = sys.argv[2] if len(sys.argv) > 2 else "APEX WINGS MOD"
    design = sys.argv[3] if len(sys.argv) > 3 else "APEX WINGS MOD"
    out = sys.argv[4] if len(sys.argv) > 4 else "public/assets/downloads/base.apk"
    pkg = sys.argv[5] if len(sys.argv) > 5 else "com.apkmarket.app"
    compile_custom_apk(web, name, design, out, pkg)
