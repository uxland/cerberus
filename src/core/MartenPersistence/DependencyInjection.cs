using System.Text.Json.Serialization.Metadata;
using Cerberus.Core.Domain;
using Cerberus.Core.MartenPersistence.QueryProviders;
using Cerberus.Core.MartenPersistence.Repositories;
using Marten;
using Marten.Events;
using Marten.Events.Daemon.Resiliency;
using Marten.NodaTimePlugin;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Weasel.Core;
using Wolverine.Marten;

namespace Cerberus.Core.MartenPersistence;

public static class DependencyInjection
{
    public static MartenServiceCollectionExtensions.MartenConfigurationExpression UseMartenPersistence(this IServiceCollection services,
        IConfiguration configuration, IHostEnvironment environment, IJsonTypeInfoResolver? jsonTypeInfoResolver = null)
    {
        var result = services
            .AddMartenDb(configuration, environment, jsonTypeInfoResolver);
        services
            .AddScoped<IUnitOfWork, MartenUoW>()
            .AddScoped<IReadModelQueryProvider, ReadModelQueryProvider>()
            .AddScoped<IGenericRepository, GenericEventSourcingRepository>();
        return result;
    }

    private static MartenServiceCollectionExtensions.MartenConfigurationExpression AddMartenDb(this IServiceCollection services, IConfiguration configuration,
        IHostEnvironment environment, IJsonTypeInfoResolver? jsonTypeInfoResolver = null)
    {
        return services.AddMarten(options =>
            {
                options.Connection(configuration.GetSection("Backends:PostgresQL:Marten").Value!);
                if (!environment.IsProduction())
                    options.AutoCreateSchemaObjects = AutoCreate.All;
                options
                    .SetupSerialization(jsonTypeInfoResolver)
                    .ConfigureEventSore()
                    .ConfigureMetadata()
                    .UseNodaTime();
            })
            .IntegrateWithWolverine()
            .UseIdentitySessions()
            .AddAsyncDaemon(DaemonMode.HotCold);
    }

    internal static StoreOptions SetupSerialization(this StoreOptions options, IJsonTypeInfoResolver? jsonTypeInfoResolver = null)
    {
        options.UseSystemTextJsonForSerialization(
            EnumStorage.AsString,
            Casing.CamelCase,
            serializerOptions =>
            {
                serializerOptions.IgnoreReadOnlyFields = true;
                serializerOptions.IgnoreReadOnlyProperties = false;
                serializerOptions.WriteIndented = true;
                serializerOptions.TypeInfoResolver = jsonTypeInfoResolver;
                
            }
        );
        return options;
    }

    internal static StoreOptions ConfigureEventSore(this StoreOptions options)
    {
        options.DatabaseSchemaName = "read_model";
        options.Events.DatabaseSchemaName = "event_store";
        options.Events.StreamIdentity = StreamIdentity.AsString;
        options.Events.UseIdentityMapForAggregates = true;
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