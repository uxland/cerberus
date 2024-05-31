using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record MaintenanceIssueEnded(string MaintenanceProcessId, Instant At, string By, MaintenanceIssueStatus Status, string? Comment): IDomainEvent;