const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Path to Flutter web build folder
const webBuildPath = path.join(__dirname, '..', 'build', 'web');
const indexHtmlPath = path.join(webBuildPath, 'index.html');

// If the Flutter web build is missing (common in CI/CD runners without Flutter),
// generate a lightweight placeholder so the server can still start. This keeps
// deployments healthy while signalling that a real `flutter build web --release`
// output should be committed for production use.
if (!fs.existsSync(indexHtmlPath)) {
  console.warn('No Flutter web build detected at build/web; generating placeholder.');
  fs.mkdirSync(webBuildPath, { recursive: true });

  const placeholderHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grow Microfinance</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        background: radial-gradient(circle at 20% 20%, #f5f7fb, #e8ebf5);
        min-height: 100vh;
        display: grid;
        place-items: center;
      }
      .card {
        max-width: 640px;
        padding: 32px;
        border-radius: 16px;
        background: #ffffff;
        box-shadow: 0 20px 80px rgba(0, 0, 0, 0.12);
        color: #1f2937;
      }
      h1 {
        margin-top: 0;
        font-size: 28px;
        letter-spacing: -0.02em;
      }
      p {
        line-height: 1.6;
        margin: 12px 0;
        color: #4b5563;
      }
      code {
        background: #f3f4f6;
        border-radius: 6px;
        padding: 2px 6px;
      }
      a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Grow Microfinance Web Build Missing</h1>
      <p>
        This environment does not contain the compiled Flutter web assets
        (<code>build/web</code>). The server generated this placeholder so the
        deployment can start successfully.
      </p>
      <p>
        To publish the full application, run
        <code>flutter build web --release</code> locally and commit the
        resulting <code>build/web</code> directory before deploying.
      </p>
      <p>
        If you believe you are seeing this message in production, please rebuild
        the web assets and redeploy.
      </p>
      <p>See the project README for deployment instructions.</p>
    </div>
  </body>
</html>`;

  fs.writeFileSync(indexHtmlPath, placeholderHtml);
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
