import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          .NET 8 Streaming Demo
        </a>
        <div class="d-flex">
          <a href="https://github.com/yourusername/dotnet8-streaming-demo" 
             class="btn btn-outline-light" 
             target="_blank">
            View on GitHub
          </a>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
