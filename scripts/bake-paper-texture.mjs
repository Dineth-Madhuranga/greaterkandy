import sharp from "sharp";

// Rasterize the existing procedural texture once instead of filtering every painted surface.
await sharp("public/textures/paper.svg").resize(384, 384).webp({ quality: 75 }).toFile("public/textures/paper.webp");
console.log("Baked the existing SVG paper texture to public/textures/paper.webp");
