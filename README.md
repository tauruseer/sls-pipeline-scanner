# SLS Pipeline Scanner

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
# Name of this GitHub Actions workflow.
name: Start Left Security Pipeline Scan

on:
on:
  # Scan on-demand through GitHub Actions interface:
  workflow_dispatch: {}
  # Scan mainline branches and report all findings:
  #push:
    #branches: ["master", "main"]
  # Schedule the CI job (this method uses cron syntax):
  #schedule:
    #- cron: '20 23 * * 1' # Sets schedule to scan every Monday at 23:20 UTC.
    # It is recommended to change the schedule to a random time.

jobs:
  run-sls-scanner:
    runs-on: ubuntu-latest

    # Skip any PR created by dependabot to avoid permission issues:
    if: (github.actor != 'dependabot[bot]')

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Pull and Run SLS Scanner
      uses: tauruseer/sls-pipeline-scanner@v1.1.0
      with:
        scanKey: ${{ secrets.SLS_SCAN_KEY }}
        username: ${{ secrets.SLS_CLIENT_ID }}
        password: ${{ secrets.SLS_CLIENT_SECRET }}
        runSCA: 'true'
        runSAST: 'true'
