using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation;

public partial class SurveillanceOperation: AggregateRoot
{
    public SurveillanceOperation(): base()
    {
    }
    public string Description { get; set; }
    
    public List<IOperationQuestion> Questions { get; set; }
    
}