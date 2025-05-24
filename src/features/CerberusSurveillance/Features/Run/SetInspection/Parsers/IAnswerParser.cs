using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection.Parsers;

internal interface IAnswerParser
{
    AnswerParserResult ParseQuestionAnswer(IOperationQuestion question, RunInspectionAnswers answers);
}