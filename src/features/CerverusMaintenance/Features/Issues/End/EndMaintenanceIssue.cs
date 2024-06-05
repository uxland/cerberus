using ICommand = Cerverus.Core.Domain.ICommand;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record EndMaintenanceIssue(string IssueId, string? Comment = null) : ICommand;