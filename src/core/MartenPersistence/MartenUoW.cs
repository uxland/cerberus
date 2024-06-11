﻿using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.Core.MartenPersistence;

public class MartenUoW(IDocumentSession documentSession) : IUnitOfWork, IDisposable
{
    public void Dispose()
    {
        documentSession.Dispose();
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