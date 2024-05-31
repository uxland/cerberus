using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record StartIssueResolution(string IssueId): ICommand;