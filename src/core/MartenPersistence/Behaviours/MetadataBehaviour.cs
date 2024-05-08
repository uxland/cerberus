using Cerverus.Core.Domain;
using Marten;
using MediatR;

namespace Cerverus.Core.MartenPersistence.Behaviours;

public class MetadataBehaviour<TRequest, TResponse>(IDocumentSession session, MetadataContext context)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : IBaseRequest
{
    public Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (context.MessageMetadata != null)
            SetMetadata(context.MessageMetadata);
        return next();
    }

    private void SetMetadata(MessageMetadata messageMetadata)
    {
        session.CorrelationId = messageMetadata.CorrelationId;
        session.CausationId = messageMetadata.CausationId;
    }
}
