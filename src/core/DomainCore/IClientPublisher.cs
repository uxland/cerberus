namespace Cerberus.Core.Domain;

public interface IClientPublisher
{
    Task PublishAsync<T>(string group, string topic, T message);
}