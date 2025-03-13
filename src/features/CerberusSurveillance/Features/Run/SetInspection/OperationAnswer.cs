using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

internal static class OperationAnswer
{
    private static readonly Dictionary<Type, IAnswerParser> AnswerParsers = new()
    {
        { typeof(OptionsQuestion), new OptionsAnswerParser() },
        { typeof(TextQuestion), new TextAnswerParser() },
        { typeof(FloatQuestion), new FloatAnswerParser() },
        { typeof(IntegerQuestion), new IntegerAnswerParser() }
    };

    public static SetAnswersResult ParseAnswers(this OperationRun self, RunInspectionAnswers answers)
    {
        var parseResult = self.Answers.Select(x =>
        {
            var answerParser = AnswerParsers[x.GetType()];
            return answerParser.ParseQuestionAnswer(x.Question, answers);
        }).ToList();
        var error = string.Join(Environment.NewLine,
            parseResult.Select(x => x.Error).Where(x => !string.IsNullOrEmpty(x)));
        if (!string.IsNullOrEmpty(error)) return new SetAnswersResult(false, error, self);
        var operationRun = self with
        {
            AdditionalComments = answers.AdditionalComments,
            Answers = parseResult.Select(x => x.Answer).Where(x => x != null).ToList()
        };
        return new SetAnswersResult(true, null, operationRun);
    }

    internal record SetAnswersResult(bool Success, string? Error, OperationRun? Result);
}

internal record AnswerParserResult(OperationRunQuestionAnswer? Answer, string? Error);

internal interface IAnswerParser
{
    AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers);
}

internal class OptionsAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var optionsQuestion = (OptionsQuestion)question;
        var answer = (answers.Answers.TryGetValue(question.Id, out var res) ? res : null).ToOptionsAnswer();
        var error = optionsQuestion.ValidateOptions(answer);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? optionsQuestion.ToAnswer(answer) : null,
            error);
    }
}

internal class TextAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var textQuestion = (TextQuestion)question;
        var answer = (answers.Answers.TryGetValue(question.Id, out var res) ? res : null).ToTextAnswer();
        var error = textQuestion.ValidateText(answer);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? textQuestion.ToText(answer) : null,
            error);
    }
}

internal class FloatAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var floatQuestion = (FloatQuestion)question;
        var answer = (answers.Answers.TryGetValue(question.Id, out var res) ? res : null).ToFloatAnswer();
        var error = floatQuestion.ValidateFloat(answer);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? floatQuestion.ToFloat(answer) : null,
            error);
    }
}

internal class IntegerAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var integerQuestion = (IntegerQuestion)question;
        var answer = (answers.Answers.TryGetValue(question.Id, out var res) ? res : null).ToIntegerAnswer();
        var error = integerQuestion.ValidateInteger(answer);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? integerQuestion.ToInteger(answer) : null,
            error);
    }
}

internal static class AnswerUtilitiesExtensions
{
    internal static string? ValidateOptions(this OptionsQuestion question, List<string> values)
    {
        if (question.IsMandatory && values.Count == 0)
            return $"Question {question.Text} is mandatory";
        if (question.Type == OptionsQuestion.Tipology.Single && values.Count > 1)
            return $"Question {question.Text} is single choice";
        //Check if all values are valid
        return values.Any(v => question.Options.All(o => o.Code != v))
            ? $"Invalid values for question {question.Text}"
            : null;
    }

    internal static OperationRunQuestionAnswer? ToAnswer(this OptionsQuestion question, List<string> codes)
    {
        if (codes.Count == 0) return null;
        return new OperationRunQuestionAnswer(question, new OptionAnswer(
            codes.Select(key => new OptionAnswerItem(key, question.Options.Single(o => o.Code == key).IsAnomalous))
                .ToList()
        ));
    }

    internal static string? ValidateText(this TextQuestion question, string value)
    {
        if (question.IsMandatory && string.IsNullOrWhiteSpace(value))
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToText(this TextQuestion question, string? value)
    {
        return value == null ? null : new OperationRunQuestionAnswer(question, new TextAnswer(value));
    }

    internal static string? ValidateInteger(this IntegerQuestion question, int? value)
    {
        if (question.IsMandatory && !value.HasValue)
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToInteger(this IntegerQuestion question, int? value)
    {
        return value == null
            ? null
            : new OperationRunQuestionAnswer(question,
                new IntegerAnswer(value.Value, question.IsAnomalous(value.Value)));
    }

    internal static string? ValidateFloat(this FloatQuestion question, double? value)
    {
        if (question.IsMandatory && !value.HasValue)
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToFloat(this FloatQuestion question, double? value)
    {
        return value == null
            ? null
            : new OperationRunQuestionAnswer(question, new FloatAnswer(value.Value, question.IsAnomalous(value.Value)));
    }
}