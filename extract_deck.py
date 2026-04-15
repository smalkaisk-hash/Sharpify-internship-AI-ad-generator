import sys, os
sys.stdout.reconfigure(encoding='utf-8')
from zipfile import ZipFile
import re

path = r"C:\Users\Ritvars Volfs\Downloads\Kā ar AI aģentiem un Claude Code izveidot savu digitālo dubultnieku - Pro plan.docx"
with ZipFile(path) as z:
    with z.open('word/document.xml') as f:
        content = f.read().decode('utf-8')
text = re.sub(r'<[^>]+>', '\n', content)
text = re.sub(r'\n{3,}', '\n\n', text)
text = re.sub(r'&amp;', '&', text)
text = re.sub(r'&quot;', '"', text)
lines = [l.strip() for l in text.split('\n') if l.strip()]
with open('deck.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))
print(f'Extracted {len(lines)} lines to deck.txt')
