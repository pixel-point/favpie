# Favicon and webmanifest generator

Generate favicons in all necessary sizes, webmanifest and piece of CSS to insert to your project

### Usage

```
npx favpie <file> [options]
```

```
Arguments:
  file                      *.png, *.jpg, *.jpeg image file

Options:
  -o, --output <directory>  output directory
  -ap, --app-name <name>    Your App Name
  -sn, --short-name <name>  Your App Name
  -h, --help                display help for command

```

Example:

```
npx favpie favicon-original.png -o ./favicon -ap "Favpie" -sn "Favpie"
```
