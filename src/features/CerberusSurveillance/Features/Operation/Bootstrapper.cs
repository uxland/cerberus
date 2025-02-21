using Cerberus.Surveillance.Features.Features.Operation.Create;
using Cerberus.Surveillance.Features.Features.Operation.Get;
using Cerberus.Surveillance.Features.Features.Operation.List;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Operation;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupOperationRouting(this RouteGroupBuilder app)
    {
        var operationsGroup = app.MapGroup("/operations");
        operationsGroup.UseCreateOperation()
            .UseListOperations()
            .UseGetOperation();
        return app;
    }
}