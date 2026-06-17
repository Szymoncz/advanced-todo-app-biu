import { Component, inject, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [
            BaseChartDirective,
            MatCardModule, 
            MatIconModule
          ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  taskService = inject(TaskService);

  totalTasks = computed(() => this.taskService.tasks().length);
  doneTasks = computed(() => this.taskService.tasks().filter(task => task.status === 'done').length);
  inProgressTasks = computed(() => this.taskService.tasks().filter(task => task.status === 'in-progress').length);
  todoTasks = computed(() => this.taskService.tasks().filter(task => task.status === 'todo').length);
 overdueTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.taskService.tasks().filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length;
  });

  statusChartData = computed<any>(() => ({
    labels: ['Do zrobienia', 'W trakcie', 'Ukończone'],
    datasets: [{
      data: [this.todoTasks(), this.inProgressTasks(), this.doneTasks()],
      backgroundColor: ['#f44336', '#ff9800', '#4caf50'],
      borderWidth: 0
    }]
  }));

  priorityChartData = computed<any>(() => {
    const tasks = this.taskService.tasks();
    return {
      labels: ['Niski', 'Średni', 'Wysoki', 'Pilny'],
      datasets: [{
        label: 'Liczba zadań',
        data: [
          tasks.filter(t => t.priority === 'low').length,
          tasks.filter(t => t.priority === 'medium').length,
          tasks.filter(t => t.priority === 'high').length,
          tasks.filter(t => t.priority === 'urgent').length
        ],
        backgroundColor: ['#f44336', '#ff9800', '#4caf50', '#2196f3'],
        borderWidth: 8
      }]
    };
  });

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {position: 'bottom'}
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {display: false}
    },
    scales: {
      y: { beginAtZero: true, ticks: {stepSize: 1} }
    }
  };

}
