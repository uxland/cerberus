using Cerberus.Core.Domain;
using static Cerberus.BackOffice.Features.Captures.Specs.CaptureSpecs;
namespace Cerberus.BackOffice.Features.Captures.ListCameraCaptures;

public static class Handler
{
    public static Task<IReadOnlyList<Capture>> Handle(ListCameraCaptures query, IReadModelQueryProvider readModelQueryProvider) =>
        readModelQueryProvider.List(SuccessfulByCamera(query.CameraId), skip: query.Take, take: query.Take, query.OrderBy);
    
    public static Task<string> Handle(ListCameraCapturesAsJson query, IReadModelQueryProvider readModelQueryProvider) =>
        readModelQueryProvider.ListAsJson(SuccessfulByCamera(query.CameraId), skip: query.Take, take: query.Take, query.OrderBy);   
    
    public static Task<IReadOnlyList<string>> Handle(ListCameraCaptureSnaphsotPaths query, IReadModelQueryProvider readModelQueryProvider) =>
        readModelQueryProvider.ProjectList<Capture, string>(x => x.SnapshotPath!, SuccessfulByCamera(query.CameraId), skip: query.Skip, take: query.Take, orderBy: query.OrderBy);  
    
}