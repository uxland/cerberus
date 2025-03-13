using System.Collections;

namespace Cerberus.Surveillance.Features.Features.Run;


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

