using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection.Parsers;

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