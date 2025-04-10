using Cerberus.Surveillance.Features.Features.Operation.List;
using Marten.Events.Aggregation;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceOperationSummaryProjection : SingleStreamProjection<SurveillanceOperationSummary>;