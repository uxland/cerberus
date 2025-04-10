using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Run.Claim;
using JasperFx.Core;
using NodaTime;
using UnauthorizedAccessException = Cerberus.Core.Domain.Errors.UnauthorizedAccessException;


namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun: IDomainEventHandler<SurveillanceRunClaimed>
{

    public void Handle(ClaimRun command)
    {
        if(this.ClaimedBy == command.By.Id)
            return;
        this.ValidateCanBeClaimed(command);
        this.ApplyUncommittedEvent(new SurveillanceRunClaimed(this.Id, command.At, command.By.Id));
    }
    
    public void Apply(SurveillanceRunClaimed @event)
    {
        ClaimedAt = @event.At;
        ClaimedBy = @event.By;
    }

    private void ValidateCanBeClaimed(ClaimRun claimRun)
    {
        this.ValidateStatusCanBeClaimed();
        this.ValidateUserIsAllowed(claimRun.By);
        this.ValidateIsNotCurrentlyClaimed(claimRun.At);
    }
    
    private void ValidateStatusCanBeClaimed()
    {
        if (EndedStatuses.Contains(this.Status))
            throw new BusinessException("Run is already released or dismissed or cancelled");
    }
    
    private void ValidateIsNotCurrentlyClaimed(Instant at)
    {
        if (this.ClaimedBy != null && !this.IsClaimExpired(at))
            throw new BusinessException("Run is already claimed and being");
    }

    private bool IsClaimExpired(Instant claimedAt)
    {
        var lastActivity = this.LastActivityAt ?? Instant.MinValue;
        return (claimedAt - lastActivity) > Duration.FromMinutes(30);
    }
    private void ValidateUserIsAllowed(User user)
    {
        if(this.AssignedGroupId.IsEmpty())
            return;
        if(!user.MemberOf.Contains(this.AssignedGroupId))
            throw new UnauthorizedAccessException($"User {user.Id} is not allowed to access this run");
    }
}