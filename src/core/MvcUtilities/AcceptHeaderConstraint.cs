using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Cerverus.MvcUtilities;

public class AcceptHeaderConstraint(string mediaType) : IActionConstraint
{
    public int Order => 0;

    public bool Accept(ActionConstraintContext context)
    {
        var acceptHeader = context.RouteContext.HttpContext.Request.Headers["Accept"].ToString();
        return acceptHeader.Contains(mediaType, StringComparison.OrdinalIgnoreCase);
    }
}