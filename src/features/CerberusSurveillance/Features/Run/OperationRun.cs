using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run;

public record OperationRun( string OperationId, string Description , IEnumerable<OperationRunQuestionAnswer> Answers, string? AdditionalComments = null);

public record OperationRunQuestionAnswer(IOperationQuestion Question, IOperationAnswer? Answer = null);
public interface IOperationAnswer
{
    bool IsAnomalous { get; }
}

public record TextAnswer(string Value) : IOperationAnswer{
    public bool IsAnomalous { get; } = false;
}

public record IntegerAnswer(int Value, bool IsAnomalous) : IOperationAnswer;

public record FloatAnswer(double Value, bool IsAnomalous) : IOperationAnswer;

public record OptionAnswerItem(string Code, bool IsAnomalous);

public record OptionAnswer(List<OptionAnswerItem> Values) : IOperationAnswer
{
    public bool IsAnomalous { get; } = Values.Any(x => x.IsAnomalous);
}