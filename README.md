# SLS Pipelien Scanner

This GitHub Action runs the SLS SCA and SAST scanner in your pipeline..

## Inputs

| Name            | Description                                                | Required | Default             |
|-----------------|------------------------------------------------------------|----------|---------------------|
| `scanKey`       | The asset identifier found in the asset details page       | Yes      |                     |
| `username`      | Azure Container Registry username.                         | Yes      |                     |
| `password`      | Azure Container Registry password.                         | Yes      |                     |
| `runSCA`        | Specificy if you want to run an SCA scan true or false     | Yes      | true                |
| `runSAST`       | Specificy if you want to run an SAST scan true or false    | Yes      | true                |

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
      uses: actions/checkout@v4

    - name: Pull and Run SLS Scanner
      uses: tauruseer/sls-pipeline-scanner@v1.0.2
      with:
        scanKey: ${{ secrets.SLS_SCAN_KEY }}
        username: ${{ secrets.SLS_CLIENT_ID }}
        password: ${{ secrets.SLS_CLIENT_SECRET }}
        runSCA: 'true'
        runSAST: 'true'
