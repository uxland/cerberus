﻿using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters;


public record CreateFilter(string Id, string Description, string Script, dynamic? DefaultArgs): ICommand;


public record FilterCreated(string Description, string Script, string By, Instant At, dynamic? DefaultArgs): IDomainEvent;

public static class Handler
{
    public static void Handle(CreateFilter createFilter, IGenericRepository repository)
    {
        var filter = new Filter(createFilter, "user", SystemClock.Instance.GetCurrentInstant());
        repository.Create(filter);
    }
}

public partial class Filter : IDomainEventHandler<FilterCreated>
{
    public Filter(CreateFilter command, string user, Instant at)
    {
        this.Id = command.Id;
        this.ApplyUncommittedEvent(new FilterCreated(command.Description, command.Script, user, at, command.DefaultArgs));
    }

    public void Apply(FilterCreated @event)
    {
        this.Script = @event.Script;
        this.Description = @event.Description;
        this.DefaultArgs = @event.DefaultArgs;
    }
}