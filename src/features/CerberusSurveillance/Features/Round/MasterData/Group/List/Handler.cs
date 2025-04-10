using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate.MasterData.Group;

namespace Cerberus.Surveillance.Features.Features.Round.MasterData.Group.List;

public static class Handler
{
    public static async Task<List<SurveillanceGroup>> Handle(ListSurveillanceGroups query, IUserGroupProvider userGroupProvider, CancellationToken cancellationToken){
        var groups = await userGroupProvider.ListAllAsync(cancellationToken);
        return groups.Select(g => new SurveillanceGroup(g.Id, g.Description)).ToList();
    }
}