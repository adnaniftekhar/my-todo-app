const path = require('path');
console.log("Current working directory:", process.cwd());
console.log("__dirname:", __dirname);
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('Environment variables:', process.env);
