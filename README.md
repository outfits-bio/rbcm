# Recommendations by color matching (rbcm)
Our open-source color matching technology to be used to give you the recommendations by comparing the posts you liked with other posts by matching the % of color similarity.

## How to use?
1. Install our [bun](https://bun.sh/) (fast runtime with built-in typescript support) i prefer using.
2. Install packages i prefer [pnpm](https://pnpm.io/) so `pnpm install`.
3. Then create subfolders in assets/ and upload atleast 2 images.
4. Run either by `pnpm run dev` or `bun run`.
5. For support, questions or else join our [Discord](https://discord.com/invite/f4KEs5TVz2).

## Dependencies
- [node-vibrant](https://www.npmjs.com/package/node-vibrant) - used to extract colors from images in the getColors function.
- [colorjs.io](https://colorjs.io/) - used for the math behind color similarity.
- [fs](https://github.com/npm/fs) - used to write the data in .json files.
- [path](https://www.npmjs.com/package/path) - used to find paths easily.

## Example footage
![Example Footage Gif](https://github.com/outfits-bio/rbcm/blob/92df5b5353cc3691c5eeec484dafa2472c2f0c89/assets/example.gif)