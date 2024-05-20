FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["test/core/image-processing/PythonImageProcessor.Tests/PythonImageProcessor.Tests.csproj", "test/core/image-processing/PythonImageProcessor.Tests/"]
COPY ["src/core/image-processing/PythonImageProcessor/PythonImageProcessor.csproj", "src/core/image-processing/PythonImageProcessor/"]
RUN dotnet restore "test/core/image-processing/PythonImageProcessor.Tests/PythonImageProcessor.Tests.csproj"

COPY ["test/core/image-processing/PythonImageProcessor.Tests/*.*", "test/core/image-processing/PythonImageProcessor.Tests/"]
COPY ["src/core/image-processing/PythonImageProcessor/*.*", "src/core/image-processing/PythonImageProcessor/"]

WORKDIR "/src/test/core/image-processing/PythonImageProcessor.Tests"

EXPOSE 4020

ENTRYPOINT ["dotnet", "test", "--no-restore", "--logger:trx"]
