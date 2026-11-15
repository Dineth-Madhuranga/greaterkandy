from pathlib import Path
root = Path(__file__).resolve().parents[1]
path = root / "src/app/credits/page.tsx"
text = path.read_text(encoding="utf-8").replace("Manrope and Instrument Serif are self-hosted under the SIL Open Font License. The typographic illustrations were created for this website.", "Barlow Condensed, Inter Tight, and Nothing You Could Do are self-hosted under the SIL Open Font License. The 3D advertising objects, vector illustrations, and paper texture were created for this website.")
path.write_text(text, encoding="utf-8")
