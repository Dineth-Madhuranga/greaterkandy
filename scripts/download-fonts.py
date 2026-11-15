"""Fetch the Latin subsets of open-license Google Fonts for self-hosting."""
from pathlib import Path
from urllib.request import Request, urlopen
import re

root = Path(__file__).resolve().parents[1] / "src/app/fonts"
fonts = [
    ("Barlow+Condensed:wght@800;900", "barlow-condensed", "barlowcondensed"),
    ("Inter+Tight:wght@100..900", "inter-tight", "intertight"),
    ("Nothing+You+Could+Do", "nothing-you-could-do", "nothingyoucoulddo"),
]
for family, name, folder in fonts:
    request = Request("https://fonts.googleapis.com/css2?family=" + family + "&display=swap", headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"})
    css = urlopen(request, timeout=60).read().decode()
    # The final block is the Latin subset. Barlow 900 is the final weight.
    url = re.findall(r"url\((https://[^)]+)\)", css)[-1]
    data = urlopen(url, timeout=60).read()
    extension = "woff2" if data[:4] == b"wOF2" else "ttf"
    target = root / (name + "." + extension)
    target.write_bytes(data)
    license_url = "https://raw.githubusercontent.com/google/fonts/main/ofl/" + folder + "/OFL.txt"
    (root / (name + "-OFL.txt")).write_bytes(urlopen(license_url, timeout=60).read())
    print(target.name, len(data))
