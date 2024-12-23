import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamService } from '../../services/stream.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Performance Monitor</h5>
        <span class="badge bg-light text-dark">Updated: {{lastUpdate | date:'HH:mm:ss'}}</span>
      </div>
      <div class="card-body">
        <!-- System Metrics -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card bg-light">
              <div class="card-body text-center">
                <h6 class="text-muted">Memory Usage</h6>
                <div class="h3">
                  {{metrics?.memoryUsed / (1024 * 1024) | number:'1.1-1'}} MB
                </div>
                <div class="progress mt-2" style="height: 4px;">
                  <div class="progress-bar" 
                       [style.width.%]="(metrics?.memoryUsed / maxMemory) * 100"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-light">
              <div class="card-body text-center">
                <h6 class="text-muted">Processing Rate</h6>
                <div class="h3">
                  {{metrics?.processRate | number:'1.0-0'}}/sec
                </div>
                <div class="small text-muted">
                  Peak: {{metrics?.peakRate | number:'1.0-0'}}/sec
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-light">
              <div class="card-body text-center">
                <h6 class="text-muted">Active Streams</h6>
                <div class="h3">
                  {{metrics?.activeStreams || 0}}
                </div>
                <div class="small text-muted">
                  Total: {{metrics?.totalStreams || 0}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Graph -->
        <div class="mb-4">
          <h6>Resource Usage</h6>
          <div class="chart-container" style="height: 200px;">
            <canvas #performanceChart></canvas>
          </div>
        </div>

        <!-- Stream History -->
        <h6 class="mb-3">Recent Streams</h6>
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Stream ID</th>
                <th>Items</th>
                <th>Rate</th>
                <th>Memory</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let stream of metrics?.recentStreams">
                <td>{{stream.id.slice(-6)}}</td>
                <td>{{stream.itemCount | number}}</td>
                <td>{{stream.rate | number:'1.0-0'}}/s</td>
                <td>{{stream.memoryMb | number:'1.1-1'}} MB</td>
                <td>{{stream.duration}}s</td>
                <td>
                  <span [class]="getStatusBadge(stream.status)">
                    {{stream.status}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  metrics: any = {};
  lastUpdate = new Date();
  maxMemory = 1024 * 1024 * 1024; // 1GB
  private subscription?: Subscription;

  constructor(private streamService: StreamService) {}

  ngOnInit() {
    this.subscription = timer(0, 1000).pipe(
      switchMap(() => this.streamService.getStreamMetrics())
    ).subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.lastUpdate = new Date();
        this.updateChart();
      },
      error: (error) => console.error('Metrics error:', error)
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getStatusBadge(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'badge bg-success';
      case 'completed': return 'badge bg-primary';
      case 'error': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  private updateChart() {
    // Chart update logic here using Chart.js
  }
}