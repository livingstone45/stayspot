# 🚀 Quick Start: Deploy to GitHub Pages in 5 Minutes

Your website will be **publicly accessible from anywhere** on GitHub Pages!

---

## 📋 What You Need

✅ GitHub account (free)
✅ GitHub username
✅ Local code (already in `/home/techhatch/Documents/stayspot`)

---

## 5-Step Quick Start

### Step 1️⃣: Create GitHub Repository (2 min)

1. Go to: https://github.com/new
2. **Repository name**: `stayspot`
3. **Visibility**: PUBLIC ✅
4. Click: **Create repository**

✅ **Copy this URL**: `https://github.com/YOUR_USERNAME/stayspot.git`

---

### Step 2️⃣: Push Code to GitHub (2 min)

```bash
cd /home/techhatch/Documents/stayspot

# Make it executable
chmod +x setup-github.sh

# Run setup script
./setup-github.sh
```

**When prompted:**
- Enter your GitHub username
- Enter repository name: `stayspot`
- Press Enter when ready

**That's it!** Your code is now on GitHub.

---

### Step 3️⃣: Enable GitHub Pages (1 min)

1. Go to: https://github.com/YOUR_USERNAME/stayspot
2. Click: **Settings tab**
3. Left sidebar: **Pages**
4. Under "Build and deployment":
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click: **Save**

---

### Step 4️⃣: Wait for Deployment (1 min)

1. Go to: **Actions tab**
2. Watch the workflow run
3. Wait for green checkmark ✅

---

### Step 5️⃣: Visit Your Website! 🌍 (instant)

Your site is live at:
```
https://YOUR_USERNAME.github.io/stayspot
```

**That's it!** Your website is now publicly accessible! 🎉

---

## 🔄 Making Updates

Every time you change code:

```bash
cd /home/techhatch/Documents/stayspot

# Make changes to files...

git add .
git commit -m "Your change description"
git push origin main
```

**Automatic deployment!** Site updates in 2-5 minutes. ✨

---

## 🌐 Custom Domain (Optional)

Want `stayspot.co.ke` instead of GitHub URL?

1. **Update DNS** at your domain registrar:
   - Type: `CNAME`
   - Name: `stayspot`
   - Value: `YOUR_USERNAME.github.io`

2. **GitHub Pages settings**:
   - Custom domain: `stayspot.co.ke`
   - Enable HTTPS
   - Save

3. **Wait 10-15 minutes** for DNS to propagate

---

## ✅ Verify Deployment

**Check if site is live:**

```bash
curl -I https://YOUR_USERNAME.github.io/stayspot
```

Should see: `200 OK` ✅

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Site not showing | Wait 2-5 minutes, refresh browser |
| Workflow failed | Check Actions tab for error messages |
| 404 errors | Ensure gh-pages branch is created |
| CNAME not working | Wait longer for DNS to update |

---

## 📊 What's Deployed

✅ **Deployed** to GitHub Pages:
- Frontend (React) from `frontend/dist/`
- All static assets
- HTML/CSS/JS

⚠️ **Not deployed** (stays private):
- Backend code
- `.env` files
- Secrets & API keys

---

## 🎯 Commands Cheat Sheet

```bash
# First time setup
./setup-github.sh

# Make changes and deploy
git add .
git commit -m "Your message"
git push origin main

# Check deployment status
git log --oneline -5

# View workflow status
# Go to: https://github.com/YOUR_USERNAME/stayspot/actions
```

---

## 🔒 Security Notes

✅ **Keep private** (in .gitignore):
- `.env` files
- API keys
- Database passwords
- Secrets

✅ **Safe to share** (will be public):
- Code
- Documentation
- Frontend assets

---

## 📞 Next Steps

1. **Create GitHub repo** (Step 1)
2. **Run setup script** (Step 2)
3. **Enable Pages** (Step 3)
4. **Visit website** (Step 5)
5. **Share URL** with others! 🎉

---

**Your website is now:**
- ✅ Public & accessible from anywhere
- ✅ Automatically updating on every push
- ✅ Hosted for free on GitHub
- ✅ Protected with HTTPS

**Happy deploying!** 🚀
