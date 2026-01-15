const { favicons } = require('favicons');
const path = require('path');
const fs = require('fs');

const {
  siteTitleShort,
  themeColor,
  backgroundColor,
} = require('../site-config');

const dir = path.resolve(__dirname, '../public/icons/');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const source = 'src/images/icon.png';
const configuration = {
  path: '/icons/',
  appName: siteTitleShort,
  appShortName: siteTitleShort,
  appDescription: null,
  developerName: null,
  developerURL: null,
  background: backgroundColor,
  theme_color: themeColor,
  display: 'standalone',
  orientation: 'any',
  scope: '/',
  start_url: '/',
  version: '1.0',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: false,
    windows: true,
    yandex: false,
  },
};

favicons(source, configuration)
  .then(response => {
    // Write image files
    response.images.forEach(image => {
      fs.writeFile(
        path.resolve(__dirname, '../public/icons/', image.name),
        image.contents,
        err => {
          if (err) {
            console.error(`Error writing ${image.name}:`, err);
          }
        }
      );
    });

    // Write other files (like manifest.json, etc.)
    response.files.forEach(file => {
      fs.writeFile(
        path.resolve(__dirname, '../public/', file.name),
        file.contents,
        err => {
          if (err) {
            console.error(`Error writing ${file.name}:`, err);
          }
        }
      );
    });

    console.log('Favicons generated successfully');
  })
  .catch(error => {
    console.error('Error generating favicons:', error.message);
    process.exit(1);
  });
