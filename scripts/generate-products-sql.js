
const fs = require('fs');
const path = require('path');

// Mock a minimal environment to read the products file
// Since it's a TS file with imports, we might need a simpler way or just regex it.
// Let's try to extract with regex for simplicity and speed.

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Simple regex to extract objects from the PRODUCTS array
const productsMatch = content.match(/export const PRODUCTS: Product\[\] = \[([\s\S]*?)\];/);
if (!productsMatch) {
    console.error('Could not find PRODUCTS array');
    process.exit(1);
}

const productsRaw = productsMatch[1];
// This is still quite raw. Let's try something more robust: 
// Treat the string as JS and evaluate it in a context if possible, 
// but regex is safer against complex imports.

const entries = [];
const entryRegex = /\{([\s\S]*?)\}/g;
let match;

while ((match = entryRegex.exec(productsRaw)) !== null) {
    const objStr = match[1];
    const obj = {};

    const lines = objStr.split('\n');
    lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let val = parts.slice(1).join(':').trim();

            // Basic cleanup
            val = val.replace(/,$/, '').trim();
            if (val.startsWith("'") || val.startsWith('"')) {
                val = val.substring(1, val.length - 1);
            } else if (val.startsWith('[') && val.endsWith(']')) {
                // Array - keep it as string representation for now or parse
            } else if (!isNaN(parseFloat(val))) {
                val = parseFloat(val);
            }

            obj[key] = val;
        }
    });

    if (obj.id) entries.push(obj);
}

const values = entries.map(p => {
    const id = p.id;
    const name = (p.name || '').replace(/'/g, "''");
    const price = p.priceUSD || 0;
    const desc = (p.description || '').replace(/'/g, "''");
    const cat = (p.category || '').replace(/'/g, "''");
    const img = (p.image || '').replace(/'/g, "''");
    const images = (p.images || '[]').replace(/'/g, '"'); // Supabase array format usually uses {} or we can use bracket syntax for JSON
    const wPrice = p.wholesalePrice || 'NULL';
    const wMin = p.wholesaleMin || 'NULL';
    const colors = (p.colors || '[]').replace(/'/g, '"');

    // Postgres array format: '{val1, val2}'
    const pgImages = images.startsWith('[') ? images.replace('[', '{').replace(']', '}') : `{${img}}`;
    const pgColors = colors.startsWith('[') ? colors.replace('[', '{').replace(']', '}') : '{}';

    return `('${id}', '${name}', ${price}, '${desc}', '${cat}', '${img}', '${pgImages}', ${wPrice}, ${wMin}, '${pgColors}')`;
});

const outputSql = `-- Generated migration for ${entries.length} products\n` +
    `INSERT INTO public.products (id, name, price_usd, description, category, image_url, images, wholesale_price, wholesale_min, colors) VALUES\n` +
    values.join(',\n') + ';';

const outputPath = path.join(__dirname, 'products_migration_full.sql');
fs.writeFileSync(outputPath, outputSql, 'utf8');
console.log(`Success: Migration script generated at ${outputPath}`);
