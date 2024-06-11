using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters;


public record CreateFilter(string Id, string Description, string Scripot): ICommand;


public record FilterCreated(string Description, string Script, string By, Instant At): IDomainEvent;

public static class Handler
{
    public static async Task Handle(CreateFilter createFilter, IGenericRepository repository)
    {
        var filter = new Filter(createFilter, "user", SystemClock.Instance.GetCurrentInstant());
        await repository.Create(filter);
    }
}

public partial class Filter : IDomainEventHandler<FilterCreated>
{
    public Filter(CreateFilter command, string user, Instant at)
    {
        this.Id = command.Id;
        this.ApplyUncommittedEvent(new FilterCreated(command.Description, command.Scripot, user, at));
    }

    public void Apply(FilterCreated @event)
    {
        this.Script = @event.Script;
        this.Description = @event.Description;
    }
}