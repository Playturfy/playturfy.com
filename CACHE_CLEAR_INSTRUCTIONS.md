# How to Clear Browser Cache and See Updated Website

## The Problem
You're seeing old content (git merge markers like `<<<<<<< HEAD`) because your browser cached the old version of the website.

## Quick Fix - Hard Refresh

### Chrome/Edge (Windows)
- Press `Ctrl + Shift + R` or `Ctrl + F5`

### Firefox (Windows)
- Press `Ctrl + Shift + R` or `Ctrl + F5`

### Safari (Mac)
- Press `Cmd + Shift + R`

## Full Cache Clear

### Chrome/Edge
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Choose "All time"
4. Click "Clear data"

### Firefox
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Choose "Everything"
4. Click "Clear Now"

## After Deploying to GitHub Pages

If you've already pushed to GitHub Pages:
1. Wait 2-3 minutes for GitHub to rebuild
2. Do a hard refresh (Ctrl + Shift + R)
3. If still showing old content, clear full cache

## What Was Fixed

✅ Removed all git merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`)
✅ Reduced logo size from h-16 to h-12
✅ Fixed favicon 404 error (copied favicon.ico to root)
✅ Added cache-busting meta tags
✅ Updated CSS version to v=2.1

## Verify the Fix

After clearing cache, you should see:
- No git markers or commit hashes
- Smaller logo in header
- No 404 errors in console
- Clean, professional website
