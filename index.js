const { exec } = require('child_process');

function stringToBool(str) {
    return str.toLowerCase() === 'true';
  }

const run = async () => {
  try {
    const acrName = 'tauruseer';
    const scaImage = 'sca-scanner-pipeline:latest';
    const sastImage = 'sast-scanner-pipeline:latest';

    const acrUsername = process.env.INPUT_USERNAME;
    const acrPassword = process.env.INPUT_PASSWORD;
    const scanKey = process.env.INPUT_SCANKEY;
    const includeSCA = stringToBool(process.env.RUNSCA);
    const includeSAST = stringToBool(process.env.RUNSAST);
    const workspace = process.env.GITHUB_WORKSPACE;

    // Login to ACR
    console.log(`Logging in to ACR: ${acrName}.azurecr.io`);
    await execCommand(`az acr login --name ${acrName} --username ${acrUsername} --password ${acrPassword}`);

    // Check if SCA has been selected
    if (includeSCA) {
        console.log('Pulling the SCA image');
        // Pull the SCA image
        await execCommand(`docker pull ${acrName}.azurecr.io/${scaImage}`);
    
        console.log('Running the SCA scan');
        // Run the SCA image
        await execCommand(`docker run -v ${workspace}:/source ${acrName}.azurecr.io/${scaImage} --scan-key=${scanKey}`);
    }

    // Check if SAST has been selected
    if (includeSAST) {
        console.log('Pulling the SAST image');
        // Pull the SAST image
        await execCommand(`docker pull ${acrName}.azurecr.io/${sastImage}`);
    
        console.log('Running the SAST scan');
        // Run the SAST image
        await execCommand(`docker run -v ${workspace}:/source ${acrName}.azurecr.io/${sastImage} --scan-key=${scanKey}`);
    }

  } catch (error) {
    console.error('Action failed:', error.message);
    process.exit(1);
  }
};

const execCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

run();
