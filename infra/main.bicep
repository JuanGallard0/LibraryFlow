targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('Location for SQL Server (some regions have provisioning restrictions)')
param sqlLocation string = 'westus2'

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

module monitoring './core/monitor/monitoring.bicep' = {
  name: 'monitoring'
  scope: rg
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
}

module containerRegistry './core/host/container-registry.bicep' = {
  name: 'container-registry'
  scope: rg
  params: {
    location: location
    tags: tags
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  }
}

module containerAppsEnvironment './core/host/container-apps-environment.bicep' = {
  name: 'container-apps-environment'
  scope: rg
  params: {
    location: location
    tags: tags
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
}

module sqlServer './core/database/sqlserver.bicep' = {
  name: 'sql-server'
  scope: rg
  params: {
    location: sqlLocation
    tags: tags
    name: '${abbrs.sqlServers}${resourceToken}'
    databaseName: 'LibraryFlow'
    sqlAdminLogin: 'sqladmin'
    sqlAdminPassword: sqlAdminPassword
  }
}

module app './app/web.bicep' = {
  name: 'web'
  scope: rg
  params: {
    location: location
    tags: tags
    name: '${abbrs.appContainerApps}web-${resourceToken}'
    containerAppsEnvironmentName: containerAppsEnvironment.outputs.name
    containerRegistryName: containerRegistry.outputs.name
    sqlServerFqdn: sqlServer.outputs.serverFqdn
    sqlDatabaseName: sqlServer.outputs.databaseName
    sqlAdminLogin: sqlServer.outputs.adminLogin
    sqlAdminPassword: sqlAdminPassword
    applicationInsightsConnectionString: monitoring.outputs.applicationInsightsConnectionString
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name
output SERVICE_WEB_NAME string = app.outputs.name
output SERVICE_WEB_URI string = app.outputs.uri
