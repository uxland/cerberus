using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.BackOffice.Features.Captures.Specs;




public static class CaptureSpecs
{
    private class CaptureCameraSpecification(string cameraId) : Specification<Capture>
    {
        public override bool IsSatisfiedBy(Capture item) => item.CameraId == cameraId;

        public override Expression<Func<Capture, bool>> ToExpression() => x => x.CameraId == cameraId;
    }
    
    private class SuccessSpecification : Specification<Capture>
    {
        public override bool IsSatisfiedBy(Capture item) => item.Successful;

        public override Expression<Func<Capture, bool>> ToExpression() => x => x.Successful;
    }
    public static Specification<Capture> ByCamera(string cameraId) => new CaptureCameraSpecification(cameraId);
    public static Specification<Capture> Successful => new SuccessSpecification();
    public static Specification<Capture> SuccessfulByCamera(string cameraId) => ByCamera(cameraId).And(Successful);
}