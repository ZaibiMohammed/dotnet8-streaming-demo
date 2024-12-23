namespace StreamingDemo.Api.Models;

public record DataItem
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public double Value { get; init; }
    public DateTime Timestamp { get; init; }
}