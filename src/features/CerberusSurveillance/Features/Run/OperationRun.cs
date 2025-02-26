namespace Cerberus.Surveillance.Features.Features.Run;

public class OperationRun
{
    public string OperationId { get; private set; }
    
    public List<IAnswer> Answers{get; private set;}
}