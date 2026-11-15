# Assets and provenance

## Photographs

1. `public/images/kandy-lake.webp`: [Kandy Lake View from Kandy View Point](https://commons.wikimedia.org/wiki/File:Kandy_Lake_View_from_Kandy_View_Point.jpg), Rilwan19760430, 11 January 2020. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Resized to 1920 × 909, converted to WebP, and cropped by CSS. Adaptation remains CC BY-SA 4.0.
2. `public/images/kandy-city.webp`: [View point of Kandy](https://commons.wikimedia.org/wiki/File:View_point_of_Kandy.jpg), Charles R. Benedict, 8 January 2018. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Resized to 1440 × 1080, converted to WebP, and cropped by CSS. Adaptation remains CC BY-SA 4.0.

Both show local context only. They are not evidence of GreaterKandy project delivery, clients, or affiliation. Visible attribution and downloadable adapted files are available at `/credits`, linked in the footer.

## Brand and graphic elements

`public/images/greaterkandy-mark.webp` is the existing brand asset from `https://i.postimg.cc/hjbxQf40/greaterkandy-removebg-preview-removebg-preview-png-120x120.webp`. The original is preserved; it is too small and low-contrast for the new header. Typography renders the name legibly.

The sticker wordmark, curved type, paper texture, arrows, asterisk, and vector advertising illustrations are original CSS/SVG elements. The megaphone, billboard, digital kiosk, and flower are original Three.js geometry, with locally generated canvas poster textures. No reference-site model files or image assets are reused. These illustrations are not photographs of delivered installations. No AI-generated photography is used.

## Fonts

The active design self-hosts **Barlow Condensed 900**, **Inter Tight variable**, and **Nothing You Could Do** using `next/font/local`. Their Latin WOFF2 subsets total approximately 83 KB. Each has its SIL Open Font License in `src/app/fonts/`; `scripts/download-fonts.py` records retrieval from Google Fonts. Barlow’s TTF also supplies the generated social image.

Sweet Tape’s heading font is Futura PT Condensed, served through its own Adobe Fonts project. The user approved a close open-license alternative on 15 November 2026; Barlow Condensed is used instead. Inter Tight and Nothing You Could Do match the reference families. The reference Adobe project and proprietary font binaries are not used.

The earlier Manrope and Instrument Serif files are retained locally but are not referenced or downloaded by the new site.

## Desirable future assets

- Vector or high-resolution GreaterKandy logo, with approved light/dark versions.
- Owned photographs of actual campaigns, installations, and people at work.
- Confirmed project descriptions, client permissions, and evidence for any results.

These are enhancements, not empty placeholders in the current site.
