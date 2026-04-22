# qr-gen

Minimal client-side QR code generator. Enter text or a URL, tweak size and
error correction, download the result as PNG. Runs entirely in the browser —
no server, no tracking, no network calls after the initial page load.

## Development

```sh
npm install
npm run dev        # live dev server at http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the built dist/ locally
```

Built with [Vite](https://vitejs.dev/) + the [`qrcode`](https://www.npmjs.com/package/qrcode) npm package.
