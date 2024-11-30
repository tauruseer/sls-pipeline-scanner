# Azure Container Registry Image Runner

This GitHub Action runs the SLS SCA and SAST scanner in your pipeline..

## Inputs

| Name            | Description                                                | Required | Default             |
|-----------------|------------------------------------------------------------|----------|---------------------|
| `scanKey`       | The asset identifier found in the asset details page       | Yes      |                     |
| `username`      | Azure Container Registry username.                         | Yes      |                     |
| `password`      | Azure Container Registry password.                         | Yes      |                     |
| `runSCA`        | Specificy if you want to run an SCA scan true|false        | Yes      | true                |
| `runSAST`       | Specificy if you want to run an SAST scan true|false       | Yes      | true                |

## Example Usage

```yaml
name: Run SLS Pipeline Scanner

on:
  push:
    branches:
      - main

jobs:
  run-sls-scanner:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Pull and Run SLS Scanner
      uses: start-left-security/sls-scanner-action@v1
      with:
        scanKey: ${{ secrets.SCAN_KEY }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}
        runSCA: 'true'
        runSAST: 'true'
