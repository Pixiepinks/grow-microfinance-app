const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Path to Flutter web build folder
const webBuildPath = path.join(__dirname, 'build', 'web');
const indexHtmlPath = path.join(webBuildPath, 'index.html');

// Create a minimal placeholder build when the Flutter web output is missing
if (!fs.existsSync(indexHtmlPath)) {
  fs.mkdirSync(webBuildPath, { recursive: true });
  fs.writeFileSync(
    indexHtmlPath,
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Grow Microfinance</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; background: #f4f6f8; color: #0f172a; }
          .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); max-width: 720px; }
          h1 { margin-top: 0; }
          code { background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Flutter web build not found</h1>
          <p>Deployments require the Flutter web build output to be committed at <code>build/web</code>.</p>
          <ol>
            <li>Install Flutter and run <code>flutter build web --release</code>.</li>
            <li>Commit the generated <code>build/web</code> directory.</li>
            <li>Redeploy this service.</li>
          </ol>
          <p>If you are testing locally, this placeholder page lets the Node server run without errors.</p>
        </div>
      </body>
    </html>`
  );
  console.warn('Warning: build/web missing. Generated placeholder index.html.');
}

// Serve static assets (JS, CSS, images, etc.)
app.use(express.static(webBuildPath));

// For any route, send back index.html so Flutter web router can handle it
app.get('*', (req, res) => {
  res.sendFile(path.join(webBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Flutter web app running on port ${port}`);
});
