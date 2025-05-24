
using System.Text.Json.Serialization;
using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Shared.Specs;

namespace Cerberus.Surveillance.Features.Features.Operation;

public class Trigger<T>(
    string id,
    Spec<T> condition,
    List<OperationAction> actions): Entity(id)
{
   // [JsonConverter(typeof(SpecJsonConverter<T>))]
    public Spec<T> Condition { get; } = condition;
    public List<OperationAction> Actions { get; } = actions;
}
