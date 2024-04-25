using Marten;
using MediatR;
using Moq;
using Weasel.Core;

namespace Cerverus.Core.MartenPersistence;

public class MartenDbFixture : IDisposable
{
    private readonly IDocumentStore _documentStore;
    private readonly Mock<IPublisher> _publisher;

    public MartenDbFixture(string connectionString)
    {
        _publisher = new Mock<IPublisher>();
        _documentStore = CreateStore(connectionString, _publisher.Object);
        DocumentSession = _documentStore.LightweightSession();
    }

    public IDocumentSession DocumentSession { get; init; }

    public void Dispose()
    {
        _documentStore.Dispose();
        DocumentSession.Dispose();
    }

    private IDocumentStore CreateStore(string connectionString, IPublisher publisher)
    {
        return DocumentStore.For(options =>
        {
            options.Connection(connectionString);
            options.AutoCreateSchemaObjects = AutoCreate.All;
            options
                .SetupSerialization()
                .ConfigureEventSore();
        });
    }
}