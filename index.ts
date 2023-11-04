import Vibrant from "node-vibrant";
import Color from "colorjs.io";
import * as fs from "fs";
import * as path from "path";

interface Compatibility {
  name1: string;
  name2: string;
  compatibility: string;
}

function getColors(filePath: string): Promise<{ colors: string[] }> {
  return Vibrant.from(filePath)
    .getPalette()
    .then((palette) => {
      const colors = Object.values(palette)
        .filter((color) => color)
        .map((color) => color.getRgb().toString());
      return { colors };
    });
}

const assetsDir = path.join(__dirname, "assets");

fs.readdir(assetsDir, { withFileTypes: true }, (err, folders) => {
  if (err) throw err;

  const promises = folders
    .filter((folder) => folder.isDirectory())
    .map((folder) => {
      const imageDir = path.join(assetsDir, folder.name);
      return fs.promises.readdir(imageDir).then((files) => {
        const promises = files
          .filter((file) => /\.(png|jpe?g)$/i.test(file))
          .map((file) => {
            const filePath = path.join(imageDir, file);
            return getColors(filePath).then((colors) => ({
              name: file,
              colors: colors.colors,
            }));
          });
        return Promise.all(promises).then((images) => ({
          folder: folder.name,
          images,
        }));
      });
    });

  Promise.all(promises)
    .then((folders) => {
      const startTime = Date.now();

      console.log(`Calculating compatibility scores...\n`);

      for (const folder of folders) {
        const compatibilityScoresFolder: Compatibility[] = [];

        console.log(`Folder: ${folder.folder}`);

        for (let i = 0; i < folder.images.length; i++) {
          const row: Compatibility[] = [];
          for (let j = 0; j < folder.images.length; j++) {
            if (i !== j) {
              const compatibility = getCompatibilityScore(
                folder.images[i],
                folder.images[j]
              );
              row.push({
                name1: folder.images[i].name,
                name2: folder.images[j].name,
                compatibility,
              });
            }
          }
          compatibilityScoresFolder.push(...row);
        }

        const json = JSON.stringify(compatibilityScoresFolder);
        fs.writeFile(
          path.join(assetsDir, folder.folder, "compatibility.json"),
          json,
          (err) => {
            if (err) throw err;
            console.log(
              `\nCompatibility scores written to ${path.join(
                folder.folder,
                "compatibility.json"
              )}`
            );
          }
        );
      }

      const endTime = Date.now();
      console.log(`\nTotal time taken: ${endTime - startTime}ms`);
    })
    .catch((err) => {
      console.error(err);
    });
});

function getCompatibilityScore(
  image1: { colors: string[] },
  image2: { colors: string[] }
): string {
  try {
    let color1 = new Color(`rgb(${image1.colors})`);
    let color2 = new Color(`rgb(${image2.colors})`);
    let colorDistance = 100 - Math.floor(color1.deltaE2000(color2));
    return `${colorDistance.toFixed(0)}%`;
  } catch (error) {
    console.error("Could not parse rgb() as a color. This is a known issue with full white images. Returning ? instead.");
    return "?";
  }
}