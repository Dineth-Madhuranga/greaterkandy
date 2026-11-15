from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
import re, json

root = Path(__file__).resolve().parents[1] / "reference/sweet-tape"
target = root / "motion-source"
target.mkdir(exist_ok=True)
urls = set()
for path in root.glob("*.html"):
    for url in re.findall(r'<script[^>]+src="([^"]+)"', path.read_text(encoding="utf-8")):
        if url.startswith("/_next/"):
            urls.add("https://sweet-tape.com" + url)

def download(url):
    name = url.split("/")[-1]
    path = target / name
    if not path.exists():
        path.write_bytes(urlopen(Request(url, headers={"User-Agent":"Mozilla/5.0"}), timeout=45).read())
    content = path.read_text(encoding="utf-8")
    markers = [word for word in ["scrollTrigger:","ScrollTrigger", "stagger:","clipPath:","lenis","duration:","transition","roll-it","THREE", "Pull", "pull-me"] if word in content]
    return {"file":name,"bytes":path.stat().st_size,"markers":markers}

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(download, sorted(urls)))
(root / "motion-source-index.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
print(json.dumps([r for r in results if any(m in r["markers"] for m in ["scrollTrigger:","stagger:","clipPath:","lenis"])] ,indent=2))
