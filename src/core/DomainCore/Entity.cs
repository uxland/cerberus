namespace Cerberus.Core.Domain;

public abstract class Entity: IEntity
{
    protected Entity()
    {
    }

    protected Entity(string id)
    {
        Id = id;
    }

    public string Id { get; set;}

    public bool Transient => string.IsNullOrEmpty(this.Id);

    public override bool Equals(object? obj)
    {
        if (Transient)
            return false;
        var other = obj as Entity;
        return Equals(other);
    }

    private bool Equals(Entity? other)
    {
        if (other is null)
            return false;
        if (other.GetType() != GetType())
            return false;
        return other.Id == Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}