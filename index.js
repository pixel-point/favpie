#! /usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const crypto = require('crypto');

// Write an CLI that accepts a file in jpg or png formats and converts it to favicon png files of different sizes and names
// The CLI should accept file as a first argument and output directory as a second argument (optional)
// If output directory is not provided, the files should be saved in the current directory

// Example: node index.js input.jpg output
// Sizes: 32x32, 48x48, 72x72, 96x96, 256x256, 384x384, 512x512

const sizes = [
  { name: 'favicon-32x32', width: 32, height: 32, rel: 'icon' },
  {
    name: 'favicon-48x48',
    width: 48,
    height: 48,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
  {
    name: 'favicon-72x72',
    width: 72,
    height: 72,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
  {
    name: 'favicon-96x96',
    width: 96,
    height: 96,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
  { name: 'favicon-144x144', width: 144, height: 144, includeToManifest: true },
  { name: 'favicon-192x192', width: 192, height: 192, includeToManifest: true },
  {
    name: 'favicon-256x256',
    width: 256,
    height: 256,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
  {
    name: 'favicon-384x384',
    width: 384,
    height: 384,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
  {
    name: 'favicon-512x512',
    width: 512,
    height: 512,
    rel: 'apple-touch-icon',
    includeToManifest: true,
  },
];

program
  .name('favicon-generator')
  .description('Get favicon files from a jpg or png and piece of CSS to embed them in your HTML')
  .argument('<file>', '*.png, *.jpg, *.jpeg image file')
  .option('-o, --output <directory>', 'output directory')
  // Add an option for app name -ap --app-name <name>
  .option('-ap, --app-name <name>', 'Your App Name')
  .option('-sn, --short-name <name>', 'Your App Name')
  .action(async (file, options) => {
    const { output, appName, shortName } = options;
    const { dir, name: fileName, ext } = path.parse(file);
    const input = path.join(dir, fileName + ext);
    // If output directory is not provided, the files should be saved in the current directory
    const outputDir = output || path.join(dir);

    const css = [];

    // Calculate hashsum of the input file and use it as a cache key using crypto library

    const hash = crypto.createHash('md5');
    const inputBuffer = fs.readFileSync(input);
    hash.update(inputBuffer);
    const hashsum = hash.digest('hex');

    if (!fs.existsSync(input)) {
      console.error('File does not exist');
      process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Make validation of the input file extension and throw an error if it is not jpg,jpeg or png

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      console.error('File extension is not jpg, jpeg or png');
      process.exit(1);
    }

    // Validate that input file has at least 512x512 size and square shape

    const imageMetadata = await sharp(input).metadata();

    if (imageMetadata.width < 512 || imageMetadata.height < 512) {
      console.error('Image is too small. Minimum size is 512x512');
      process.exit(1);
    }

    if (imageMetadata.width !== imageMetadata.height) {
      console.error('Image is not square');
      process.exit(1);
    }

    sizes.forEach((size) => {
      const { name, width, height, rel, includeToManifest } = size;

      // Resize the input file to the size of the current iteration and save it to the output directory, use different methods for jpg and png and set quality to 90

      if (ext === '.jpg' || ext === '.jpeg') {
        sharp(input)
          .resize(width, height)
          .jpeg({ quality: 90 })
          .toFile(path.join(outputDir, `${name}${ext}`));
      } else {
        sharp(input)
          .resize(width, height)
          .png({ quality: 90 })
          .toFile(path.join(outputDir, `${name}${ext}`));
      }
      // If includeToManifest: true, then don't add the link to the CSS

      if (includeToManifest && !rel) {
        return;
      }

      //  If rel is icon, then add type="image/png" or type="image/jpeg" based on the input file

      if (rel === 'icon') {
        css.push(`<link rel="${rel}" type="image/${ext.slice(1)}" href="/${name}${ext}">`);
      } else {
        css.push(`<link rel="${rel}" sizes="${width}x${height}" href="/${name}${ext}">`);
      }
    });

    // Generate manifest.webmanifest using the data from a previous actions

    const imagesForManifest = sizes.filter((size) => size.includeToManifest);

    const manifest = {
      name: appName,
      short_name: shortName,
      icons: imagesForManifest.map((image) => {
        const { name, width, height } = image;
        return {
          src: `/${name}${ext}?v=${hashsum}`,
          sizes: `${width}x${height}`,
          type: `image/${ext.slice(1)}`,
        };
      }),
    };

    fs.writeFileSync(
      path.join(outputDir, 'manifest.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );

    // Add manifest link to the CSS

    css.push(`<link rel="manifest" href="/manifest.webmanifest" crossorigin="anonymous">`);

    console.log(css.join('\n'));
  });

program.parse();
