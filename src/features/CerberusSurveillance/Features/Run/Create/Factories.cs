using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Round.List;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

internal static class RunFactories
{
    public static async Task<SurveillanceRun> ProduceRun(this SurveillanceRound round, IGenericRepository repository, Instant plannedAtl)
    {
        var inspections = await Task.WhenAll(round.Inspections.OrderBy(x => x.Order).Select((i, index) => i.ProduceRun(index, repository)));
        return new SurveillanceRun(round.SurveillanceRunId(plannedAtl), round.RootLocationId!, round.Id, round.AssignedGroupId, inspections.ToList(), plannedAtl);
    }

    private static async Task<InspectionRun> ProduceRun(this Inspection inspection, int id, IGenericRepository repository)
    {
        var operationTask = repository.RehydrateOrThrow<SurveillanceOperation>(inspection.OperationId);
        var camera = await repository.RehydrateOrThrow<Camera>(inspection.CameraId);
        var operation = await operationTask;
        return new InspectionRun(id.ToString(), inspection.Id, inspection.CameraId, camera.Description, camera.AdminSettings.IpAddress ?? string.Empty, operation.ProduceRun());
    }

    private static OperationRun ProduceRun(this SurveillanceOperation operation)
    {
        var answers = operation.Questions.Select(q => new OperationRunQuestionAnswer(q));
        return new OperationRun(operation.Id, operation.Description, answers.ToList());
    }
    
    public static string SurveillanceRunId(this SurveillanceRound round, Instant plannedAt) =>
        $"{round.Id}:{plannedAt.ToUnixTimeMilliseconds()}";
    public static string SurveillanceRunId(this SurveillanceRoundSummary round, Instant plannedAt) =>
        $"{round.Id}:{plannedAt.ToUnixTimeMilliseconds()}";
}