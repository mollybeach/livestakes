# PWA Icons

This directory contains icons for the Progressive Web App functionality.

## Required Icons
The following icons should be generated from the logo_no_bg.png file:

- icon-72x72.png (72x72)
- icon-96x96.png (96x96)
- icon-128x128.png (128x128)
- icon-144x144.png (144x144)
- icon-152x152.png (152x152)
- icon-192x192.png (192x192)
- icon-384x384.png (384x384)
- icon-512x512.png (512x512)

## How to Generate

You can generate these icons using an image editor like Photoshop, GIMP, or online tools like:
- https://app-manifest.firebaseapp.com/
- https://maskable.app/editor
- https://realfavicongenerator.net/

Alternatively, you can use the following ImageMagick command:

```bash
# Install ImageMagick if needed
# brew install imagemagick (Mac)
# apt-get install imagemagick (Linux)

# Navigate to the project root
cd src/public

# Generate icons (replace with actual paths)
for size in 72 96 128 144 152 192 384 512; do
  convert logo_no_bg.png -resize ${size}x${size} icons/icon-${size}x${size}.png
done
```

Make sure the icons have a transparent background and are properly centered. 