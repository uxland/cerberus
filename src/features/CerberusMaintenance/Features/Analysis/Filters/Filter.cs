using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters;

public partial class Filter: AggregateRoot
{
    public Filter(){}
    public string Description { get; set; }
    
    public string Script { get; set; }
    
    public dynamic? DefaultArgs { get; set; }
}