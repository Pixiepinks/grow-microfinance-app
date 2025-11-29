const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Path to Flutter web build folder
const webBuildPath = path.join(__dirname, 'build', 'web');

// Serve static assets (JS, CSS, images, etc.)
app.use(express.static(webBuildPath));

// For any route, send back index.html so Flutter web router can handle it
app.get('*', (req, res) => {
  res.sendFile(path.join(webBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Flutter web app running on port ${port}`);
});
