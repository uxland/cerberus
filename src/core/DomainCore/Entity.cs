namespace Cerverus.Core.Domain;

public abstract class Entity
{
    protected Entity()
    {
    }

    protected Entity(Guid id)
    {
        Id = id;
    }
    public Guid Id { get; }
    
    public bool Transient => Id == default;

    public override bool Equals(object? obj)
    {
        if(Transient)
            return false;
        var other = obj as Entity;
       return Equals(other);
    }

    private bool Equals(Entity? other)
    {
        if(other is null)
            return false;
        if(other.GetType() != this.GetType())
            return false;
        return other.Id == Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}