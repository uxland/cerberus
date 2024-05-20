using Cerverus.Core.PythonImageProcessor;
using Microsoft.Extensions.DependencyInjection;

namespace PythonImageProcessor.Tests;

public class PythonScriptRunnerTests
{
    public PythonScriptRunnerTests()
    {
        Console.WriteLine("PythonScriptRunnerTests");
        new ServiceCollection().UsePythonImageProcessor();
    }
    [Fact]
    public void Test1()
    {
        var runner = new PythonScriptRunner();
        // Arrange
        string script = @"
import numpy as np
radians = np.radians(45)
np.sin(radians)
";

        // Act
        var result = runner.CalculateSin(45);

        // Assert
        Assert.False(result);
    }
}