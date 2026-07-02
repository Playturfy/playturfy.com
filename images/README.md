# Open Graph (OG) Images for Playturfy

## Current Status

**SVG placeholders created** - Functional but basic  
**Recommended:** Replace with professional PNG/JPG images

## Image Requirements

### Dimensions & Format
- **Size:** 1200 x 630 pixels (aspect ratio 1.91:1)
- **Format:** PNG or JPG (SVG works but PNG/JPG preferred for social platforms)
- **File Size:** Under 8MB (ideally under 1MB for faster loading)
- **Color Profile:** sRGB

### Brand Guidelines
- **Primary Brand Color:** #BFFF00 (bright lime green)
- **Background:** Black (#000000)
- **Fonts:** Poppins (Bold/ExtraBold for headlines)
- **Style:** Modern, clean, high-contrast

## Files to Create

### 1. `og-image.png` (or .jpg)
**Purpose:** Default Open Graph image for homepage
**Content:**
- Playturfy logo/wordmark
- Tagline: "Football Broadcasting App" or "Stream to OBS"
- Visual: Football/soccer elements, broadcasting icons (microphone, camera)
- Brand color #BFFF00 prominently featured
- Clean, professional design

### 2. `twitter-card.png` (or .jpg)
**Purpose:** Twitter/X card image
**Content:**
- Similar to og-image but optimized for Twitter's card display
- More text-focused (Twitter crops images differently)
- Include key value props: "OBS Overlay • Live Stats • Free"

### 3. `news-og.png` (or .jpg)
**Purpose:** News page sharing
**Content:**
- "Football News" headline
- Newspaper/article icon
- "Latest Updates from Playturfy"
- Brand color accents

### 4. `logo.png`
**Purpose:** Schema.org Organization logo (512x512 or 1:1 square)
**Content:**
- Clean Playturfy logo
- Transparent or black background
- Recognizable as app icon

### 5. `broadcasting-overlay-screenshot.png`
**Purpose:** Shows actual broadcasting overlay feature
**Content:**
- Real screenshot of OBS overlay in action
- Scoreboard with team names/scores
- Timer visible
- Professional football broadcast look

## Design Tools

### Free Options:
- **Canva:** Use OG Image template (1200x630)
- **Figma:** Free design tool with templates
- **GIMP:** Open-source Photoshop alternative

### Quick Online Generators:
- https://www.opengraph.xyz/
- https://og-playground.vercel.app/
- https://www.bannerbear.com/tools/open-graph-image-generator/

## Testing Your Images

### Before deploying, test on:

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Enter: https://playturfy.com/
   - Click "Scrape Again" to refresh cache
   - Verify image loads and looks good

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Enter: https://playturfy.com/
   - Check preview displays correctly

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Enter: https://playturfy.com/
   - Verify professional appearance

4. **WhatsApp Preview**
   - Simply share the link in a chat
   - Check if thumbnail and text display correctly

## Image Optimization

After creating PNG/JPG files, optimize them:

### Online Tools:
- **TinyPNG:** https://tinypng.com/ (reduces file size by 60-80%)
- **Squoosh:** https://squoosh.app/ (Google's image optimizer)
- **ImageOptim:** https://imageoptim.com/ (Mac app)

### Command Line:
```bash
# Install imagemagick
# Then optimize:
convert og-image.png -strip -quality 85 og-image-optimized.png
```

## Deployment Checklist

After creating new images:

- [ ] Replace all .svg files with .png or .jpg
- [ ] Update HTML meta tags to reference .png/.jpg instead of .svg
- [ ] Optimize images (compress to <300KB each)
- [ ] Test in all social media debuggers
- [ ] Clear CDN cache if using Cloudflare/similar
- [ ] Share test link on WhatsApp to verify thumbnail
- [ ] Check mobile preview on actual device

## Tips for Maximum Engagement

1. **Use faces:** Images with people get 38% more clicks
2. **High contrast:** Dark background (#000) with bright brand color (#BFFF00)
3. **Text overlays:** Keep text to 5-7 words maximum
4. **Show the product:** Include app screenshot or UI element
5. **Call to action:** "Download Now" or "Start Streaming"
6. **Consistent branding:** Same style across all pages

## Current SVG Files (Temporary)

The current SVG files are functional placeholders:
- ✅ Correct dimensions (1200x630)
- ✅ Brand color #BFFF00 used
- ✅ Clean, modern design
- ⚠️ Basic text-only design
- ⚠️ No actual screenshots/photos
- ⚠️ May not render perfectly on all platforms

**Recommendation:** Replace with professional PNG designs within 1-2 weeks for maximum impact.

---

**Questions?** Contact: turfy.sports@gmail.com
