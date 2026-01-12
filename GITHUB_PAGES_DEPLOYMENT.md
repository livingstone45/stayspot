# GitHub Pages Deployment Guide

Deploy your StaySpot website to GitHub Pages - **accessible from anywhere**!

## ✅ What This Does

Your website will be live at:
- `https://yourusername.github.io/stayspot` (default)
- `https://stayspot.co.ke` (if you configure custom domain)

**Automatic updates** - Every time you push to GitHub, your site deploys automatically!

---

## 🚀 Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Create new repository**:
   - Name: `stayspot`
   - Description: `StaySpot Property Management System`
   - Visibility: **PUBLIC** ✅
   - Click: **Create repository**

---

## 🔧 Step 2: Push Code to GitHub

From your local machine:

```bash
cd /home/techhatch/Documents/stayspot

# Initialize git (if not already done)
git init

# Add GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/stayspot.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: StaySpot system"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

---

## 🤖 Step 3: Enable GitHub Actions

1. **Go to your repository**: https://github.com/YOUR_USERNAME/stayspot
2. **Click: Actions tab**
3. **You should see workflow**: "Deploy to GitHub Pages"
4. **It will run automatically** on the first push

---

## 🌐 Step 4: Enable GitHub Pages

1. **Go to Settings tab** of your repository
2. **Left sidebar → Pages**
3. **Source**: 
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click: **Save**
4. **Wait 1-2 minutes** for GitHub to deploy
5. **Your site is live!** 🎉

---

## 📍 Step 5: Access Your Website

### Default URL (No custom domain):
```
https://YOUR_USERNAME.github.io/stayspot
```

### Custom Domain (stayspot.co.ke):

1. **DNS Settings** (where you bought domain):
   - Add `CNAME` record:
     - Name: `stayspot`
     - Value: `YOUR_USERNAME.github.io`
   
2. **GitHub Pages Settings** (Repository → Settings → Pages):
   - Custom domain: `stayspot.co.ke`
   - Enable: **Enforce HTTPS** ✅
   - Click: **Save**

3. **Wait 5-10 minutes** for DNS to propagate
4. **Visit**: https://stayspot.co.ke 🌍

---

## 🔄 How Deployment Works

```
You push code to GitHub
        ↓
GitHub Actions workflow triggers
        ↓
Builds frontend + backend
        ↓
Deploys frontend to gh-pages branch
        ↓
Website updates automatically
        ↓
Live at your GitHub Pages URL ✅
```

---

## 📝 Workflow File Location

The deployment automation is in:
```
.github/workflows/deploy.yml
```

**What it does:**
1. ✅ Checks out your code
2. ✅ Installs Node.js & dependencies
3. ✅ Builds backend
4. ✅ Builds frontend
5. ✅ Deploys to GitHub Pages

---

## 🚀 Deploy New Changes

After you make code changes:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Your change description"

# Push to GitHub
git push origin main
```

**That's it!** Your site updates automatically within minutes. ✨

---

## 🔗 Useful Links

- **Your Repository**: https://github.com/YOUR_USERNAME/stayspot
- **GitHub Pages**: https://YOUR_USERNAME.github.io/stayspot
- **GitHub Actions**: https://github.com/YOUR_USERNAME/stayspot/actions
- **Settings**: https://github.com/YOUR_USERNAME/stayspot/settings/pages

---

## ✅ Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub (main branch)
- [ ] GitHub Actions workflow enabled
- [ ] GitHub Pages enabled (gh-pages branch)
- [ ] Website accessible at GitHub Pages URL
- [ ] (Optional) Custom domain configured
- [ ] (Optional) HTTPS enforced

---

## 🆘 Troubleshooting

### Site not updating?
- Check Actions tab - is workflow running?
- Wait 2-5 minutes for deployment
- Clear browser cache (Ctrl+Shift+Del)

### Custom domain not working?
- Check DNS CNAME record is correct
- Wait 10-15 minutes for DNS propagation
- Verify domain is added in GitHub Pages settings

### Workflow failing?
- Check Actions tab for error logs
- Ensure `npm run build:frontend` works locally
- Verify all dependencies in package.json

---

## 📊 What's Public?

✅ **Public** (visible to everyone):
- Frontend code (React)
- Frontend builds
- Documentation
- Package files

⚠️ **Important**: Keep these PRIVATE:
- `.env` files (add to `.gitignore`)
- Secrets & API keys
- Database credentials

---

## 🎯 Next Steps

1. **Replace `YOUR_USERNAME`** with your actual GitHub username in all URLs
2. **Create the repository** on GitHub
3. **Push your code** using the git commands above
4. **Enable GitHub Pages** in repository settings
5. **Visit your live website!** 🌍

**Questions?** Check the GitHub Pages documentation: https://pages.github.com/

---

**Last Updated**: January 12, 2026
**Status**: Ready to Deploy 🚀
