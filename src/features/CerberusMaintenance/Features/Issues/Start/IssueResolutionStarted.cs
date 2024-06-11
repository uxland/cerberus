using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues;

public record IssueResolutionStarted(Instant At, string By, MaintenanceIssueStatus Status): IDomainEvent;