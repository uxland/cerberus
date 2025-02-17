using Cerberus.Surveillance.Features.Features.Operation.Create;

namespace Cerberus.Surveillance.Features.Features.Operation;

public partial class SurveillanceOperation
{
   public SurveillanceOperation(CreateOperation cmd)
   {
      this.ApplyUncommittedEvent(
         new SurveillanceOperationCreated(
            cmd.Id!,
            cmd.Name,
            cmd.Questions
         )
      );
   }
   
   public void Apply(SurveillanceOperationCreated @event)
   {
      this.Id = @event.Id;
      this.Description = @event.Description;
      this.Questions = @event.Questions.ToList();
   }
}