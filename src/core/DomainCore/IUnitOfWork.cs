namespace Cerverus.Core.Domain;

public interface IUnitOfWork
{
    Task Commit();
    Task Rollback();
}