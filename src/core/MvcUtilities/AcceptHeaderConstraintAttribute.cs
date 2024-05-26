using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Cerverus.MvcUtilities;

public class AcceptHeaderConstraintAttribute(params string[] mediaType) : Attribute, IActionConstraintFactory
{
    public bool IsReusable => true;

    public IActionConstraint CreateInstance(IServiceProvider services)
    {
        return new AcceptHeaderConstraint(mediaType);
    }
}