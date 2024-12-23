import { Routes } from '@angular/router';
import { StreamDashboardComponent } from './features/stream-demo/pages/stream-dashboard/stream-dashboard.component';

export const routes: Routes = [
  { path: '', component: StreamDashboardComponent },
  { path: '**', redirectTo: '' }
];