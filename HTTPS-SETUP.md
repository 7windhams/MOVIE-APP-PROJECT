# HTTPS Setup for Movie Database

## 🔒 Setting Up HTTPS (SSL/TLS)

Your movie app now supports both HTTP and HTTPS! Here's how to set it up:

### Quick Start (Recommended)

1. **Install the required dependency:**
   ```bash
   npm install node-forge
   ```

2. **Generate SSL certificates:**
   ```bash
   npm run create-cert
   ```

3. **Start the HTTPS server:**
   ```bash
   npm run start-https
   ```

4. **Visit your secure app:**
   - HTTP: `http://localhost:3002`
   - HTTPS: `https://localhost:3443` ⚠️ (will show security warning - click "Advanced" → "Proceed")

### What This Does

- Creates **self-signed SSL certificates** for development
- Runs **both HTTP and HTTPS** servers simultaneously
- HTTP server: `localhost:3002`
- HTTPS server: `localhost:3443`

### Browser Security Warning

Since these are self-signed certificates (not from a trusted authority), your browser will show a security warning. This is **normal for development**:

1. Click **"Advanced"**
2. Click **"Proceed to localhost (unsafe)"**
3. Your app will load with HTTPS! 🔒

### Production HTTPS

For production, you'd want **real certificates** from:
- **Let's Encrypt** (free)
- **Cloudflare** (free with proxy)
- **Your hosting provider** (varies)

### Files Created

```
certificates/
├── private.key      # Private key
└── certificate.crt  # SSL certificate
```

### Development vs Production

| Environment | Certificate Type | Browser Warning | Cost |
|-------------|------------------|-----------------|------|
| Development | Self-signed | Yes ⚠️ | Free |
| Production | CA-issued | No ✅ | Free-$$ |

Now your movie database supports secure HTTPS connections! 🎉