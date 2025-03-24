const fs = require('fs');
const path = require('path');

const files = [
    {
        path: path.join(__dirname, 'blacklistLogs/blacklistuser.json'),
        key: 'blacklistedUsers'
    },
    {
        path: path.join(__dirname, 'blacklistLogs/blacklistserver.json'),
        key: 'blacklistedServers'
    }
];

files.forEach(({ path: filePath, key }) => {
    try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            console.log(`Created ${filePath}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8').trim();
        if (!content) {
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            console.log(`Repaired empty file: ${filePath}`);
            return;
        }

        const parsed = JSON.parse(content);
        if (!parsed[key] || !Array.isArray(parsed[key])) {
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            console.log(`Repaired invalid structure: ${filePath}`);
        } else {
            console.log(`Validated ${filePath}`);
        }
    } catch (error) {
        fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
        console.log(`Repaired corrupted file: ${filePath}`);
    }
});

console.log('Blacklist files validated with proper structure!');