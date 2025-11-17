# 🚀 How to Update Your GitHub Repository

## Option 1: If You Already Have a GitHub Repository

### Step 1: Initialize Git (if not already done)
```bash
cd playturfy
git init
```

### Step 2: Add Your Remote Repository
Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Or if already added, check with:
```bash
git remote -v
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Commit Changes
```bash
git commit -m "Update website: Fixed logo path from assests to assets"
```

### Step 5: Push to GitHub
```bash
git push -u origin main
```

Or if your branch is named `master`:
```bash
git push -u origin master
```

---

## Option 2: Create a New GitHub Repository

### Step 1: Create Repository on GitHub
1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Name it (e.g., `playturfy-website`)
4. Choose **Public** or **Private**
5. **Don't** initialize with README (we already have files)
6. Click **Create repository**

### Step 2: Initialize and Push
GitHub will show you commands. Use these:

```bash
cd playturfy
git init
git add .
git commit -m "Initial commit: Playturfy website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Option 3: Update Existing Repository (Quick Method)

If you already have the repo set up:

```bash
cd playturfy
git add .
git commit -m "Fix: Updated logo path and folder name"
git push
```

---

## 🔄 Common Git Commands

### Check Status
```bash
git status
```

### See What Changed
```bash
git diff
```

### View Commit History
```bash
git log --oneline
```

### Pull Latest Changes (if working with others)
```bash
git pull
```

### Create a New Branch
```bash
git checkout -b feature-name
```

---

## 🌐 Deploy to GitHub Pages

After pushing to GitHub, enable GitHub Pages:

### Step 1: Go to Repository Settings
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)

### Step 2: Configure Source
1. Under **Source**, select **main** branch
2. Select **/ (root)** folder
3. Click **Save**

### Step 3: Wait for Deployment
- GitHub will build your site (takes 1-2 minutes)
- Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Step 4: Update URLs in Your Files
Once you know your GitHub Pages URL, update these files:
- `index.html` - Update canonical URL and Open Graph URLs
- `privacy.html` - Update canonical URL
- `sitemap.xml` - Update all URLs
- `SEO_OPTIMIZATION.md` - Update placeholder URLs

---

## 🔧 Troubleshooting

### Error: "fatal: not a git repository"
**Solution:** Run `git init` first

### Error: "remote origin already exists"
**Solution:** 
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "failed to push some refs"
**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied (publickey)"
**Solution:** Set up SSH key or use HTTPS with personal access token
- HTTPS: `https://github.com/USERNAME/REPO.git`
- Or generate SSH key: https://docs.github.com/en/authentication

---

## 📝 Best Practices

### 1. Write Clear Commit Messages
```bash
# Good
git commit -m "Fix: Corrected logo image path"
git commit -m "Add: New contact form validation"
git commit -m "Update: Improved mobile responsiveness"

# Bad
git commit -m "changes"
git commit -m "fix"
```

### 2. Commit Often
Don't wait to commit everything at once. Commit logical chunks:
```bash
git add index.html
git commit -m "Update: Header logo styling"

git add css/style.css
git commit -m "Add: New animation for hero section"
```

### 3. Use .gitignore
Create a `.gitignore` file to exclude unnecessary files:
```
# .gitignore
.DS_Store
Thumbs.db
*.log
node_modules/
.env
```

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize new repository |
| `git add .` | Stage all changes |
| `git add filename` | Stage specific file |
| `git commit -m "message"` | Commit with message |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git status` | Check status |
| `git log` | View history |
| `git branch` | List branches |
| `git checkout -b name` | Create new branch |

---

## 🚀 Your Next Steps

1. **Choose your option** (1, 2, or 3 above)
2. **Run the commands** in your terminal
3. **Enable GitHub Pages** (if deploying there)
4. **Update URLs** in your files with actual domain
5. **Test your live site**

---

**Need Help?**
- GitHub Docs: https://docs.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf

Good luck! 🎉
