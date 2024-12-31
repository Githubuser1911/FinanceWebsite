const { spawn } = require('child_process');

// Path to the Python script
const pythonScriptPath = './totallylegal.py';

// Define the ticker symbol as a parameter (e.g., 'VOO')
const ticker = 'VOO';

// Spawn a Python process and pass the ticker as an argument
const pythonProcess = spawn('python', [pythonScriptPath, ticker]);

// Handle the output from the Python script
pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data.toString()}`);
});

// Handle any error from the Python script
pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data.toString()}`);
});

// Handle process exit
pythonProcess.on('close', (code) => {
    console.log(`Python script finished with code ${code}`);
});
