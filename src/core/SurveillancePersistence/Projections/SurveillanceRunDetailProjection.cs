using Cerberus.Surveillance.Features.Features.Run.Create;
using Marten.Events.Aggregation;
using JasperFx.Events;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceRunDetailProjection : SingleStreamProjection<SurveillanceRunDetail, string>
{
    public SurveillanceRunDetail Create(IEvent<SurveillanceRunCreated> @event)
    {
        var createdEvent = @event.Data;

        return new SurveillanceRunDetail(
            Id: @event.StreamKey!,
            RoundId: createdEvent.RoundId
        );
    }
}

public record SurveillanceRunDetail(
    string Id,
    string RoundId
);



// using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
// using Cerberus.Surveillance.Features.Features.Operation;
// using Cerberus.Surveillance.Features.Features.Run;
// using Cerberus.Surveillance.Features.Features.Run.Create;
// using Cerberus.Surveillance.Features.Features.Run.Get;
// using Marten;
// using Marten.Events;
// using Marten.Events.Aggregation;
// using System.Threading.Tasks;

// namespace Cerberus.Surveillance.Persistence.Projections;

// public class SurveillanceRunDetailProjection : SingleStreamProjection<SurveillanceRunDetail>
// {
//     public async Task<SurveillanceRunDetail> Create(IEvent<SurveillanceRunCreated> @event, IQuerySession querySession)
//     {
//         var createdEvent = @event.Data;

//         // Cargamos información adicional del round asociado
//         var round = await querySession.LoadAsync<SurveillanceRound>(createdEvent.RoundId);

//         // Creamos los detalles básicos de la ejecución
//         return new SurveillanceRunDetail(
//             Id: @event.StreamKey!,
//             RoundId: createdEvent.RoundId,
//             RoundDescription: round?.Description ?? string.Empty,
//             RootLocationId: round?.RootLocationId ?? string.Empty,
//             ExecutorId: string.Empty, // Se completa cuando se inicia la ejecución
//             StartedAt: null,
//             EndedAt: null,
//             Status: RunStatus.Created,
//             InspectionRuns: new List<InspectionRunDetail>() // Inicialmente vacío
//         );
//     }

//     // Puedes agregar métodos adicionales para manejar eventos como:
//     // - RunStarted (cuando se inicia la ejecución)
//     // - InspectionStarted (cuando se inicia una inspección)
//     // - InspectionCompleted (cuando se completa una inspección)
//     // - RunCompleted (cuando se completa la ejecución completa)
//     // Ejemplo:

//     /*
//     public SurveillanceRunDetail Apply(IEvent<RunStarted> @event, SurveillanceRunDetail current)
//     {
//         var startEvent = @event.Data;
//         return current with
//         {
//             ExecutorId = startEvent.ExecutorId,
//             StartedAt = startEvent.StartedAt,
//             Status = RunStatus.InProgress
//         };
//     }
//     */
// }

// // Esta clase representa la proyección de un Run
// public record SurveillanceRunDetail(
//     string Id,
//     string RoundId,
//     string RoundDescription,
//     string RootLocationId,
//     string ExecutorId,
//     NodaTime.Instant? StartedAt,
//     NodaTime.Instant? EndedAt,
//     RunStatus Status,
//     List<InspectionRunDetail> InspectionRuns
// );

// // Esta clase representa la proyección de una inspección dentro de un Run
// public record InspectionRunDetail(
//     string Id,
//     string InspectionId,
//     string CameraId,
//     string CameraDescription,
//     string IpAddress,
//     string OperationId,
//     string OperationDescription,
//     int Order,
//     NodaTime.Instant? StartedAt,
//     NodaTime.Instant? EndedAt,
//     RunStatus Status,
//     List<AnswerDetail> Answers
// );

// // Representación de una respuesta a una operación
// public record AnswerDetail(
//     string QuestionId,
//     string Question,
//     string Answer
// );