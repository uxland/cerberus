using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence;

internal class MartenUoW(IDocumentSession documentSession, IDocumentStore documentStore) : IUnitOfWork, IDisposable
{
    public void Dispose()
    {
        documentSession.Dispose();
        documentStore.Dispose();
    }

    public Task Commit(CancellationToken cancellationToken = default)
    {
        return documentSession.SaveChangesAsync(cancellationToken);
    }

    public Task Rollback(CancellationToken cancellationToken = default)
    {
        documentSession.EjectAllPendingChanges();
        return Task.CompletedTask;
    }

    public ValueTask BeginTransaction(CancellationToken cancellationToken = default)
    {
        return documentSession.BeginTransactionAsync(cancellationToken);
    }
}