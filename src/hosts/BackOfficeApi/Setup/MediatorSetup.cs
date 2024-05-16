using Cerverus.Core.Domain;
using Cerverus.Core.Domain.Behaviours;
using Cerverus.Core.MartenPersistence.Behaviours;
using MediatR;

namespace Cerverus.BackOffice.Api.Setup;

public static class MediatorSetup
{
    public static IServiceCollection UseMediator(this IServiceCollection services)
    {
        return services
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(TransactionMiddleware<,>))
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(MetadataBehaviour<,>))
            .AddScoped<MetadataContext>()
            .AddMediatR(op =>
            {
                op.RegisterServicesFromAssemblies(typeof(MediatorSetup).Assembly);
            });
    }
}