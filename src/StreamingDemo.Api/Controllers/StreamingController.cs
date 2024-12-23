using Microsoft.AspNetCore.Mvc;
using StreamingDemo.Api.Infrastructure.AsyncEnumerable;
using StreamingDemo.Api.Models;

namespace StreamingDemo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StreamingController : ControllerBase
{
    private readonly ILogger<StreamingController> _logger;

    public StreamingController(ILogger<StreamingController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Streams a large dataset with configurable batch size and delay
    /// </summary>
    [HttpGet("data")]
    public async IAsyncEnumerable<DataItem> GetDataStream(
        [FromQuery] int totalItems = 10000,
        [FromQuery] int batchSize = 1000,
        [FromQuery] int delayMs = 100,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var items = Enumerable.Range(0, totalItems)
            .Select(i => new DataItem
            {
                Id = i,
                Name = $"Item {i}",
                Value = Random.Shared.NextDouble() * 1000,
                Timestamp = DateTime.UtcNow
            });

        await foreach (var item in items.ToAsyncEnumerable()
            .WithBatchDelay(batchSize, delayMs)
            .WithProgress(count => 
                _logger.LogInformation("Processed {Count} items", count))
            .WithCancellation(cancellationToken))
        {
            yield return item;
        }
    }
}