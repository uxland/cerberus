using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Cerberus.MvcUtilities;

public class AcceptHeaderConstraint(params string[] mediaTypes) : IActionConstraint
{
    public const string WildcardMediaType = "*/*";
    public int Order => 0;

    public bool Accept(ActionConstraintContext context)
    {
        if (mediaTypes.Contains(WildcardMediaType))
            return true;
        var acceptHeader = context.RouteContext.HttpContext.Request.Headers["Accept"].ToString();
        return mediaTypes.Any(x => acceptHeader.Contains(x, StringComparison.OrdinalIgnoreCase));
    }
}