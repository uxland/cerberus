using MediatR;
using Microsoft.Extensions.Logging;

namespace Cerverus.Core.Domain.Behaviours;

public class TransactionMiddleware<TRequest, TResponse>(IUnitOfWork unitOfWork, ILogger<TransactionMiddleware<TRequest, TResponse>> logger) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
{
    private Object? _transactionRequest;

    public Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        return RequiresTransaction() ? RunInTransaction(next, cancellationToken, request) : next();
    }

    private bool RequiresTransaction()
    {
        return this._transactionRequest == null;
    }
    
    private async Task<TResponse> RunInTransaction(RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken, TRequest request)
    {
        logger.LogInformation("TransactionMiddleware: Starting transaction for request {Request}", request);
        this._transactionRequest = request;
        try
        {
            await unitOfWork.BeginTransaction(cancellationToken);
            var response = await next();
            await unitOfWork.Commit(cancellationToken);
            logger.LogInformation("TransactionMiddleware: Transaction committed for request {Request}", request);
            return response;
        }
        catch (Exception e)
        {
            await unitOfWork.Rollback(cancellationToken);
            logger.LogError(e, "TransactionMiddleware: Transaction rolled back for request {Request}", request);
            throw;
        }
        finally
        {
            this._transactionRequest = null;
        }
    }
}
