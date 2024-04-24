using Cerverus.Core.Domain;
using Marten;
using MediatR;

namespace Cerverus.Core.MartenPersistence.Behaviours;

internal class MetadataBehaviour<TRequest, TResponse>(IDocumentSession session, MetadataContext context): IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest
{
    public Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if(context.MessageMetadata != null)
            this.SetMetadata(context.MessageMetadata);
        return next();
    }
    
    private void SetMetadata(MessageMetadata messageMetadata)
    {
        session.CorrelationId = messageMetadata.CorrelationId;
        session.CausationId = messageMetadata.CausationId;
    }
}
