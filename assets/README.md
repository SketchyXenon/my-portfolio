# assets/ — Static Files

Drop your personal files here. The folder is gitignored for binary files
but the filenames below are expected by the HTML.

## Required files

| File                  | Size / Format         | Used for                          |
|-----------------------|-----------------------|-----------------------------------|
| profile.jpg           | ~400×500px, JPEG/WebP | About section photo               |
| og-image.png          | 1200×630px, PNG       | Social share preview (LinkedIn etc)|
| favicon-32.png        | 32×32px, PNG          | Browser tab icon                  |
| favicon-16.png        | 16×16px, PNG          | Browser tab icon (small)          |
| apple-touch-icon.png  | 180×180px, PNG        | iOS home screen icon              |
| cv.pdf                | PDF                   | Download CV button                |

## Quick favicon generator
Go to https://favicon.io/favicon-generator/
- Text: JR  (or your initials)
- Background: #00ffc8
- Font color: #080810
- Download and rename to match the table above.

## Quick OG image
Take a screenshot of your hero section at 1200×630px,
or use https://og-playground.vercel.app to design one.

## Photo tips
- Use a square or portrait crop, professional but casual
- Compress with https://squoosh.app before adding
- WebP format preferred for smaller file size
  (rename to profile.webp and update index.html src accordingly)
