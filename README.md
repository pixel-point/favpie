# Favpie - CLI to generate favicons and webmanifest.

![npm](https://img.shields.io/npm/v/favpie)

Favpie - the solution for generating favicons in all necessary sizes, creating a webmanifest, and providing a piece of CSS for easy integration into your project.

### Features

🚀  Lightning-fast image creation and optimization thanks to the use of the Sharp library

🏃‍ Convenient CLI interface, allowing you to run the tool with a single NPX command

💪 Effortless creation of webmanifests, making it easier than ever to get your project ready for the web.

### Usage

```
npx favpie <file> [options]
```

```
Arguments:
  file                      *.png, *.jpg, *.jpeg image file

Options:
  -o, --output <directory>  output directory(default: current directory)
  -ap, --app-name <name>    app name used in webmanifest(default: Your App Name)
  -sn, --short-name <name>  short name used in webmanifest(default: Your App Name)
  -h, --help                display help for command

```

Example:

```
npx favpie favicon-original.png -o ./favicon -ap "Favpie" -sn "Favpie"
```

Output:
```css
<link rel="icon" type="image/png" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png">
<link rel="apple-touch-icon" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="256x256" href="/favicon-256x256.png">
<link rel="apple-touch-icon" sizes="384x384" href="/favicon-384x384.png">
<link rel="apple-touch-icon" sizes="512x512" href="/favicon-512x512.png">
<link rel="manifest" href="/manifest.webmanifest" crossorigin="anonymous">
```
