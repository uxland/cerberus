
using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Round;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class InspectionRun() : Entity()
{
    public string InspectionId { get; private set; }
    
    public string CameraId { get; private set; }
    
    public string CameraStreamingUrl { get; private set; }
    
    public string CameraDescription { get; private set; }
    
    public Instant? StartedAt { get; private set; }
    
    public Instant? EndedAt { get; private set; }
    
    public RunStatus Status { get; private set; }
    
    public OperationRun OperationRun { get; private set; }
    
    public string? ExecutorId { get; private set; }

    
}

