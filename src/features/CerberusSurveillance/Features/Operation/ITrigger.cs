using System.Text.Json;

namespace Cerberus.Surveillance.Features.Features.Operation
{
    public interface ITrigger
    {
        string Id { get; }
        JsonElement Condition { get; } // ?
        IEnumerable<OperationAction> Actions { get; }
    }
}