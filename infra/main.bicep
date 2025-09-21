param location string = resourceGroup().location
param appServiceName string = 'ab-uom-backend'
param containerRegistryName string = 'abuomacr'
param appServicePlanName string = 'ab-uom-plan'
param imageName string = 'abuom/backend:latest' // Update with your image

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {}
}

resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${containerRegistry.loginServer}/${imageName}'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${containerRegistry.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'WEBSITES_PORT'
          value: '80'
        }
        // Add your environment variables here
        {
          name: 'MongoDBSettings__ConnectionString'
          value: 'your-mongo-connection-string'
        }
        {
          name: 'MongoDBSettings__DatabaseName'
          value: 'your-db-name'
        }
        {
          name: 'JwtSettings__Key'
          value: 'your-jwt-key'
        }
      ]
    }
  }
  dependsOn: [
    containerRegistry
    appServicePlan
  ]
}
