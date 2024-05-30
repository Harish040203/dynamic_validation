const fs = require('fs');
const path = require('path');// Function to recursively search for all files with a given name in a directory
function findAllFiles(dir, fileName) {
    const results = [];
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results.push(...findAllFiles(fullPath, fileName));
        } else if (file === fileName) {
            results.push(fullPath);
        }
    }
    return results;
}
function validation(rootDir) {
    const manifestFiles = findAllFiles(rootDir, 'manifest.js');
    const translationFiles = findAllFiles(rootDir, 'translations.module.json');
    manifestFiles.forEach(manifestPath => {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        const keyRegex = /Page\.content\.getValue\(['"]([^'"]+)['"]\)/g;
        const manifestKeys = [];
        let match;
        while ((match = keyRegex.exec(manifestContent)) !== null) {
            manifestKeys.push(match[1]);
        }
        translationFiles.forEach(translationPath => {
            const translationsContent = fs.readFileSync(translationPath, 'utf8');
            const translationsJson = JSON.parse(translationsContent);
            const translationKeys = new Set(Object.keys(translationsJson));
            const uniqueKeys = manifestKeys.filter(key => !translationKeys.has(key));
            console.log(`Keys only in ${path.relative(rootDir, manifestPath)} when compared to ${path.relative(rootDir, translationPath)}:`);
            uniqueKeys.forEach(key => {
                console.log(`Key: ${key}`);
            });
            console.log('---');
        });
    });
}
const rootDir = 'C:\\Test_FullstackDeveloper'; // Root directory to start the search
validation(rootDir);
