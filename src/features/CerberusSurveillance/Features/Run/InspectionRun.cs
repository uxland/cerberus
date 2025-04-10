
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class InspectionRun() : Entity()
{
    public string InspectionId { get; set; }
    
    public string CameraId { get; set; }
    
    public string CameraStreamingUrl { get; set; }
    
    public string CameraDescription { get; set; }
    
    public Instant? StartedAt { get; set; }
    
    public Instant? EndedAt { get; set; }
    
    public RunStatus Status { get; set; }
    
    public OperationRun OperationRun { get; set; }
    
    public string? ExecutorId { get; set; }
    
}

