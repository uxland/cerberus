using Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Operation;

public partial class SurveillanceOperation
{
   public SurveillanceOperation(CreateOperation cmd)
   {
      var settings = cmd.Settings;
      this.ApplyUncommittedEvent(
          new SurveillanceOperationCreated(
              Guid.NewGuid().ToString(),
              settings
          )
      );
   }

   public void Handle(UpdateOperation cmd)
   {
      this.ApplyUncommittedEvent(
          new SurveillanceOperationUpdated(this.Id, cmd.Settings));
   }
   public void Apply(SurveillanceOperationCreated @event)
   {
      this.Id = @event.Id;
      this.UpdateSettings(@event.Settings);
   }

   public void Apply(SurveillanceOperationUpdated @event)
   {
      this.UpdateSettings(@event.Settings);
   }

   private void UpdateSettings(OperationSettings settings)
   {
      this.Description = @settings.Description;
      this.Questions = @settings.Questions.ToList();
      
   }
}