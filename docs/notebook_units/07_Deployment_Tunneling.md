# Notebook Unit 07: Deployment & Tunneling

## 1. Local Development (`npm run dev`)
- **Default**: `localhost:5173`
- **Exposed**: `npm run dev -- --host` opens the server to the LAN (e.g., `192.168.0.x:5173`).
- **Prerequisites**: Windows Firewall must allow `Node.js` on Private/Public networks.

## 2. Global Access Strategy (`Localtunnel`)
For mobile testing or sharing without deployment.
- **Tools**: `localtunnel` (via `npx`).
- **Command**: `npx localtunnel --port 5173 --subdomain [custom-name]`
- **Security Check**: The first visit requires entering the **Tunnel Password** (Host Public IP) to prevent abuse.
- **SSL**: Provides valid HTTPS, bypassing "Not Secure" warnings on mobile.

## 3. Production Build (`npm run build`)
- **Bundler**: Vite (Rollup).
- **Output**: `/dist` folder containing static assets (HTML, CSS, JS).
- **Hosting**:
    - Ready for Netlify, Vercel, or Firebase Hosting.
    - Requires `firebase deploy` if using Firebase Hosting.
    - **Current Status**: Not yet deployed to production CDN.
