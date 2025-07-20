import fs from 'fs';
import path from 'path';

function rewriteImportsToJs(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            rewriteImportsToJs(fullPath);
        } else if (entry.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Matches all relative imports starting with ./ or ../
            // Does NOT touch bare module imports (e.g., "express")
            content = content.replace(
                /from\s+["'](\.\/[^"']+|\.{2}\/[^"']+)["']/g,
                (match, importPath) => {
                    // Only add .js if there's no extension already
                    if (!path.extname(importPath)) {
                        return match.replace(importPath, `${importPath}.js`);
                    }
                    return match;
                }
            );

            fs.writeFileSync(fullPath, content);
        }
    }
}

// Adjust this path to your output directory
rewriteImportsToJs('./build');
