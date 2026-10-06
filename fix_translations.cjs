const fs = require('fs');
let c = fs.readFileSync('src/data/translations.js', 'utf8');
c = c.replace(/    ([0-9][a-zA-Z0-9]*):/g, '    "$1":');
c = c.replace(/    ([^A-Za-z0-9"'\s][a-zA-Z0-9_]*):/g, '    "$1":'); // Catch anything weird
fs.writeFileSync('src/data/translations.js', c);
console.log('Fixed translations.js');
