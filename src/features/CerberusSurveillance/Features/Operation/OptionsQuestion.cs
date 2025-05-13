namespace Cerberus.Surveillance.Features.Features.Operation;

public record OptionsQuestion(
        string Id, 
        string Text, 
        bool IsMandatory, 
        OptionsQuestion.Tipology Type,  
        List<OptionsQuestion.Option> Options
    
    ) : IOperationQuestion
{
    public enum Tipology
    {
        Single,
        Multiple
    }

    public record Option(string Code, string Text, AnomalousSettings? AnomalousSettings = null)
    {
        public bool IsAnomalous => AnomalousSettings != null;
    }
    
}