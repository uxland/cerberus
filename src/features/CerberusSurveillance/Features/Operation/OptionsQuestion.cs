using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Http;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record OptionsQuestion(string Id, string Text, bool IsMandatory, OptionsQuestion.Tipology Type,  List<OptionsQuestion.Option> Options) : IOperationQuestion
{
    public enum Tipology
    {
        Single,
        Multiple
    }
    public record Option(string Code, string Text, bool IsAnomalous = false);
    
    public bool IsAnomalousResult(params string[] answers)
    {
        return Options.Any(o => o.IsAnomalous && answers.Contains(o.Code));
    }
}