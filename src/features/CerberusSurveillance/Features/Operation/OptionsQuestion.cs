namespace Cerberus.Surveillance.Features.Features.Operation;

public record OptionsQuestion(
        string Id, 
        string Text, 
        bool IsMandatory, 
        OptionsQuestion.Tipology Type,  
        List<OptionsQuestion.Option> Options,
        IEnumerable<IInstruction>? Instructions = null
    ) : IOperationQuestion
{
    public enum Tipology
    {
        Single,
        Multiple
    }
    public record Option(string Code, string Text, bool IsAnomalous = false, IEnumerable<IInstruction>? Instructions = null);
    
}