using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record TextQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    IEnumerable<IInstruction>? Instructions = null
) : IOperationQuestion;