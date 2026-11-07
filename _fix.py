import re, os
ROOT = os.path.dirname(os.path.abspath(__file__))
apps_js = os.path.join(ROOT, 'apps.js')
with open(apps_js, 'r', encoding='utf-8-sig') as f:
    content = f.read()
orig = content
content = re.sub(
    r'(preview\s*:\s*["\']apps/[^"\']+/)preview\.png(["\'])',
    r'\1preview.jpg\2',
    content
)
with open(apps_js, 'w', encoding='utf-8') as f:
    f.write(content)
print('readany preview.png → .jpg:', content != orig)
print('--- 文件状态 ---')
for d in ['readany', 'rea', 'pdfcraft']:
    full = os.path.join(ROOT, 'apps', d)
    if os.path.isdir(full):
        files = os.listdir(full)
        for fn in sorted(files):
            if fn.startswith('preview') or fn.startswith('icon'):
                sz = os.path.getsize(os.path.join(full, fn))
                print(f'  apps/{d}/{fn}: {sz/1024:.0f}KB')
