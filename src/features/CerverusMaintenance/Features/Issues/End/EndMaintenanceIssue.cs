using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record EndMaintenanceIssue(string IssueId, string? Comment) : ICommand; 
