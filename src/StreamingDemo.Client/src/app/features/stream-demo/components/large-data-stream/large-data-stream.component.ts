import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-large-data-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Large Dataset Stream</h5>
        <div>
          <span class="badge bg-light text-dark me-2">Rate: {{processRate | number:'1.0-0'}}/sec</span>
          <span class="badge bg-light text-dark">Items: {{items.length}}</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Controls -->
        <div class="row mb-3">
          <div class="col-md-3">
            <label class="form-label">Total Items</label>
            <input type="number" class="form-control" [(ngModel)]="totalItems" min="1000" max="1000000">
          </div>
          <div class="col-md-3">
            <label class="form-label">Category</label>
            <select class="form-select" [(ngModel)]="selectedCategory">
              <option value="">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Min Price</label>
            <input type="number" class="form-control" [(ngModel)]="minPrice">
          </div>
          <div class="col-md-3">
            <label class="form-label">Max Price</label>
            <input type="number" class="form-control" [(ngModel)]="maxPrice">
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Batch Size</label>
            <input type="number" class="form-control" [(ngModel)]="batchSize" min="100" max="10000">
          </div>
          <div class="col-md-4">
            <label class="form-label">Delay (ms)</label>
            <input type="number" class="form-control" [(ngModel)]="delayMs" min="0" max="1000">
          </div>
          <div class="col-md-4">
            <label class="form-label">Auto Clear (items)</label>
            <input type="number" class="form-control" [(ngModel)]="autoClearThreshold" min="1000">
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-success" (click)="startStream()" [disabled]="loading">
            {{ loading ? 'Streaming...' : 'Start Stream' }}
          </button>
          <button class="btn btn-danger" (click)="stopStream()" [disabled]="!loading">
            Stop Stream
          </button>
          <button class="btn btn-secondary" (click)="clearItems()" [disabled]="loading">
            Clear
          </button>
        </div>

        <!-- Statistics -->
        <div class="row mb-3" *ngIf="stats">
          <div class="col-md-3">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Avg Price</h6>
                <div class="h4">{{stats.avgPrice | currency}}</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Total Value</h6>
                <div class="h4">{{stats.totalValue | currency}}</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Categories</h6>
                <div class="h4">{{stats.categoryCount}}</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Processing Time</h6>
                <div class="h4">{{stats.processingTime}}s</div>
              </div>
            </div>
          </div>
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
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of displayedItems">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.category}}</td>
                <td>{{item.price | currency}}</td>
                <td>{{item.stock}}</td>
                <td>{{item.rating}}/5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LargeDataStreamComponent implements OnInit, OnDestroy {
  items: any[] = [];
  displayedItems: any[] = [];
  categories: string[] = [];
  loading = false;
  processRate = 0;
  stats: any = null;

  // Stream options
  totalItems = 10000;
  batchSize = 1000;
  delayMs = 100;
  autoClearThreshold = 5000;
  selectedCategory = '';
  minPrice?: number;
  maxPrice?: number;

  private subscription?: Subscription;
  private startTime?: number;
  private processRateInterval?: any;

  constructor(private streamService: StreamService) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.streamService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  startStream() {
    this.loading = true;
    this.items = [];
    this.displayedItems = [];
    this.stats = null;
    this.startTime = Date.now();
    this.startProcessRateCalculation();

    this.subscription = this.streamService.getLargeDataStream({
      totalItems: this.totalItems,
      batchSize: this.batchSize,
      delayMs: this.delayMs,
      category: this.selectedCategory || undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    }).subscribe({
      next: (item) => {
        this.items.push(item);
        this.updateDisplayedItems();
        this.checkAutoClear();
      },
      error: (error) => {
        console.error('Stream error:', error);
        this.loading = false;
        this.stopProcessRateCalculation();
      },
      complete: () => {
        this.loading = false;
        this.stopProcessRateCalculation();
        this.calculateStats();
      }
    });
  }

  stopStream() {
    this.subscription?.unsubscribe();
    this.loading = false;
    this.stopProcessRateCalculation();
  }

  clearItems() {
    this.items = [];
    this.displayedItems = [];
    this.stats = null;
  }

  private updateDisplayedItems() {
    // Keep only the last 100 items for display
    this.displayedItems = this.items.slice(-100);
  }

  private checkAutoClear() {
    if (this.items.length >= this.autoClearThreshold) {
      this.items = this.items.slice(-this.autoClearThreshold);
    }
  }

  private startProcessRateCalculation() {
    this.processRateInterval = setInterval(() => {
      const elapsedSeconds = (Date.now() - (this.startTime || Date.now())) / 1000;
      this.processRate = this.items.length / elapsedSeconds;
    }, 1000);
  }

  private stopProcessRateCalculation() {
    if (this.processRateInterval) {
      clearInterval(this.processRateInterval);
    }
  }

  private calculateStats() {
    if (this.items.length === 0) return;

    const totalValue = this.items.reduce((sum, item) => sum + item.price, 0);
    const categories = new Set(this.items.map(item => item.category));
    const processingTime = ((Date.now() - (this.startTime || Date.now())) / 1000).toFixed(1);

    this.stats = {
      avgPrice: totalValue / this.items.length,
      totalValue,
      categoryCount: categories.size,
      processingTime
    };
  }

  ngOnDestroy() {
    this.stopStream();
  }
}