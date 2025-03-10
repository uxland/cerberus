using System.Text.Json.Serialization.Metadata;
using Cerberus.Core.Domain;
using Cerberus.Core.MartenPersistence;
using Cerberus.Core.MartenPersistence.Repositories;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Operation.Create;
using FluentAssertions;

namespace CerberusSurveillance.Tests.Persistence.Operation;

public class OperationPersistenceTest
{
    private static readonly CreateOperation Command = new CreateOperation("id", "description", new List<IOperationQuestion>
    {
        new OptionsQuestion("1", "Question1",  true, OptionsQuestion.Tipology.Multiple,
            [new("1", "Answer1"), new("2", "Answer2")]),
        new TextQuestion("2", "Question2", false),
        new FloatQuestion("3", "Question3", true),
        new IntegerQuestion("4", "Question4", false),
    });

    private static Task SaveOperation(MartenDbFixture fixture, string id, params object[] domainEvents)
    {
        fixture.DocumentSession.Events.StartStream(id, domainEvents);
        return fixture.DocumentSession.SaveChangesAsync();
    }
    private static IGenericRepository CreateSute(MartenDbFixture fixture)
    {
        return new GenericEventSourcingRepository(fixture.DocumentSession);
    }
    
    private static IJsonTypeInfoResolver InfoResolver = new DefaultJsonTypeInfoResolver().UseOperationJsonTypeInfo();
    
    [Theory]
    [MartenDbAutoData]
    public async Task ShouldRehydrateOperation(MartenDbFixture fixture,
        string id)
    {
        var @event = new SurveillanceOperationCreated(
            id,
            Command.Description,
            Command.Questions);
        await SaveOperation(fixture, id, @event);
        var sut = CreateSute(fixture);
        var actual = await sut.Rehydrate<SurveillanceOperation>(id);
       actual.Description.Should().Be(Command.Description);
       actual.Questions.Should().BeEquivalentTo(Command.Questions);
    }
    
}
