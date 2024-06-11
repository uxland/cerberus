namespace Cerberus.Core.Domain;

public record MessageMetadata(string Id, string CorrelationId, string CausationId)
{
    public static MessageMetadata Create(string id, string? correlationId = null, string? causationId = null)
    {
        return new MessageMetadata(id, correlationId ?? id, causationId ?? id);
    }
}