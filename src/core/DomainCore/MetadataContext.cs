namespace Cerverus.Core.Domain;

public class MetadataContext
{
    public MessageMetadata? MessageMetadata { get; private set; }

    public void Set(MessageMetadata messageMetadata)
    {
        MessageMetadata = messageMetadata;
    }
}