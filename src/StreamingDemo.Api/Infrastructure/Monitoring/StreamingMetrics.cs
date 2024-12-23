namespace StreamingDemo.Api.Infrastructure.Monitoring;

public record StreamingMetrics
{
    public string StreamId { get; init; } = string.Empty;
    public DateTime StartTime { get; init; }
    public DateTime? EndTime { get; init; }
    public int ItemsProcessed { get; init; }
    public double ProcessingRate { get; init; }
    public long MemoryUsed { get; init; }
    public TimeSpan Duration => EndTime?.Subtract(StartTime) ?? TimeSpan.Zero;
}