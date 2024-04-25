using MediatR;

namespace Cerverus.Core.Domain;

public interface ICommand : IRequest;

public interface ICommand<out TResponse> : ICommand, IRequest<TResponse>;