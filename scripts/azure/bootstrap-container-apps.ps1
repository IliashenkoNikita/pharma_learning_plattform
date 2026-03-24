param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory = $true)]
    [string]$Location,

    [Parameter(Mandatory = $true)]
    [string]$ContainerAppsEnvironment,

    [Parameter(Mandatory = $false)]
    [string]$SubscriptionId
)

$ErrorActionPreference = "Stop"

Write-Host "Checking Azure CLI and Container Apps extension..."
az extension add --name containerapp --upgrade | Out-Null

if ($SubscriptionId) {
    Write-Host "Setting Azure subscription $SubscriptionId"
    az account set --subscription $SubscriptionId
}

Write-Host "Ensuring resource group exists..."
az group create --name $ResourceGroup --location $Location | Out-Null

Write-Host "Ensuring Container Apps environment exists..."
$envExists = az containerapp env show --name $ContainerAppsEnvironment --resource-group $ResourceGroup --output none 2>$null
if ($LASTEXITCODE -ne 0) {
    az containerapp env create --name $ContainerAppsEnvironment --resource-group $ResourceGroup --location $Location | Out-Null
    Write-Host "Created Container Apps environment: $ContainerAppsEnvironment"
} else {
    Write-Host "Container Apps environment already exists: $ContainerAppsEnvironment"
}

Write-Host "Bootstrap completed successfully."
Write-Host "Next steps:"
Write-Host "1. Add GitHub repository secrets (see DEPLOYMENT_CONTAINER_APPS.md)."
Write-Host "2. Push to main branch to trigger deployment workflow."
