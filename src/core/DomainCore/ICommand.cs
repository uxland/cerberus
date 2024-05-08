using MediatR;

namespace Cerverus.Core.Domain;

public interface IBaseCommand : IBaseRequest;

public interface ICommand : IRequest, IBaseCommand;

public interface ICommand<out TResponse> : IBaseCommand, IRequest<TResponse>;