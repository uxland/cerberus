using System.Text;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace Cerverus.IntegrationTest.Utilities.Logger;

public sealed class XUnitLogger<T>(TestOutputHelperAccessor testOutputHelper, LoggerExternalScopeProvider scopeProvider)
    : XUnitLogger(testOutputHelper, scopeProvider, typeof(T).FullName!), ILogger<T>;

public class XUnitLogger(TestOutputHelperAccessor testOutputHelperAccessor, LoggerExternalScopeProvider scopeProvider, string categoryName): ILogger
{
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        var sb = new StringBuilder();
        sb.Append(DateTime.Now.ToLongTimeString());
        sb.Append(' ');
        sb.Append(formatter(state, exception));
        if (exception != null) sb.AppendLine().Append(exception);
        scopeProvider.ForEachScope((scope, builder) =>
        {
            builder.Append("\n => ");
            builder.Append(scope);
        }, sb);

        try
        {
            testOutputHelperAccessor.Output?.WriteLine(sb.ToString());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return logLevel != LogLevel.None;
    }

    public IDisposable BeginScope<TState>(TState state) where TState : notnull
    {
        return scopeProvider.Push(state);
    }
    
    public static ILogger CreateLogger(TestOutputHelperAccessor testOutputHelperAccessor)
    {
        return new XUnitLogger(testOutputHelperAccessor, new LoggerExternalScopeProvider(), string.Empty);
    }
    
    public static ILogger<T> CreateLogger<T>(TestOutputHelperAccessor testOutputHelper)
    {
        return new XUnitLogger<T>(testOutputHelper, new LoggerExternalScopeProvider());
    }

    public static ILogger<T> CreateLogger<T>(ITestOutputHelper testOutputHelper) =>
        CreateLogger<T>(new TestOutputHelperAccessor { Output = testOutputHelper });
}