# 💝 Valentine's Day Website Deployment Guide

## Overview
Deploy your Valentine's Day special website to GitHub and make it live on playturfy.com/valentine

---

## Quick Deploy Commands

Run these commands in order:

```bash
# Step 1: Navigate to playturfy folder
cd playturfy

# Step 2: Check what files will be added
git status

# Step 3: Add all Valentine files
git add valentine/

# Step 4: Commit with a message
git commit -m "Add Valentine's Day special website"

# Step 5: Push to GitHub
git push origin main
```

**Note:** If your branch is `master` instead of `main`, use:
```bash
git push origin master
```

---

## What Gets Deployed

### Files Being Added:
- ✅ `valentine/question.html` - Main Valentine's page
- ✅ `valentine/question.css` - Styling
- ✅ `valentine/question.js` - Interactive features
- ✅ `valentine/ayesha-images/` - All images (12 photos)
- ✅ `valentine/README.md` - Documentation

### Live URL After Deployment:
```
https://playturfy.com/valentine/question.html
```

Or create a simpler URL by renaming:
```
https://playturfy.com/valentine/index.html
```

---

## Optional: Rename for Better URL

If you want the URL to be just `playturfy.com/valentine/` instead of `playturfy.com/valentine/question.html`:

```bash
# Rename question.html to index.html
cd playturfy/valentine
mv question.html index.html

# Update the commit
git add .
git commit -m "Rename Valentine page to index.html for cleaner URL"
git push origin main
```

---

## Deployment Timeline

After pushing to GitHub:

1. **Immediate (0-2 minutes):**
   - Files appear in GitHub repository
   - You can see them at github.com/[your-username]/[repo-name]

2. **GitHub Pages Build (2-5 minutes):**
   - GitHub Pages automatically rebuilds your site
   - Check status: Repository → Settings → Pages

3. **Live Website (5-10 minutes):**
   - Website accessible at playturfy.com/valentine/
   - May need to clear browser cache

---

## Verification Steps

After deployment, check:

### 1. GitHub Repository
- [ ] Go to your GitHub repository
- [ ] Navigate to `valentine/` folder
- [ ] Verify all files are present
- [ ] Check `ayesha-images/` folder has all 12 images

### 2. Live Website
- [ ] Visit `https://playturfy.com/valentine/question.html`
- [ ] Check if page loads correctly
- [ ] Verify all images display
- [ ] Test interactive features
- [ ] Try on mobile device

### 3. Browser Cache
If changes don't appear:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Try incognito/private window

---

## Temporary Deployment (1 Day)

Since you want this live for just 1 day, here's how to remove it later:

### Option 1: Remove from GitHub (Recommended)
```bash
# After Valentine's Day, remove the folder
cd playturfy
git rm -r valentine/
git commit -m "Remove Valentine's Day special (temporary promotion ended)"
git push origin main
```

### Option 2: Keep Files but Hide from Public
Add a redirect or "Coming Soon" page:
```bash
# Rename the folder to hide it
git mv valentine valentine-archive
git commit -m "Archive Valentine's Day special"
git push origin main
```

---

## Link to Valentine's Page from Main Site

### Add a Banner to index.html (Optional)

Add this to your main `playturfy/index.html` near the top:

```html
<!-- Valentine's Day Special Banner -->
<div style="background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%); 
            padding: 15px; text-align: center; color: white;">
    <h3>💝 Valentine's Day Special! 💝</h3>
    <p>Check out our special Valentine's page</p>
    <a href="valentine/question.html" 
       style="background: white; color: #ff6b9d; padding: 10px 20px; 
              border-radius: 25px; text-decoration: none; font-weight: bold;">
        View Valentine's Special →
    </a>
</div>
```

Then commit and push:
```bash
git add index.html
git commit -m "Add Valentine's Day banner to homepage"
git push origin main
```

---

## Troubleshooting

### Issue: Git push rejected
**Solution:**
```bash
git pull origin main
git push origin main
```

### Issue: Images not loading
**Possible causes:**
1. File paths incorrect in HTML
2. Image files too large (optimize to <500KB each)
3. Special characters in filenames (rename WhatsApp images)

**Fix image filenames:**
```bash
cd playturfy/valentine/ayesha-images
# Rename files to simpler names
mv "WhatsApp Image 2026-02-13 at 8.16.18 PM.jpeg" "image1.jpeg"
mv "WhatsApp Image 2026-02-13 at 8.16.19 PM (1).jpeg" "image2.jpeg"
# ... continue for all images
```

### Issue: 404 Error on live site
**Solution:**
1. Wait 10 minutes for GitHub Pages to rebuild
2. Check GitHub Actions tab for build status
3. Verify CNAME file is correct
4. Check repository Settings → Pages is enabled

---

## Complete Deployment Checklist

- [ ] Navigate to playturfy folder
- [ ] Run `git status` to see changes
- [ ] Run `git add valentine/`
- [ ] Run `git commit -m "Add Valentine's Day special"`
- [ ] Run `git push origin main`
- [ ] Wait 5-10 minutes
- [ ] Visit playturfy.com/valentine/question.html
- [ ] Test on desktop and mobile
- [ ] Share the link!

---

## After Valentine's Day (Removal)

On February 15th or when you want to remove it:

```bash
cd playturfy
git rm -r valentine/
git commit -m "Remove Valentine's Day special - promotion ended"
git push origin main
```

The page will be removed from your live site within 5-10 minutes.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Deploy | `git add valentine/ && git commit -m "Add Valentine special" && git push origin main` |
| Check status | `git status` |
| View live | `https://playturfy.com/valentine/question.html` |
| Remove later | `git rm -r valentine/ && git commit -m "Remove Valentine special" && git push origin main` |

---

**Created:** February 13, 2026
**Purpose:** Temporary Valentine's Day special deployment
**Duration:** 1 day (remove after February 14, 2026)

