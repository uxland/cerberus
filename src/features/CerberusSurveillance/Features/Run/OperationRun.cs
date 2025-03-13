using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run;

public record OperationRun( string OperationId, string Description , IEnumerable<OperationRunQuestionAnswer> Answers, string? AdditionalComments = null);

public record OperationRunQuestionAnswer(IOperationQuestion Question, IOperationAnswer? Answer = null);


