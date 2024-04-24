using Marten;
using MediatR;
using Moq;
using Weasel.Core;

namespace Cerverus.Core.MartenPersistence;

public class MartenDbFixture: IDisposable
{
    private readonly IDocumentStore _documentStore;
    private readonly Mock<IPublisher> _publisher;
    
    public MartenDbFixture(string connectionString)
    {
        this._publisher = new Mock<IPublisher>();
        this._documentStore = CreateStore(connectionString, this._publisher.Object);
        this.DocumentSession = this._documentStore.LightweightSession();
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

    public IDocumentSession DocumentSession { get; init; }

    public void Dispose()
    {
        this._documentStore.Dispose();
        this.DocumentSession.Dispose();
    }
}