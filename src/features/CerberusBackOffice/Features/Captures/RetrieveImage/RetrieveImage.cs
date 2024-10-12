using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.RetrieveImage;

public record RetrieveImage(string FilePath): IQuery<byte[]>;

public record RetrieveImageAsBase64(string CaptureId): IQuery<string>;