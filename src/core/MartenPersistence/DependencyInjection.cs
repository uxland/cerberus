using Cerverus.Core.Domain;
using Marten;
using Marten.Events;
using Marten.Events.Daemon.Resiliency;
using Marten.NodaTimePlugin;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Weasel.Core;
using Wolverine.Marten;

namespace Cerverus.Core.MartenPersistence;

public static class DependencyInjection
{
    public static IServiceCollection UseMartenPersistence(this IServiceCollection services,
        IConfiguration configuration, IHostEnvironment environment, Action<StoreOptions> configure)
    {
        return services
            .AddMartenDb(configuration, environment, configure)
            .AddScoped<IUnitOfWork, MartenUoW>();
    }

    private static IServiceCollection AddMartenDb(this IServiceCollection services, IConfiguration configuration,
        IHostEnvironment environment, Action<StoreOptions> configure)
    {
        services.AddMarten(options =>
            {
                options.Connection(configuration.GetSection("Backends:PostgresQL:Marten").Value);
                if (!environment.IsProduction())
                    options.AutoCreateSchemaObjects = AutoCreate.All;
                options
                    .SetupSerialization()
                    .ConfigureEventSore()
                    .ConfigureMetadata()
                    .UseNodaTime();

                configure(options);
            })
            .IntegrateWithWolverine()
            .UseIdentitySessions()
            .AddAsyncDaemon(DaemonMode.Solo);
        return services;
    }

    internal static StoreOptions SetupSerialization(this StoreOptions options)
    {
        options.UseSystemTextJsonForSerialization(
            EnumStorage.AsString,
            Casing.CamelCase,
            serializerOptions =>
            {
                serializerOptions.IgnoreReadOnlyFields = true;
                serializerOptions.IgnoreReadOnlyProperties = false;
            }
        );
        return options;
    }

    internal static StoreOptions ConfigureEventSore(this StoreOptions options)
    {
        options.Events.StreamIdentity = StreamIdentity.AsString;
        return options;
    }

    private static StoreOptions ConfigureMetadata(this StoreOptions options)
    {
        options.Events.MetadataConfig.EnableAll();
        options.Policies.ForAllDocuments(x =>
        {
            x.Metadata.CorrelationId.Enabled = true;
            x.Metadata.CausationId.Enabled = true;
        });
        return options;
    }
}