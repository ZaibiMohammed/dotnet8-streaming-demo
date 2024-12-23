import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicStreamComponent } from '../../components/basic-stream/basic-stream.component';
import { LargeDataStreamComponent } from '../../components/large-data-stream/large-data-stream.component';
import { PerformanceMonitorComponent } from '../../components/performance-monitor/performance-monitor.component';

@Component({
  selector: 'app-stream-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BasicStreamComponent,
    LargeDataStreamComponent,
    PerformanceMonitorComponent
  ],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">.NET 8 Streaming Demo</h1>

      <div class="row g-4">
        <!-- Performance Monitor -->
        <div class="col-12">
          <app-performance-monitor></app-performance-monitor>
        </div>

        <!-- Stream Demos -->
        <div class="col-md-6">
          <app-basic-stream></app-basic-stream>
        </div>
        <div class="col-md-6">
          <app-large-data-stream></app-large-data-stream>
        </div>
      </div>
    </div>
  `
})
export class StreamDashboardComponent {}
