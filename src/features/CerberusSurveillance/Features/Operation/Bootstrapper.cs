using Cerberus.Surveillance.Features.Features.Operation.Create;
using Cerberus.Surveillance.Features.Features.Operation.List;
using Microsoft.AspNetCore.Builder;

namespace Cerberus.Surveillance.Features.Features.Operation;

internal static class Bootstrapper
{
    public static WebApplication SetupOperationRouting(this WebApplication app)
    {
        return app.UseCreateOperation()
            .UseListOperations();
    }
}