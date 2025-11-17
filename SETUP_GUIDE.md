# 🚀 Playturfy Website Setup Guide

## Quick Start

1. **Open the website**
   - Simply open `index.html` in your web browser
   - No installation or build process required!

2. **View Privacy Policy**
   - Click "Privacy Policy" in the navigation
   - Or open `privacy.html` directly

## 📝 Customization Checklist

### Before Going Live:

#### 1. Update Contact Information
- [ ] Replace `support@playturfy.com` with your real email
- [ ] Update social media links in footer (Facebook, Instagram, Twitter)

#### 2. Add Play Store Link
- [ ] Replace all `#` in download buttons with your Google Play Store URL
- [ ] Format: `https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME`

#### 3. Add Real Screenshots
- [ ] Create an `images` folder in the `playturfy` directory
- [ ] Add your app screenshots (recommended: 5-8 images)
- [ ] Update the screenshot section in `index.html`
- [ ] Recommended size: 1080x1920px (9:16 aspect ratio)

#### 4. Add App Logo
- [ ] Create your app logo
- [ ] Replace the Font Awesome icon with your logo image
- [ ] Update in header and footer

#### 5. Setup Contact Form Backend
Choose one option:
- **Option A**: Use Formspree (https://formspree.io)
- **Option B**: Use EmailJS (https://www.emailjs.com)
- **Option C**: Build your own backend API
- Update the form action in `js/script.js`

#### 6. SEO Optimization
- [ ] Update meta descriptions in both HTML files
- [ ] Add Open Graph tags for social media sharing
- [ ] Create a `favicon.ico` file
- [ ] Add `robots.txt` and `sitemap.xml`

#### 7. Analytics (Optional)
- [ ] Add Google Analytics code
- [ ] Add Facebook Pixel (if needed)

## 🎨 Color Customization

The website uses Tailwind CSS. To change the lime green color:

### Method 1: Using Tailwind Config (Recommended)
Create a `tailwind.config.js` file:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'lime': {
          500: '#YOUR_COLOR_HERE',
        }
      }
    }
  }
}
```

### Method 2: Find and Replace
Search for these classes and replace:
- `bg-lime-500` → Your background color
- `text-lime-500` → Your text color
- `border-lime-500` → Your border color
- `hover:bg-lime-400` → Your hover color

## 📸 Adding Real Screenshots

1. Create images folder:
```
playturfy/
├── images/
│   ├── screenshot1.png
│   ├── screenshot2.png
│   ├── screenshot3.png
│   └── ...
```

2. Update the screenshot section in `index.html`:
```html
<div class="flex-shrink-0 w-64 snap-center">
    <div class="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-4 shadow-2xl">
        <img src="images/screenshot1.png" alt="Home Screen" class="rounded-2xl">
    </div>
</div>
```

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Push your code
3. Go to Settings → Pages
4. Select main branch
5. Your site will be live at `username.github.io/repo-name`

### Option 2: Netlify (Free)
1. Sign up at netlify.com
2. Drag and drop the `playturfy` folder
3. Your site is live instantly!

### Option 3: Vercel (Free)
1. Sign up at vercel.com
2. Import your GitHub repository
3. Deploy with one click

### Option 4: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase init hosting`
3. Deploy: `firebase deploy`

## 🔧 Testing Checklist

Before deployment, test:
- [ ] All navigation links work
- [ ] Mobile menu opens and closes
- [ ] FAQ accordion expands/collapses
- [ ] Contact form shows success message
- [ ] All sections are visible on mobile
- [ ] Images load correctly
- [ ] No console errors
- [ ] Smooth scrolling works
- [ ] Privacy policy page loads

## 📱 Mobile Testing

Test on these devices:
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] Tablet (iPad/Android)
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)

## 🎯 Performance Tips

1. **Optimize Images**
   - Compress screenshots (use TinyPNG or similar)
   - Use WebP format for better compression
   - Lazy load images below the fold

2. **Minify Files**
   - Minify CSS and JS before production
   - Use tools like UglifyJS or online minifiers

3. **CDN Usage**
   - Tailwind CSS and Font Awesome are loaded from CDN
   - Consider self-hosting for better performance

## 🆘 Troubleshooting

### Issue: Styles not loading
- Check that `css/style.css` path is correct
- Verify Tailwind CDN link is working

### Issue: JavaScript not working
- Check browser console for errors
- Verify `js/script.js` path is correct
- Ensure all IDs match between HTML and JS

### Issue: Mobile menu not working
- Clear browser cache
- Check that Font Awesome is loading
- Verify mobile-menu-btn ID exists

## 📞 Support

For questions or issues:
- Email: support@playturfy.com
- Check README.md for more details

---

**Ready to launch? Good luck! ⚽🚀**
