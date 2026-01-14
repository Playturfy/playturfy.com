# GitHub Push Guide - Update Logos and Assets

## Issue
- Old folder: `assests` (typo) exists on GitHub
- New folder: `assets` (correct) has updated logos locally
- Website updated to use `assets/newlogo.png` and new favicons
- Need to push changes and remove old folder

---

## Files Changed Locally

### 1. Updated in `index.html`:
- Logo changed from `assets/applogo.png` to `assets/newlogo.png` (header & footer)
- Favicons updated to point to `assets/Favicon of turfy/`
- New features added (Team Stats, PDF Reports, etc.)
- SEO optimizations applied

### 2. New Files in `assets/`:
- `newlogo.png` - New Playturfy logo
- `Favicon of turfy/apple-touch-icon.png`
- `Favicon of turfy/favicon-16x16.png`
- `Favicon of turfy/favicon-32x32.png`
- `Favicon of turfy/site.webmanifest`

---

## Step-by-Step: Push to GitHub

### Step 1: Navigate to playturfy folder
```bash
cd playturfy
```

### Step 2: Check current status
```bash
git status
```

### Step 3: Stage all changes
```bash
git add .
```

### Step 4: Commit changes
```bash
git commit -m "Update website: new logo, favicons, and v1.0.9 features"
```

### Step 5: Push to GitHub
```bash
git push origin main
```

**Note:** If your branch is named differently (e.g., `master`), use:
```bash
git push origin master
```

---

## Step-by-Step: Remove Old `assests` Folder from GitHub

### Option 1: Using Git Commands (Recommended)

#### Step 1: Remove the old folder from Git tracking
```bash
git rm -r assests
```

#### Step 2: Commit the removal
```bash
git commit -m "Remove old assests folder (typo)"
```

#### Step 3: Push to GitHub
```bash
git push origin main
```

### Option 2: Using GitHub Web Interface

1. Go to your GitHub repository
2. Navigate to the `assests` folder
3. Click on the folder name
4. Click the trash icon (🗑️) to delete
5. Commit the deletion with message: "Remove old assests folder"

---

## Verify Changes on GitHub

After pushing, check:

1. **GitHub Repository:**
   - ✅ `assets/` folder exists (correct spelling)
   - ✅ `assets/newlogo.png` is present
   - ✅ `assets/Favicon of turfy/` folder with all favicons
   - ❌ `assests/` folder is removed (old typo)

2. **Live Website (playturfy.com):**
   - ✅ New logo displays in header and footer
   - ✅ New favicons show in browser tab
   - ✅ New features section displays (Team Stats, PDF Reports, etc.)
   - ✅ Updated SEO meta tags

---

## Troubleshooting

### Issue: "assests" folder still showing on GitHub
**Solution:** 
```bash
# Force remove from Git history
git rm -rf assests
git commit -m "Remove old assests folder completely"
git push origin main --force
```

### Issue: Changes not showing on live website
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Wait 5-10 minutes for GitHub Pages to rebuild
4. Check in incognito/private window

### Issue: Favicon not updating
**Solution:**
1. Clear browser cache completely
2. Close and reopen browser
3. Check in different browser
4. Wait for CDN cache to clear (can take up to 24 hours)

### Issue: Git push rejected
**Solution:**
```bash
# Pull latest changes first
git pull origin main

# Then push again
git push origin main
```

---

## Complete Command Sequence

Here's the complete sequence to run:

```bash
# Navigate to playturfy folder
cd playturfy

# Check status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Update website v1.0.9: new logo, favicons, features, and SEO"

# Remove old assests folder
git rm -r assests

# Commit removal
git commit -m "Remove old assests folder (typo)"

# Push all changes
git push origin main
```

---

## What Gets Updated

### On GitHub:
- ✅ `index.html` with new logo paths and features
- ✅ `assets/newlogo.png` uploaded
- ✅ `assets/Favicon of turfy/` folder with all favicons
- ✅ `WEBSITE_UPDATE_v1.0.9.md` documentation
- ✅ `GITHUB_PUSH_GUIDE.md` (this file)
- ❌ `assests/` folder removed

### On Live Website (after GitHub Pages rebuild):
- ✅ New Playturfy logo in header and footer
- ✅ New favicons in browser tab
- ✅ 6 new feature cards (Team Stats, PDF Reports, etc.)
- ✅ 6 new FAQ sections
- ✅ Updated SEO meta tags and keywords
- ✅ Enhanced structured data for search engines

---

## Verification Checklist

After pushing to GitHub, verify:

- [ ] GitHub repository shows `assets/` folder (not `assests/`)
- [ ] `newlogo.png` is in `assets/` folder
- [ ] All favicon files are in `assets/Favicon of turfy/`
- [ ] `index.html` changes are visible on GitHub
- [ ] Old `assests/` folder is deleted from GitHub
- [ ] Live website shows new logo (may take 5-10 minutes)
- [ ] Browser tab shows new favicon
- [ ] New features section displays correctly
- [ ] All images load without 404 errors

---

## GitHub Pages Deployment

If using GitHub Pages:

1. **Automatic Deployment:**
   - GitHub Pages rebuilds automatically after push
   - Wait 5-10 minutes for changes to appear
   - Check deployment status in repository Settings → Pages

2. **Manual Trigger (if needed):**
   - Go to repository Settings
   - Click "Pages" in sidebar
   - Click "Save" to trigger rebuild

3. **Check Deployment Status:**
   - Go to repository "Actions" tab
   - Look for "pages build and deployment" workflow
   - Ensure it shows green checkmark (success)

---

## Cache Busting

If changes don't appear immediately:

### Browser Cache:
```
Chrome/Edge: Ctrl+Shift+Delete → Clear cache
Firefox: Ctrl+Shift+Delete → Clear cache
Safari: Cmd+Option+E → Empty cache
```

### CDN Cache (if using Cloudflare/similar):
1. Log into CDN dashboard
2. Purge cache for playturfy.com
3. Wait 5-10 minutes

### Force Reload:
```
Windows: Ctrl+F5 or Ctrl+Shift+R
Mac: Cmd+Shift+R
```

---

## Support

If you encounter issues:

1. Check Git status: `git status`
2. Check Git log: `git log --oneline -5`
3. Check remote: `git remote -v`
4. Check branch: `git branch`

**Common Issues:**
- Merge conflicts: `git pull origin main` then resolve conflicts
- Permission denied: Check SSH keys or use HTTPS
- Large files: Ensure images are optimized (<1MB each)

---

**Last Updated:** January 14, 2025
**Version:** 1.0.9 Website Update
