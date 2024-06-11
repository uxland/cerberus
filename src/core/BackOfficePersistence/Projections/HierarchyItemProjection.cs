using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Marten.Events.Aggregation;

namespace Cerberus.BackOffice.Persistence.Projections;

public class HierarchyItemProjection : SingleStreamProjection<HierarchyItem>;