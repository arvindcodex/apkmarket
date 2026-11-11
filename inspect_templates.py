import json
import re
import html

with open("public/processed_body.html") as f:
    text = f.read()

matches = re.findall(r"openDetails\((\{.*?\})\s*,\s*['\"]templates['\"]", text)
print(f"Found {len(matches)} template JSONs")
for i, m in enumerate(matches):
    raw = html.unescape(m)
    try:
        data = json.loads(raw)
        did = data.get('design_id')
        code = data.get('html_code', '')
        print(f"Template {i}: design_id={did}, code_len={len(code)}")
        with open(f"template_{i}_{did.replace(' ', '_')}.html", "w") as out:
            out.write(code)
    except Exception as e:
        print(f"Template {i} error: {e}")
