using Cerverus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Marten.Events.Aggregation;

namespace Cerverus.BackOffice.Persistence.Projections;

public class HierarchyItemProjection : SingleStreamProjection<HierarchyItem>;