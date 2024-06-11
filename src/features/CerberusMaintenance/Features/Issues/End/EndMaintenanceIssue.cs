using Domain_ICommand = Cerberus.Core.Domain.ICommand;

namespace Cerberus.Maintenance.Features.Features.Issues;

public record EndMaintenanceIssue(string IssueId, string? Comment = null) : Domain_ICommand;