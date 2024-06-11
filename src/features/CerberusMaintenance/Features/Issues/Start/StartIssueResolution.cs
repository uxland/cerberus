using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Issues;

public record StartIssueResolution(string IssueId): ICommand;