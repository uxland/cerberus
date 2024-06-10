using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues;

public record MaintenanceIssueEnded(Instant At, string By, MaintenanceIssueStatus Status, string? Comment): IDomainEvent;