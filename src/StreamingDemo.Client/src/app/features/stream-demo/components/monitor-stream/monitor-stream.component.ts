import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">Stream Monitoring</h5>
      </div>
      <div class="card-body">
        <!-- Performance Metrics -->
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h6>Processing Rate</h6>
                <div class="display-6">
                  {{metrics?.processingRate | number:'1.0-0'}} items/sec
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h6>Memory Usage</h6>
                <div class="display-6">
                  {{metrics?.memoryUsed / 1024 / 1024 | number:'1.1-1'}} MB
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stream Stats -->
        <div class="mt-3">
          <h6>Active Streams</h6>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Stream ID</th>
                  <th>Items Processed</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let stream of activeStreams">
                  <td>{{stream.streamId}}</td>
                  <td>{{stream.itemsProcessed}}</td>
                  <td>{{stream.duration}}</td>
                  <td>
                    <span [class]="getStatusBadgeClass(stream.status)">
                      {{stream.status}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MonitorStreamComponent implements OnDestroy {
  metrics: any;
  activeStreams: any[] = [];
  private subscription?: Subscription;

  constructor(private streamService: StreamService) {
    // Poll metrics every second
    this.subscription = timer(0, 1000).pipe(
      switchMap(() => this.streamService.getStreamMetrics())
    ).subscribe({
      next: (response) => {
        this.metrics = response.metrics;
        this.activeStreams = response.activeStreams;
      },
      error: (error) => console.error('Metrics error:', error)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'badge bg-success';
      case 'completed': return 'badge bg-primary';
      case 'error': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}