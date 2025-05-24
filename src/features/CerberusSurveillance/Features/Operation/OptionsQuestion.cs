namespace Cerberus.Surveillance.Features.Features.Operation;

public record OptionsQuestion(
        string Id, 
        string Text, 
        bool IsMandatory, 
        OptionsQuestion.Tipology Type,  
        List<OptionsQuestion.Option> Options,
        List<Trigger<string>>? Triggers = null
       ) : IOperationQuestion<string>
{
    public bool IsAnomalous(string value) => Triggers?.Any(x => x.Condition.IsSatisfiedBy(value)) ?? false;
    public enum Tipology
    {
        Single,
        Multiple
    }
    public record Option(string Code, string Text)
    {
        
        //public bool IsAnomalous(OptionsQuestion question) => question.Triggers?.Any(x => x.Condition.IsSatisfiedBy(Code)) ?? false;
    }
}