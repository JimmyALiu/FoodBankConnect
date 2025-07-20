const { spawn } = require('child_process');
const path = require('path');

// Directly reference the binary file (bypass package exports)
const jestBin = path.resolve('./node_modules/jest/bin/jest.js');

const child = spawn('node', ['--experimental-vm-modules', jestBin, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env,
});

child.on('exit', (code) => process.exit(code));
