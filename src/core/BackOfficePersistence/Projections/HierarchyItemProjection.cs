using Cerverus.Features.Features.OrganizationalStructure.ReadModels;
using Marten.Events.Aggregation;

namespace Cerverus.BackOffice.Persistence.Projections;

public class HierarchyItemProjection: SingleStreamProjection<HierarchyItem>{}