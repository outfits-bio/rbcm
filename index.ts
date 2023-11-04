import Vibrant from 'node-vibrant';
import * as fs from 'fs';
import * as path from 'path';

interface Compatibility {
    name1: string;
    name2: string;
    compatibility: string;
}

function getColors(filePath: string): Promise<{ dominant: string, other: string[] }> {
    return Vibrant.from(filePath).getPalette()
        .then(palette => {
            const dominant = palette.Vibrant.getRgb().toString();
            const other = Object.values(palette)
                .filter(color => color && color.getRgb().toString() !== dominant)
                .map(color => color.getRgb().toString());
            return { dominant, other };
        });
}

const imageDir = path.join(__dirname, 'assets', 'outfits');

fs.readdir(imageDir, (err, files) => {
    if (err) throw err;

    const promises = files.map(file => {
        const filePath = path.join(imageDir, file);
        return getColors(filePath).then(colors => ({ name: file, colors }));
    });

    Promise.all(promises)
        .then(images => {
            const compatibilityScores: Compatibility[] = [];

            function getCompatibilityScore(image1: { name: string, colors: { dominant: string, other: string[] } }, image2: { name: string, colors: { dominant: string, other: string[] } }): string {
                const dominantMatch = image1.colors.dominant === image2.colors.dominant ? 1 : 0;
                const otherMatches = image1.colors.other.reduce((total, color) => {
                    if (image2.colors.other.includes(color)) {
                        return total + 1;
                    }
                    return total;
                }, 0);
                const totalColors = image1.colors.other.length + 1;
                const compatibility = ((dominantMatch + otherMatches) / totalColors) * 100;
                return `${compatibility.toFixed(0)}%`;
            }

            const startTime = Date.now();

            const totalCombinations = (images.length * (images.length - 1));
            let currentCombination = 0;

            console.log(`Calculating compatibility scores for ${totalCombinations} combinations...`);

            for (let i = 0; i < images.length; i++) {
                const row: Compatibility[] = [];
                for (let j = 0; j < images.length; j++) {
                    if (i !== j) {
                        const compatibility = getCompatibilityScore(images[i], images[j]);
                        row.push({ name1: images[i].name, name2: images[j].name, compatibility });
                        currentCombination++;
                        const percentage = Math.floor((currentCombination / totalCombinations) * 100);
                    }
                }
                compatibilityScores.push(...row);
            }

            const json = JSON.stringify(compatibilityScores);
            fs.writeFile('compatibility.json', json, err => {
                if (err) throw err;
                console.log('\nCompatibility scores written to compatibility.json');
                const endTime = Date.now();
                console.log(`Total time taken: ${endTime - startTime}ms`);
            });
            console.log(compatibilityScores);
        })
        .catch(err => {
            console.error(err);
        });
});