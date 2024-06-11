namespace Cerberus.Core.Domain;

public interface IUnitOfWork
{
    Task Commit(CancellationToken cancellationToken = default);
    Task Rollback(CancellationToken cancellationToken = default);
    
    ValueTask BeginTransaction(CancellationToken cancellationToken = default);
}