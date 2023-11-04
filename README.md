# Recommendations by color matching (rbcm)
Our open-source color matching technology to be used to give you the recommendations by comparing the compatibility of posts you liked with other posts by matching the % of similarity.

## How to use?
1. install our [bun](https://bun.sh/) (fast runtime with built-in typescript support) i prefer using.
2. install packages i prefer [pnpm](https://pnpm.io/) so `pnpm install`.
3. then create subfolders in assets/ and upload atleast 2 images.
4. run either by `pnpm run dev` or `bun run`.
5. for support, questions or else join our [discord](https://discord.com/invite/f4KEs5TVz2).

## Dependencies
- [node-vibrant](https://www.npmjs.com/package/node-vibrant) - used to extract colors from images in the getColors function.
- [colorjs.io](https://colorjs.io/) - used for the math behind color differences.
- [fs](https://github.com/npm/fs) - used to write the data in .json files.
- [path](https://www.npmjs.com/package/path) - used to find paths easily.