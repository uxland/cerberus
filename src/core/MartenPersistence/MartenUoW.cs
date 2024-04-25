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

    public Task Commit()
    {
        return documentSession.SaveChangesAsync();
    }

    public Task Rollback()
    {
        documentSession.EjectAllPendingChanges();
        return Task.CompletedTask;
    }
}