import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-stream-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chart></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 200px;
      width: 100%;
    }
  `]
})
export class StreamChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('chart') chartCanvas!: ElementRef;
  @Input() data: any[] = [];
  @Input() type: 'memory' | 'rate' | 'items' = 'rate';
  
  private chart?: Chart;
  private readonly MAX_DATA_POINTS = 50;

  ngOnInit() {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chart) {
      this.updateChartData();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: this.getChartLabel(),
            data: [],
            borderColor: this.getChartColor(),
            backgroundColor: this.getChartColor(0.1),
            fill: true,
            tension: 0.4,
            pointRadius: 0
          }
        ]
      },
      options: this.getChartOptions()
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChartData() {
    if (!this.chart) return;

    const labels = Array(this.data.length).fill('').map((_, i) => i.toString());
    const values = this.data.map(d => this.getValueForType(d));

    // Limit data points
    if (labels.length > this.MAX_DATA_POINTS) {
      labels.splice(0, labels.length - this.MAX_DATA_POINTS);
      values.splice(0, values.length - this.MAX_DATA_POINTS);
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;
    this.chart.update('quiet');
  }

  private getValueForType(data: any): number {
    switch (this.type) {
      case 'memory':
        return data.memoryUsed / (1024 * 1024); // Convert to MB
      case 'rate':
        return data.processRate;
      case 'items':
        return data.itemsProcessed;
      default:
        return 0;
    }
  }

  private getChartLabel(): string {
    switch (this.type) {
      case 'memory': return 'Memory Usage (MB)';
      case 'rate': return 'Processing Rate (items/sec)';
      case 'items': return 'Items Processed';
      default: return '';
    }
  }

  private getChartColor(alpha: number = 1): string {
    switch (this.type) {
      case 'memory': return `rgba(255, 99, 132, ${alpha})`;
      case 'rate': return `rgba(54, 162, 235, ${alpha})`;
      case 'items': return `rgba(75, 192, 192, ${alpha})`;
      default: return `rgba(0, 0, 0, ${alpha})`;
    }
  }

  private getChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        }
      }
    };
  }
}