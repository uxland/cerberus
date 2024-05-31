using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record IssueResolutionStarted(Instant At, string By, MaintenanceIssueStatus Status): IDomainEvent;