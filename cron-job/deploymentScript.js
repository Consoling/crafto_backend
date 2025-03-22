const { exec } = require('child_process');
const path = require('path');

const projectDir = path.join(__dirname, '../');


const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      } else {
        console.log(`Output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

// Deployment script
const deploy = async () => {
  try {
    console.log('Starting deployment...');

    // Pull the latest changes
    console.log('Pulling latest changes...');
    await runCommand('git pull origin main'); 

    // Install dependencies
    console.log('Installing dependencies...');
    await runCommand('npm install');

   
    // console.log('Running tests...');
    // await runCommand('npm test');

    // Restart the application (e.g., using PM2)
    console.log('Restarting application...');
    await runCommand('pm2 restart index.js'); // Replace 'your-app-name' with your PM2 app name

    console.log('Deployment completed successfully.');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};

module.exports = deploy;