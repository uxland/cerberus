using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Analysis.Filters;

public partial class Filter: AggregateRoot
{
    public Filter(){}
    public string Description { get; set; }
    
    public string Script { get; set; }
    
}