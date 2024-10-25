﻿using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;
using Wolverine;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;

public sealed class Handler(HierarchySetupCommandFactory commandFactory, IMessageBus bus) 
{
    public async Task Handle(AppendHierarchyItems request, CancellationToken cancellationToken)
    {
        var sortedItems = request.Items.OrderBy(x => x, new AppendLocationCommandSorter(request.Items))
            .Select(commandFactory.Produce)
            .ToList();
        foreach (var item in sortedItems)
          await bus.InvokeAsync(item, cancellationToken);
    }
    private class AppendLocationCommandSorter(IEnumerable<AppendHierarchyItem> allItems): IComparer<AppendHierarchyItem>
    {
        public int Compare(AppendHierarchyItem? x, AppendHierarchyItem? y)
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
        
        private bool IsParentInList(AppendHierarchyItem parent)
        {
            return allItems.Any(x => x.Id == parent.ParentId);
        }
    }
    
}

public sealed class SetupLocationHandler(
    IGenericRepository locationRepository,
    IHierarchyItemPathProvider pathProvider)
{
    public async Task Handle(SetupLocation request)
    {
        var path = await pathProvider.GetPathAsync(request);
        var location = await locationRepository.Rehydrate<Location>(request.Id);
        if (location == null)
            CreateLocation(request, path);
        else
            UpdateLocation(location, request, path);
    }

    public async Task Handle(CreateLocation command)
    {
        var path = await pathProvider.GetPathAsync(command);
        this.CreateLocation(new SetupLocation(command.Id, command.ParentId, command.Description, command.DefaultCameraAdminSettings, command.DefaultCameraFunctionalSettings), path);
    }

    private void CreateLocation(SetupLocation setupLocation, string path)
    {
        var location = new Location(setupLocation, path);
        locationRepository.Create(location);
    }

    private void UpdateLocation(Location location, SetupLocation setupLocation, string path)
    {
        location.Handle(setupLocation, path);
        locationRepository.Save(location);
    }
}