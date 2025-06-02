using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection.Parsers;

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
            var answerParser = AnswerParsers[x.Question.GetType()];
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

internal class OptionsAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var optionsQuestion = (OptionsQuestion)question;
        var answer = answers.Answers.TryGetValue(question.Id, out var res) ? res : null;
        var value = answer.ToOptionsAnswer();
        var error = optionsQuestion.ValidateOptions(value);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? optionsQuestion.ToAnswer(value, answer) : null,
            error);
    }
}

internal class FloatAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var floatQuestion = (FloatQuestion)question;
        var answer = answers.Answers.TryGetValue(question.Id, out var res) ? res : null;
        var value = answer.ToFloatAnswer();
        var error = floatQuestion.ValidateFloat(value);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? floatQuestion.ToFloat(value, answer!) : null,
            error);
    }
}

internal class IntegerAnswerParser : IAnswerParser
{
    public AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers)
    {
        var integerQuestion = (IntegerQuestion)question;
        var answer = answers.Answers.TryGetValue(question.Id, out var res) ? res : null;
        var value = answer.ToIntegerAnswer();
        var error = integerQuestion.ValidateInteger(value);
        return new AnswerParserResult(
            string.IsNullOrEmpty(error) ? integerQuestion.ToInteger(value, answer!) : null,
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

    private static OperationActionExecution ToAlternative(OperationAction parentAction, AnswerActionExecution execution)
    {
        var action = parentAction.Alternatives.Single(x => x.Description == execution.Description);
        return new OperationActionExecution(
            execution.Executed,
            execution.Comments,
            action,
            (execution.Alternatives ?? []).Select(al => ToAlternative(action, al)).ToList()
        );
    }

    private static List<OperationActionExecution> GetAnswerActions<T>(IOperationQuestion<T> question, Answer? answer)
    {
        if (answer == null || answer.Actions == null || question.Triggers == null)
            return [];
        return (answer.Actions ?? []).Select(a =>
            {
                var action = (question.Triggers ?? []).SelectMany(t => t.Actions)
                    .Single(x => x.Description == a.Description);
                return new OperationActionExecution(
                    a.Executed,
                    a.Comments,
                    action,
                    (a.Alternatives ?? []).Select(al => ToAlternative(action, al)).ToList()
                );
            }
        ).ToList();
    }

    internal static OperationRunQuestionAnswer? ToAnswer(this OptionsQuestion question, List<string> codes,
        Answer? answer)
    {
        if (codes.Count == 0) return null;
        var actions = GetAnswerActions(question, answer);
        return new OperationRunQuestionAnswer(question, new OptionAnswer(
            codes.Select(key => new OptionAnswerItem(key, question.IsAnomalous(key), actions))
                .ToList()
        ));
    }

    internal static string? ValidateText(this TextQuestion question, string value)
    {
        if (question.IsMandatory && string.IsNullOrWhiteSpace(value))
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToText(this TextQuestion question, string? value, Answer? answer)
    {
        return value == null
            ? null
            : new OperationRunQuestionAnswer(question,
                new TextAnswer(value, question.IsAnomalous(value), GetAnswerActions(question, answer)));
    }

    internal static string? ValidateInteger(this IntegerQuestion question, int? value)
    {
        if (question.IsMandatory && !value.HasValue)
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToInteger(this IntegerQuestion question, int? value, Answer? answer)
    {
        return value == null
            ? null
            : new OperationRunQuestionAnswer(question,
                new IntegerAnswer(value.Value, question.IsAnomalous(value.Value), GetAnswerActions(question, answer)));
    }

    internal static string? ValidateFloat(this FloatQuestion question, double? value)
    {
        if (question.IsMandatory && !value.HasValue)
            return $"Question {question.Text} is mandatory";
        return null;
    }

    internal static OperationRunQuestionAnswer? ToFloat(this FloatQuestion question, double? value, Answer? answer)
    {
        return value == null
            ? null
            : new OperationRunQuestionAnswer(question,
                new FloatAnswer(value.Value, question.IsAnomalous(value.Value), GetAnswerActions(question, answer)));
    }
}