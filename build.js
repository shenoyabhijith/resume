const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// Clean dist directory
function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('Cleaned dist directory');
}

// Copy files to dist directory
function copyFiles() {
  // Copy all files from src to dist
  copyDir(SRC_DIR, DIST_DIR);
  console.log('Copied files to dist directory');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Inline CSS
function inlineCSS() {
  const htmlPath = path.join(DIST_DIR, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Find CSS link tags
  const cssLinkRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
  let match;
  
  while ((match = cssLinkRegex.exec(html)) !== null) {
    const cssPath = path.join(DIST_DIR, match[1]);
    
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf8');
      const inlinedCSS = `<style>${css}</style>`;
      
      html = html.replace(match[0], inlinedCSS);
      fs.unlinkSync(cssPath); // Remove the CSS file after inlining
      console.log(`Inlined CSS from ${match[1]}`);
    }
  }
  
  fs.writeFileSync(htmlPath, html);
}

// Minify JavaScript
function minifyJS() {
  const jsDir = path.join(DIST_DIR, 'js');
  
  if (!fs.existsSync(jsDir)) {
    return;
  }
  
  // Skip minification to prevent syntax errors
  console.log('Skipping minification to preserve syntax');
  
  // const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
  
  // for (const file of jsFiles) {
  //   const filePath = path.join(jsDir, file);
  //   let js = fs.readFileSync(filePath, 'utf8');
    
  //   // Simple minification (remove comments and extra whitespace)
  //   js = js
  //     .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
  //     .replace(/\/\/.*$/gm, '') // Remove single-line comments
  //     .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
  //     .replace(/\s?([{}();,=+*/%&|^~!<>?:])\s?/g, '$1') // Remove spaces around operators
  //     .replace(/\s*:\s*/g, ':') // Remove spaces around colons in object properties
  //     .replace(/\s*,\s*/g, ',') // Remove spaces around commas
  //     .replace(/\s*=\s*/g, '=') // Remove spaces around equals
  //     .replace(/\s*\+\s*/g, '+') // Remove spaces around plus
  //     .replace(/\s*-\s*/g, '-') // Remove spaces around minus
  //     .replace(/\s*>\s*/g, '>') // Remove spaces around greater than
  //     .replace(/\s*<\s*/g, '<') // Remove spaces around less than
  //     .replace(/\s*\(\s*/g, '(') // Remove spaces around opening parentheses
  //     .replace(/\s*\)\s*/g, ')') // Remove spaces around closing parentheses
  //     .replace(/\s*\[\s*/g, '[') // Remove spaces around opening brackets
  //     .replace(/\s*\]\s*/g, ']') // Remove spaces around closing brackets
  //     .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
  //     .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
  //     .trim(); // Trim leading/trailing whitespace
    
  //   fs.writeFileSync(filePath, js);
  //   console.log(`Minified ${file}`);
  // }
}

// Create PWA manifest
function createManifest() {
  const manifest = {
    "name": "Terminal Portfolio",
    "short_name": "TermPortfolio",
    "description": "A terminal-style portfolio website",
    "start_url": ".",
    "display": "standalone",
    "background_color": "#000000",
    "theme_color": "#33ff33",
    "icons": [
      {
        "src": "icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(DIST_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  // Create service worker
  const serviceWorker = `
  const CACHE_NAME = 'terminal-portfolio-v1';
  const urlsToCache = [
    './',
    './data/content.json'
  ];
  
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  });
  
  self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  `;
  
  fs.writeFileSync(
    path.join(DIST_DIR, 'sw.js'),
    serviceWorker
  );
  
  // Update HTML to include manifest and service worker
  const htmlPath = path.join(DIST_DIR, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Add manifest link
  if (!html.includes('rel="manifest"')) {
    html = html.replace(
      '<head>',
      '<head>\n    <link rel="manifest" href="manifest.json">'
    );
  }
  
  // Add service worker registration
  if (!html.includes('serviceWorker')) {
    html = html.replace(
      '</body>',
      `
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => console.log('ServiceWorker registration successful'))
          .catch(error => console.log('ServiceWorker registration failed:', error));
      }
    </script>
  </body>`
    );
  }
  
  fs.writeFileSync(htmlPath, html);
  console.log('Created PWA manifest and service worker');
}

// Remove development-only code from HTML
function removeDevCode() {
  const htmlPath = path.join(DIST_DIR, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Remove live reload script
  html = html.replace(
    /<script>\s*\/\/ Live reload script[\s\S]*?<\/script>/g,
    ''
  );
  
  fs.writeFileSync(htmlPath, html);
  console.log('Removed development-only code from HTML');
}

// Main build function
function build() {
  console.log('Building project...');
  
  cleanDist();
  copyFiles();
  inlineCSS();
  minifyJS();
  removeDevCode();
  createManifest();
  
  console.log('Build complete!');
  console.log(`Output directory: ${DIST_DIR}`);
}

// Run build
build(); 