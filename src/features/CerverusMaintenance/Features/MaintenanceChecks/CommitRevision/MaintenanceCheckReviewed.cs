using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record MaintenanceCheckReviewed(string ReviewerUser, Instant At): IDomainEvent;