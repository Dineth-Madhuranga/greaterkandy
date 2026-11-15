"""Download licensed local-context photos, existing logo, and OFL fonts.
Sources and attribution are recorded in docs/ASSETS.md and /credits.
"""
from pathlib import Path
import concurrent.futures
import re
import urllib.request
from PIL import Image, ImageOps
from io import BytesIO

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'images'
FONTS = ROOT / 'src' / 'app' / 'fonts'
ASSETS.mkdir(parents=True, exist_ok=True)
FONTS.mkdir(parents=True, exist_ok=True)

def read(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
    return urllib.request.urlopen(req, timeout=40).read()

def photo(name, url, width):
    data = read(url)
    img = ImageOps.exif_transpose(Image.open(BytesIO(data))).convert('RGB')
    img.thumbnail((width, width))
    img.save(ASSETS / name, 'WEBP', quality=86, method=6)
    return name, img.size, (ASSETS / name).stat().st_size

def font(name, family):
    css = read('https://fonts.googleapis.com/css2?family=' + family + '&display=swap').decode()
    urls = re.findall(r'url\((https[^)]+)\)', css)
    data = read(urls[-1])
    if data[:4] != b'wOF2':
        raise ValueError('Expected a WOFF2 font; refusing a mislabeled file')
    (FONTS / name).write_bytes(data)
    return name, (FONTS / name).stat().st_size

tasks = [
    (photo, 'kandy-lake.webp', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Kandy_Lake_View_from_Kandy_View_Point.jpg', 1920),
    (photo, 'kandy-city.webp', 'https://upload.wikimedia.org/wikipedia/commons/8/82/View_point_of_Kandy.jpg', 1440),
    (font, 'manrope.woff2', 'Manrope:wght@400..700'),
    (font, 'instrument-serif.woff2', 'Instrument+Serif:ital@1'),
]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(task[0], *task[1:]) for task in tasks]
    for future in concurrent.futures.as_completed(futures):
        try: print(future.result(), flush=True)
        except Exception as error: print(type(error).__name__, str(error), flush=True)

logo = ROOT / 'reference' / 'assets' / 'logo.webp'
if logo.exists():
    (ASSETS / 'greaterkandy-mark.webp').write_bytes(logo.read_bytes())
for directory in ['manrope', 'instrumentserif']:
    try: (FONTS / (directory + '-OFL.txt')).write_bytes(read('https://raw.githubusercontent.com/google/fonts/main/ofl/' + directory + '/OFL.txt'))
    except Exception as error: print('License download:', error, flush=True)
