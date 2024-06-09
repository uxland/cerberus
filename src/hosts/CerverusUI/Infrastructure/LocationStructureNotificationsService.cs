namespace Cerverus.UI.Infrastructure;

public class LocationStructureNotificationsService
{
    public event Action StructureChanged = delegate { };
    
    public void NotifyStructureChanged()
    {
        StructureChanged?.Invoke();
    }
}