const fs = require('fs');
let c = fs.readFileSync('src/data/translations.js', 'utf8');
let idx = c.indexOf("myRequests: 'My Requests'");
if (idx !== -1) {
  c = c.substring(0, idx + 25) + '\n  }\n};\n';
  fs.writeFileSync('src/data/translations.js', c);
  console.log('Fixed translations.js completely.');
} else {
  console.log('Could not find myRequests');
}
