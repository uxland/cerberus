$repoUrl = "https://github.com/uxland/cerberus"
$branch  = "demo-2"
$folderName = (Split-Path $repoUrl -Leaf).Replace(".git", "")

if(Test-Path $folderName) {
    # Navigate into the directory
    Set-Location -Path $folderName

    # Checkout the desired branch
    git checkout $branch

    # Pull the latest changes
    git pull
} else {
    # Clone the repository if the directory does not exist
    git clone -b $branch $repoUrl

    # Navigate into the directory
    Set-Location -Path $folderName
}
# Check if the Snapshots directory exists

docker-compose down
docker system prune --volumes -af
docker builder prune --all -f
docker-compose -f docker-compose.demo.yml up -d --build