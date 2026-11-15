import concurrent.futures
import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

BASE = 'https://greater-kandy-mauve.vercel.app'
ROOT = Path(__file__).resolve().parents[1] / 'reference'
ROOT.mkdir(exist_ok=True)

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.text = []
        self.assets = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.skip += 1
        if tag in ('img', 'script') and attrs.get('src'):
            self.assets.append(attrs)
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip and data.strip():
            self.text.append(data.strip())

def fetch(route):
    name = route.strip('/') or 'home'
    data = urllib.request.urlopen(BASE + route, timeout=30).read()
    (ROOT / f'live-{name}.html').write_bytes(data)
    page = Page()
    page.feed(data.decode('utf-8'))
    report = {'page': route, 'text': page.text, 'assets': page.assets, 'links': sorted(set(page.links))}
    (ROOT / f'{name}.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    for asset in page.assets:
        source = asset['src']
        if source.startswith('/_next/static/chunks/app/'):
            script = urllib.request.urlopen(BASE + source, timeout=30).read()
            (ROOT / source.split('/')[-1]).write_bytes(script)
    return report

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    for report in executor.map(fetch, ['/', '/what-we-do', '/about', '/contact']):
        print(json.dumps(report, ensure_ascii=True))
