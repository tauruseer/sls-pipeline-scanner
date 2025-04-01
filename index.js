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
    const includeSCA = stringToBool(process.env.INPUT_RUNSCA);
    const includeSAST = stringToBool(process.env.INPUT_RUNSAST);
    const includeGitLeaks = stringToBool(process.env.INPUT_RUNGITLEAKS);
    const workspace = process.env.GITHUB_WORKSPACE;
    const repository = process.env.GITHUB_REPOSITORY;
    const branch = process.env.GITHUB_REF;

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
      await execCommand(`docker run -v ${workspace}:/source ${acrName}.azurecr.io/${scaImage} --scan-key=${scanKey} --repo${repository} --branch=${branch}`);
    }

    // Check if SAST has been selected
    if (includeSAST) {
      console.log('Pulling the SAST image');
      // Pull the SAST image
      await execCommand(`docker pull ${acrName}.azurecr.io/${sastImage}`);

      console.log('Running the SAST scan');
      if (includeGitLeaks) {
        console.log('     - Using the GitLeaks rules');
        await execCommand(`docker run -v ${workspace}:/source ${acrName}.azurecr.io/${sastImage} --scan-key=${scanKey} --secrets=yes --repo${repository} --branch=${branch}`);
      }
      else {
        // Run the SAST image
        await execCommand(`docker run -v ${workspace}:/source ${acrName}.azurecr.io/${sastImage} --scan-key=${scanKey} --repo${repository} --branch=${branch}`);
      }
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
