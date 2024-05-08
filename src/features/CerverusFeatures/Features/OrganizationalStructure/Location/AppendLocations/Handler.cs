using Cerverus.Core.Domain;
using Cerverus.Features.Features.Shared;
using MediatR;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

internal sealed class Handler(IRepository<Location> locationRepository, ISender mediator) :
    IRequestHandler<AppendLocations>,
    IRequestHandler<AppendLocation>,
    IRepositoryHandlerMixin<Location>
{
    public async Task Handle(AppendLocations request, CancellationToken cancellationToken)
    {
        var sortedItems = request.Locations.OrderBy(x => x, new AppendLocationCommandSorter(request.Locations)).ToList();
        foreach (var item in sortedItems)
          await   mediator.Send(item, cancellationToken);
    }

    public async Task Handle(AppendLocation request, CancellationToken cancellationToken)
    {
        var path = await this.GetPath(request);
        var location = new Location(request, path);
        await locationRepository.Create(location);
    }
    
    private async Task<string> GetPath(AppendLocation request)
    {
        if(string.IsNullOrEmpty(request.ParentId))
            return request.Id;

        var parent = await this.Rehydrate(request.ParentId);
        return $"{parent.Path}>{request.Id}";
    }
    
    private class AppendLocationCommandSorter(List<AppendLocation> allItems): IComparer<AppendLocation>
    {
        public int Compare(AppendLocation? x, AppendLocation? y)
        {
            if (ReferenceEquals(x, y)) return 0;
            if (ReferenceEquals(null, y)) return 1;
            if (ReferenceEquals(null, x)) return -1;
            if(string.IsNullOrEmpty(x.ParentId)) return -1;
            if(string.IsNullOrEmpty(y.ParentId)) return 1;
            if (x.ParentId == y.ParentId) return 0;
            if(!IsParentInList(x)) return -1;
            if(!IsParentInList(y)) return 1;
            if (x.ParentId == y.Id) return 1;
            if (y.ParentId == x.Id) return -1;
            return 0;
        }
        
        private bool IsParentInList(AppendLocation parent)
        {
            return allItems.Any(x => x.Id == parent.ParentId);
        }
    }

    public IRepository<Location> Repository => locationRepository;
}