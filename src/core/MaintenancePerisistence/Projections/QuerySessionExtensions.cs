using Cerberus.BackOffice.Features.OrganizationalStructure;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerberus.Maintenance.Persistence.Projections;

internal static class QuerySessionExtensions
{
    public static string GetCameraPathDescription(this IQuerySession querySession, string cameraPath)
    {
        var segments = cameraPath.Split(">").Select((value, index) => new {Value = value, Index = index}).ToList();
        var description = segments.Aggregate("", (current, segment) =>
        {
            
            IOrganizationStructureItem orgItem = segment.Index == segments.Count -1
                ? querySession.LoadAsync<Camera>(segment.Value).Result!
                : querySession.LoadAsync<Location>(segment.Value).Result!;
            return string.IsNullOrEmpty(current) ? orgItem.Description : $"{current}>{orgItem.Description}";
        });
        return description;

    }
}