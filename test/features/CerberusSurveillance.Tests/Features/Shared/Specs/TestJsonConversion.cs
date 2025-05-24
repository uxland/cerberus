using FluentAssertions;

namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

using System.Text.Json;
using Xunit;

public class SpecJsonConverterTests
{
    private readonly JsonSerializerOptions _options;

    public SpecJsonConverterTests()
    {
        _options = new JsonSerializerOptions
        {
            Converters = { new SpecJsonConverterFactory() },
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    [Fact]
    public void CanSerializeAndDeserialize_NotSpec()
    {
        var originalSpec = new ValueEqualsSpec<string>("test");
        var spec = new NotSpec<string>(originalSpec);
        var json = JsonSerializer.Serialize<Spec<string>>(spec, _options);

        Assert.Contains("\"__type\":\"Not\"", json);

        var deserialized = JsonSerializer.Deserialize<Spec<string>>(json, _options);
        Assert.IsType<NotSpec<string>>(deserialized);
        var notSpec = (NotSpec<string>)deserialized!;
        Assert.Equal("test", ((ValueEqualsSpec<string>)notSpec.Spec!).Value);
    }

    [Fact]
    public void CanSerializeAndDeserialize_AndSpec()
    {
        var spec = new AndSpec<int>(new ValueEqualsSpec<int>(1), new ValueEqualsSpec<int>(2));
        var json = JsonSerializer.Serialize<Spec<int>>(spec, _options);

        Assert.Contains("\"__type\":\"And\"", json);

        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);
        Assert.IsType<AndSpec<int>>(deserialized);
        var andSpec = (AndSpec<int>)deserialized!;
        Assert.Equal(2, andSpec.Specs.Count());
    }

    [Fact]
    public void ThrowsOnUnknownType()
    {
        var json = "{\"__type\":\"Unknown\",\"value\":123}";
        Assert.Throws<JsonException>(() => JsonSerializer.Deserialize<Spec<int>>(json, _options));
    }

    [Fact]
    public void ThrowsOnMissingType()
    {
        var json = "{\"value\":123}";
        Assert.Throws<JsonException>(() => JsonSerializer.Deserialize<Spec<int>>(json, _options));
    }
}


public class SpecSerializationTests
{
    private readonly JsonSerializerOptions _options = new()
    {
        Converters = { new SpecJsonConverterFactory() }
    };

    [Fact]
    public void ValueEquals_String_SerializesCorrectly()
    {
        var spec = new ValueEqualsSpec<string>("test");
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<string>>(json, _options);

        deserialized.Should().BeOfType<ValueEqualsSpec<string>>();
        ((ValueEqualsSpec<string>)deserialized!).Value.Should().Be("test");
    }

    [Fact]
    public void ValueEquals_Integer_SerializesCorrectly()
    {
        var spec = new ValueEqualsSpec<int>(42);
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<ValueEqualsSpec<int>>();
        ((ValueEqualsSpec<int>)deserialized!).Value.Should().Be(42);
    }

    [Fact]
    public void ValueEquals_Double_SerializesCorrectly()
    {
        var spec = new ValueEqualsSpec<double>(42.5);
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<double>>(json, _options);

        deserialized.Should().BeOfType<ValueEqualsSpec<double>>();
        ((ValueEqualsSpec<double>)deserialized!).Value.Should().Be(42.5);
    }

    [Fact]
    public void GreaterThan_Integer_SerializesCorrectly()
    {
        var spec = new ValueGraterThanSpec<int>(42);
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<ValueGraterThanSpec<int>>();
        ((ValueGraterThanSpec<int>)deserialized!).Value.Should().Be(42);
    }

    [Fact]
    public void LowerThan_Integer_SerializesCorrectly()
    {
        var spec = new ValueLowerThanSpec<int>(42);
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<ValueLowerThanSpec<int>>();
        ((ValueLowerThanSpec<int>)deserialized!).Value.Should().Be(42);
    }

