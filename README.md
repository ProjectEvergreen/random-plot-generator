# random-plot-generator
An example of using SVG and Custom Elements (with `lit-html`) to create data visualizations and other fun things in JavaScript.  Inspired by [this FunFunFunction YouTube series](https://www.youtube.com/playlist?list=PL0zVEGEvSaeGmPpG8tAaqSmf3k56LPwiF) on creating a Neural Network in JavaScript.  For the time being I will just be emulating what's done in the video, but where it goes from there, who knows!

## Setup
1. Clone the repo
1. Run `npm install`
1. Run `npm run serve`

## Contributing
The more the merrier!  Would love to keep this going with more varied and interesting features and visualizations.  Propose something in the issue tracker and feel free to submit a PR!

## Release Management / GitHub Pages
GitHub pages has been setup for this repo.  The URL `https://projectevergreen.github.io/random-plot-generator/`.  

To generate a new release and generate an updated version of the code for GitHub pages, do the following:
1. Make sure all changes to be released have gone into the `master` branch
1. Run `npm run gh-pages`
1. Commit this changes
1. Bump `package.json` and `git tag` the release
1. Push to `master` with `--tags` and and verify the deployment