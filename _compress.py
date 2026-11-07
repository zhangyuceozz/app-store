# -*- coding: utf-8 -*-
"""把 apps/*/preview.png 重压缩为 preview.jpg (quality=82, progressive)
   然后更新 apps.js 里的 preview 路径后缀"""
import os, re
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))

# 1. 压缩所有 preview.png → preview.jpg
png_count = 0
total_old = 0
total_new = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn == 'preview.png':
            src = os.path.join(dirpath, fn)
            dst = os.path.join(dirpath, 'preview.jpg')
            try:
                img = Image.open(src)
                if img.mode in ('RGBA', 'LA', 'P'):
                    # 有 alpha 通道的 PNG：合成到白底
                    bg = Image.new('RGB', img.size, (255, 255, 255))
                    img_rgb = img.convert('RGBA')
                    bg.paste(img_rgb, mask=img_rgb.split()[-1])
                    img = bg
                else:
                    img = img.convert('RGB')
                img.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
                old_size = os.path.getsize(src)
                new_size = os.path.getsize(dst)
                total_old += old_size
                total_new += new_size
                png_count += 1
                print(f'  {os.path.relpath(src, ROOT)}: {old_size/1024:.0f}KB → {new_size/1024:.0f}KB ({new_size/old_size*100:.0f}%)')
                os.remove(src)
            except Exception as e:
                print(f'  ERROR {src}: {e}')

print(f'\n共 {png_count} 张 PNG 压缩完成')
print(f'总大小: {total_old/1024:.0f}KB → {total_new/1024:.0f}KB (减少 {(1-total_new/total_old)*100:.0f}%)')

# 2. 更新 apps.js 里的 preview: "apps/xxx/preview.png" → "preview.jpg"
apps_js = os.path.join(ROOT, 'apps.js')
with open(apps_js, 'r', encoding='utf-8-sig') as f:
    content = f.read()

orig = content
content = re.sub(
    r'(preview\s*:\s*["\']apps/[^"\']+/)preview\.png(["\'])',
    r'\1preview.jpg\2',
    content
)

changed = content != orig
with open(apps_js, 'w', encoding='utf-8') as f:
    f.write(content)

if changed:
    replacements = len(re.findall(r'preview\.jpg', content)) - len(re.findall(r'preview\.jpg', orig))
    print(f'\napps.js 已更新 (preview.png → preview.jpg)')
else:
    print('\napps.js 无需更新')