    [Fact]
    public void Not_Spec_SerializesCorrectly()
    {
        var innerSpec = new ValueEqualsSpec<string>("test");
        var spec = new NotSpec<string> { Spec = innerSpec };
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<string>>(json, _options);

        deserialized.Should().BeOfType<NotSpec<string>>();
        var notSpec = (NotSpec<string>)deserialized!;
        notSpec.Spec.Should().BeOfType<ValueEqualsSpec<string>>();
        ((ValueEqualsSpec<string>)notSpec.Spec).Value.Should().Be("test");
    }

    [Fact]
    public void And_Spec_SerializesCorrectly()
    {
        var spec1 = new ValueEqualsSpec<int>(42);
        var spec2 = new ValueGraterThanSpec<int>(20);
        var spec = new AndSpec<int> { Specs = new List<Spec<int>> { spec1, spec2 } };
        
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<AndSpec<int>>();
        var andSpec = (AndSpec<int>)deserialized!;
        andSpec.Specs.Should().HaveCount(2);
        andSpec.Specs[0].Should().BeOfType<ValueEqualsSpec<int>>();
        andSpec.Specs[1].Should().BeOfType<ValueGraterThanSpec<int>>();
    }

    [Fact]
    public void Or_Spec_SerializesCorrectly()
    {
        var spec1 = new ValueEqualsSpec<int>(42);
        var spec2 = new ValueGraterThanSpec<int>(20);
        var spec = new OrSpec<int> { Specs = new List<Spec<int>> { spec1, spec2 } };
        
        var json = JsonSerializer.Serialize(spec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<OrSpec<int>>();
        var orSpec = (OrSpec<int>)deserialized!;
        orSpec.Specs.Should().HaveCount(2);
        orSpec.Specs[0].Should().BeOfType<ValueEqualsSpec<int>>();
        orSpec.Specs[1].Should().BeOfType<ValueGraterThanSpec<int>>();
    }

    [Fact]
    public void Complex_Nested_Spec_SerializesCorrectly()
    {
        var equalSpec = new ValueEqualsSpec<int>(42);
        var greaterSpec = new ValueGraterThanSpec<int>(20);
        var orSpec = new OrSpec<int> { Specs = new List<Spec<int>> { equalSpec, greaterSpec } };
        var lowerSpec = new ValueLowerThanSpec<int>(100);
        var andSpec = new AndSpec<int> { Specs = new List<Spec<int>> { orSpec, lowerSpec } };
        var notSpec = new NotSpec<int> { Spec = andSpec };

        var json = JsonSerializer.Serialize(notSpec, _options);
        var deserialized = JsonSerializer.Deserialize<Spec<int>>(json, _options);

        deserialized.Should().BeOfType<NotSpec<int>>();
        var deserializedNotSpec = (NotSpec<int>)deserialized!;
        deserializedNotSpec.Spec.Should().BeOfType<AndSpec<int>>();
        
        var deserializedAndSpec = (AndSpec<int>)deserializedNotSpec.Spec;
        deserializedAndSpec.Specs.Should().HaveCount(2);
        deserializedAndSpec.Specs[0].Should().BeOfType<OrSpec<int>>();
        deserializedAndSpec.Specs[1].Should().BeOfType<ValueLowerThanSpec<int>>();
        
        var deserializedOrSpec = (OrSpec<int>)deserializedAndSpec.Specs[0];
        deserializedOrSpec.Specs.Should().HaveCount(2);
        deserializedOrSpec.Specs[0].Should().BeOfType<ValueEqualsSpec<int>>();
        deserializedOrSpec.Specs[1].Should().BeOfType<ValueGraterThanSpec<int>>();
    }

    [Theory]
    [InlineData("")]
    [InlineData("{}")]
    [InlineData("{\"__type\": \"Unknown\"}")]
    public void Invalid_Json_ThrowsJsonException(string json)
    {
        var act = () => JsonSerializer.Deserialize<Spec<string>>(json, _options);
        act.Should().Throw<JsonException>();
    }
    
}