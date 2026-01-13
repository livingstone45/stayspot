# 🚀 RAILWAY DEPLOYMENT - COPY-PASTE COMMANDS

## Your JWT Secret (Needed in Railway)
```
4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8
```

---

## 5 Environment Variables to Add in Railway

Copy each of these exactly:

### 1. DATABASE_URL
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```
(Get this from Railway PostgreSQL service)

### 2. JWT_SECRET
```
4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8
```

### 3. NODE_ENV
```
production
```

### 4. FRONTEND_URL
```
https://livingstone45.github.io
```

### 5. PORT
```
3000
```

---

## Final Command (After Railway Setup)

When you have your Railway backend URL, run:

```bash
cd /home/techhatch/Documents/stayspot
bash railway-finalize.sh https://your-railway-backend-url.up.railway.app
```

**Example with real URL:**
```bash
bash railway-finalize.sh https://stayspot-production-abc123xyz.up.railway.app
```

---

## That's it!

The script will:
- ✅ Update frontend
- ✅ Build React app
- ✅ Deploy to GitHub Pages
- ✅ Everything goes LIVE!
