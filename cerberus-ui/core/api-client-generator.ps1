# Define the URL of the Swagger JSON file
$swaggerUrl = "http://localhost:5222/swagger/v1/swagger.json"

# Define the output directory for the generated client
$outputDir = "./generated-client"

# Define the Docker image for the OpenAPI Generator CLI
$openApiGeneratorImage = "openapitools/openapi-generator-cli"

# Download the Swagger JSON file
Invoke-WebRequest -Uri $swaggerUrl -OutFile "./swagger.json"

# Run the OpenAPI Generator CLI in Docker to generate the Axios client
docker run --rm -v ${PWD}:/local $openApiGeneratorImage generate -i /local/swagger.json -g typescript-axios -o /local/$outputDir -p supportsES6=true

# Remove the downloaded Swagger JSON file
Remove-Item -Path "./swagger.json"