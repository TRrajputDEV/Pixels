import fs from 'fs'

console.log('🛠️ Building maintenance page...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copy maintenance.html to both index.html and 404.html
const maintenanceContent = fs.readFileSync('public/maintenance.html', 'utf8');
fs.writeFileSync('dist/index.html', maintenanceContent);
fs.writeFileSync('dist/404.html', maintenanceContent);

console.log('✅ Maintenance page ready for deployment!');
