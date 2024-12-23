import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamChartComponent } from '../stream-chart/stream-chart.component';

@Component({
  selector: 'app-stream-metrics',
  standalone: true,
  imports: [CommonModule, StreamChartComponent],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">Stream Metrics</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Processing Rate Chart -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h6>Processing Rate</h6>
                <app-stream-chart
                  [data]="metrics"
                  type="rate">
                </app-stream-chart>
              </div>
            </div>
          </div>

          <!-- Memory Usage Chart -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h6>Memory Usage</h6>
                <app-stream-chart
                  [data]="metrics"
                  type="memory">
                </app-stream-chart>
              </div>
            </div>
          </div>

          <!-- Items Processed Chart -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h6>Items Processed</h6>
                <app-stream-chart
                  [data]="metrics"
                  type="items">
                </app-stream-chart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StreamMetricsComponent {
  @Input() metrics: any[] = [];
}