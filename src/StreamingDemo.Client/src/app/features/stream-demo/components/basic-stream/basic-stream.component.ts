import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-basic-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Basic Stream Demo</h5>
        <span class="badge bg-light text-dark">Items: {{items.length}}</span>
      </div>
      <div class="card-body">
        <!-- Controls -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Total Items</label>
            <input type="number" class="form-control" [(ngModel)]="totalItems" min="100" max="100000">
          </div>
          <div class="col-md-4">
            <label class="form-label">Batch Size</label>
            <input type="number" class="form-control" [(ngModel)]="batchSize" min="10" max="1000">
          </div>
          <div class="col-md-4">
            <label class="form-label">Delay (ms)</label>
            <input type="number" class="form-control" [(ngModel)]="delayMs" min="0" max="1000">
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-primary" (click)="startStream()" [disabled]="loading">
            {{ loading ? 'Streaming...' : 'Start Stream' }}
          </button>
          <button class="btn btn-danger" (click)="stopStream()" [disabled]="!loading">
            Stop Stream
          </button>
          <button class="btn btn-secondary" (click)="clearItems()" [disabled]="loading">
            Clear
          </button>
        </div>

        <!-- Progress -->
        <div *ngIf="loading" class="progress mb-3">
          <div class="progress-bar progress-bar-striped progress-bar-animated" 
               [style.width.%]="(items.length / totalItems) * 100">
            {{items.length}} / {{totalItems}}
          </div>
        </div>

        <!-- Data Display -->
        <div class="table-responsive" style="max-height: 400px;">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.value | number:'1.2-2'}}</td>
                <td>{{item.timestamp | date:'medium'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BasicStreamComponent implements OnDestroy {
  items: any[] = [];
  loading = false;
  totalItems = 1000;
  batchSize = 100;
  delayMs = 100;
  private subscription?: Subscription;

  constructor(private streamService: StreamService) {}

  startStream() {
    this.loading = true;
    this.items = [];

    this.subscription = this.streamService.getBasicStream({
      totalItems: this.totalItems,
      batchSize: this.batchSize,
      delayMs: this.delayMs
    }).subscribe({
      next: (item) => {
        this.items.push(item);
      },
      error: (error) => {
        console.error('Stream error:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  stopStream() {
    this.subscription?.unsubscribe();
    this.loading = false;
  }

  clearItems() {
    this.items = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}