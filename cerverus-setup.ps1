$repoUrl = "https://git.jetbrains.space/papanell/cerverus/cerverus.git"
$branch  = "demo"
$folderName = (Split-Path $repoUrl -Leaf).Replace(".git", "")
$snapshotsFolder = "Snapshots"

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
if(-not (Test-Path $snapshotsFolder))
{
    # Create the Snapshots directory
    New-Item -ItemType Directory -Path $snapshotsFolder
}

docker-compose down
$env:BUILD_CONFIGURATION="Release"
docker-compose -f docker-compose.demo.yml up -d --build