# .NET 8 Streaming Demo

A comprehensive demonstration of streaming capabilities in .NET 8 using IAsyncEnumerable with a real-time monitoring Angular client.

## Features

### Backend (.NET 8)
- Advanced streaming using IAsyncEnumerable
- Real-time performance monitoring
- Memory-efficient data handling
- Configurable batch processing

### Frontend (Angular 17)
- Real-time data visualization
- Performance metrics dashboard
- Interactive streaming controls
- Memory usage monitoring

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js and npm
- Angular CLI (`npm install -g @angular/cli`)

### Running the Backend

1. Navigate to the API project:
```bash
cd src/StreamingDemo.Api
```

2. Run the API:
```bash
dotnet run
```

The API will be available at `https://localhost:7001`

### Running the Frontend

1. Navigate to the client project:
```bash
cd src/StreamingDemo.Client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## Features Demo

### Basic Streaming
- Configurable batch size and delay
- Progress tracking
- Real-time metrics

### Large Dataset Streaming
- Category filtering
- Price range filtering
- Auto-clearing functionality
- Performance statistics

### Performance Monitoring
- Memory usage tracking
- Processing rate visualization
- Active streams monitoring
- Historical data

## Architecture

### Backend Components
- Streaming infrastructure
- Performance monitoring
- Memory management
- Error handling

### Frontend Components
- Real-time charts
- Metrics dashboard
- Notification system
- Stream controls

## Best Practices

1. **Memory Management**:
   - Use appropriate batch sizes
   - Implement auto-clearing
   - Monitor memory usage

2. **Performance**:
   - Configure optimal delays
   - Use efficient filtering
   - Implement backpressure

3. **Error Handling**:
   - Proper cancellation
   - Error notifications
   - Recovery mechanisms

## License

This project is licensed under the MIT License
