# ⚡ Full Stack Deployment - 3 Simple Steps

Deploy **frontend + backend + database** completely automatic to public GitHub!

---

## 🎯 What You Get

✅ **Public Website** - https://stayspot.co.ke
✅ **Backend API** - Ready to deploy (in Releases)
✅ **Database** - Schema + backups (automatic)
✅ **CI/CD Pipeline** - Auto-deploys on every push
✅ **Free Hosting** - GitHub Pages
✅ **Version Control** - All deployments tracked

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Create GitHub Repo (1 minute)
```
Go to: https://github.com/new
- Name: stayspot
- Visibility: PUBLIC ✅
- Create
```

### Step 2: Run Deployment Script (2 minutes)
```bash
cd /home/techhatch/Documents/stayspot
chmod +x deploy-full-stack.sh
./deploy-full-stack.sh
```

**When prompted:**
- GitHub username: (your username)
- Repository name: stayspot

### Step 3: Enable Pages (1 minute)
```
Go to: https://github.com/YOUR_USERNAME/stayspot/settings/pages
- Branch: gh-pages
- Folder: / (root)
- Save
```

**Done!** ✅ Automatic deployment complete!

---

## 🌐 Access Your Website

### Immediately Available
```
Frontend: https://YOUR_USERNAME.github.io/stayspot
or
Frontend: https://stayspot.co.ke (with custom domain)
```

### Check Deployment
```
Actions: https://github.com/YOUR_USERNAME/stayspot/actions
Releases: https://github.com/YOUR_USERNAME/stayspot/releases
```

---

## 🔄 Making Changes

```bash
# 1. Edit files

# 2. Push to GitHub
git add .
git commit -m "Your change"
git push origin main

# 3. Wait 3-5 minutes
# Website auto-updates! 🎉
```

---

## 📊 What Gets Deployed

| Component | Location | Access |
|-----------|----------|--------|
| **Frontend** | GitHub Pages | Public ✅ |
| **Backend** | GitHub Releases | Public ✅ |
| **Database** | GitHub Artifacts | Private |
| **Schema** | Backup Daily | Private |

---

## 🤖 Automated Workflow

Every push runs:
1. ✅ MySQL database setup
2. ✅ Import database schema
3. ✅ Run migrations
4. ✅ Build backend
5. ✅ Build frontend
6. ✅ Deploy to Pages
7. ✅ Deploy to Releases
8. ✅ Backup database

All happens automatically! 🚀

---

## 📝 File Locations

```
.github/workflows/
├── full-stack-deploy.yml    ← Main automation
└── deploy.yml               ← Frontend only

deploy-full-stack.sh         ← Setup script
FULL_STACK_DEPLOYMENT.md     ← Detailed guide
```

---

## ✅ Verification

After deployment, check:

```bash
# Frontend is live
curl -I https://YOUR_USERNAME.github.io/stayspot
# Should show: 200 OK

# Go to Actions tab
# Should show green checkmark ✅

# Go to Releases
# Should have new release with backend files
```

---

## 🎯 Example URLs

Replace `YOUR_USERNAME`:
- **GitHub Repo**: https://github.com/YOUR_USERNAME/stayspot
- **Frontend**: https://YOUR_USERNAME.github.io/stayspot
- **Actions**: https://github.com/YOUR_USERNAME/stayspot/actions
- **Releases**: https://github.com/YOUR_USERNAME/stayspot/releases
- **Settings**: https://github.com/YOUR_USERNAME/stayspot/settings

---

## 🔐 Security

✅ **Automatic** (handled by CI/CD):
- Dependencies installed fresh
- Code built in sandbox
- Database migrations run safely
- Backups created regularly

⚠️ **Your responsibility**:
- Keep `.env` files private
- Never commit secrets
- Use GitHub Secrets for sensitive data
- Review `.gitignore`

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow failing | Check Actions tab logs |
| Site not updating | Wait 3-5 min, refresh browser |
| 404 errors | Ensure gh-pages branch created |
| Build failing locally | Run `npm install` & check errors |

---

## 📞 Commands Reference

```bash
# Initial setup
./deploy-full-stack.sh

# Make & deploy changes
git add .
git commit -m "Your message"
git push origin main

# Check status
git log --oneline -5
git status
git branch -a
```

---

## 🎉 You Now Have

✅ **Frontend** - Live and public
✅ **Backend** - Versioned in releases
✅ **Database** - Backed up automatically
✅ **CI/CD** - Auto-deploys on every push
✅ **Version Control** - All history in GitHub
✅ **HTTPS** - Secure by default
✅ **Free Hosting** - GitHub Pages

**Everything is automatic and public!** 🚀

---

## 📚 Learn More

- Full guide: `FULL_STACK_DEPLOYMENT.md`
- GitHub Pages: https://pages.github.com
- GitHub Actions: https://github.com/features/actions
- GitHub Releases: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases

---

**Ready to deploy?**

```bash
./deploy-full-stack.sh
```

**That's it!** 🎊

---

**Last Updated**: January 12, 2026
**Status**: Ready to Deploy ✅
