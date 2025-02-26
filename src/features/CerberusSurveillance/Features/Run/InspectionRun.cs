
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public class InspectionRun() : Entity()
{
    public string InspectionId { get; private set; }
    
    public string CameraId { get; private set; }
    
    public Instant? StartedAt { get; private set; }
    
    public Instant? EndedAt { get; private set; }
    
    public RunStatus Status { get; private set; }
    
    public OperationRun OperationRun { get; private set; }
}