/*using System.Text.Json;
using System.Text.Json.JsonDiffPatch;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Operation.Create;
using Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;
using FluentAssertions;

namespace CerberusSurveillance.Tests.Features.Operation.Create;

public class SerializationTest
{
    private const string SerializedCreateOperation =  @"{
    ""id"": ""id"",
    ""description"": ""description"",
    ""questions"": [
        {
            ""__type"": ""Options"",
            ""id"": ""1"",
            ""text"": ""Question1"",
            ""isMandatory"": true,
            ""type"": ""Multiple"",
            ""options"": [
                {
                    ""code"": ""1"",
                    ""text"": ""Answer1"",
                    ""isAnomalous"": false
                },
                {
                    ""code"": ""2"",
                    ""text"": ""Answer2"",
                    ""isAnomalous"": false
                }
            ]
        },
        {
            ""__type"": ""Text"",
            ""id"": ""2"",
            ""text"": ""Question2"",
            ""isMandatory"": false
        },
        {
            ""__type"": ""Float"",
            ""id"": ""3"",
            ""text"": ""Question3"",
            ""isMandatory"": true
        },
        {
            ""__type"": ""Integer"",
            ""id"": ""4"",
            ""text"": ""Question4"",
            ""isMandatory"": false
        }
    ]
}";
    
    private static readonly CreateOperation Command = new CreateOperation("id", "description", new List<IOperationQuestion>
    {
        new OptionsQuestion("1", "Question1",  true, OptionsQuestion.Tipology.Multiple,
            [new("1", "Answer1"), new("2", "Answer2")]),
        new TextQuestion("2", "Question2", false),
        new FloatQuestion("3", "Question3", true),
        new IntegerQuestion("4", "Question4", false),
    });
    private static JsonSerializerOptions CreateJsonSerializerOptions()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreReadOnlyFields = true,
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            TypeInfoResolver = new DefaultJsonTypeInfoResolver().UseOperationJsonTypeInfo()
        };
        options.Converters.Add(new JsonStringEnumConverter());
        return options;
    }
    private static string Serialize(object obj)
    {
        return JsonSerializer.Serialize(obj, CreateJsonSerializerOptions());
    }
    private static CreateOperation Deserialize(string json) =>
        JsonSerializer.Deserialize<CreateOperation>(json, CreateJsonSerializerOptions());

    [Fact]
    public void CreateOperationSerializationTest()
    {
        // Arrange
        var operation = Command;

        // Act
        var json = Serialize(operation);

        
        // Assert
        var diff = JsonDiffPatcher.Diff(SerializedCreateOperation, json);
        diff.Should().BeNull();
    }
    
    [Fact]
    public void CreateOperationDeserializationTest()
    {
        // Arrange
        var json = SerializedCreateOperation;

        // Act
        var actual = Deserialize(json);

        // Assert
        actual.Should().BeEquivalentTo(Command);
    }
    
    [Fact]
    public void SurveillanceOperationCreatedEventSerializationTest()
    {
        // Arrange
        var @event = new SurveillanceOperationCreated(Command.Id!, Command.Description, Command.Questions);

        // Act
        var json = Serialize(@event);

        // Assert
        var diff = JsonDiffPatcher.Diff(SerializedCreateOperation, json);
        diff.Should().BeNull();
    }
    [Fact]
    public void SurveillanceOperationCreatedEventDeSerializationTest()
    {
        // Arrange
        var @event = new SurveillanceOperationCreated(Command.Id!, Command.Description, Command.Questions);
        var json = SerializedCreateOperation;
        

        // Act
        //var json = SerializedCreateOperation;
        var actual = JsonSerializer.Deserialize<SurveillanceOperationCreated>(json, CreateJsonSerializerOptions());

        // Assert
       actual.Should().BeEquivalentTo(@event);
    }
}*/