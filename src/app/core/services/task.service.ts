import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Task, Priority, TaskStatus } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaskService {
   
private readonly API = environment.apiUrl;

    private _tasks = signal<Task[]>([]);
    private _loading = signal<boolean>(false);
    private _searchQuery = signal<string>('');
    private _filterPriority = signal<Priority | 'all'>('all');
    private _filterStatus = signal<TaskStatus | 'all'>('all');

    readonly filteredTasks = computed(() => {
        let tasks = this._tasks();
        const query = this._searchQuery().toLowerCase();
        const priority = this._filterPriority();
        const status = this._filterStatus();

        if (query) {
            tasks = tasks.filter(task =>
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.notes.toLowerCase().includes(query)
            );
        }

        if (priority !== 'all') {
            tasks = tasks.filter(task => task.priority === priority);
        }

        if (status !== 'all') {
            tasks = tasks.filter(task => task.status === status);
        }

        return tasks;
    });

    readonly loading = this._loading.asReadonly();
    readonly tasks = this._tasks.asReadonly();
    readonly searchQuery = this._searchQuery.asReadonly()

    constructor(private http: HttpClient) {
        this.loadTasks().subscribe();
    }

    loadTasks() {
        this._loading.set(true);
        return this.http.get<Task[]>(`${this.API}/tasks`)
            .pipe(tap((tasks) => {
                this._tasks.set(tasks);
                this._loading.set(false);
            })
        );
    }


    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return this.http.post<Task>(`${this.API}/tasks`, newTask).pipe(tap((created) => 
            this._tasks.update(tasks => [...tasks, created]))
        );
        }

        updateTask(id: string, changes: Partial<Task>) {
            const updated = { ...changes, updatedAt: new Date().toISOString() };
            return this.http.put<Task>(`${this.API}/tasks/${id}`, updated).pipe(tap(task => this._tasks.update(tasks => tasks.map(t => t.id === id ? task : t)
        ))
            );    
    }

    deleteTask(id: string) {
        return this.http.delete(`${this.API}/tasks/${id}`).pipe(tap(() => 
            this._tasks.update(tasks => tasks.filter(task => task.id !== id)))
        );
        
    }

    setSearchQuery(query: string) {
        this._searchQuery.set(query);
    }
    
    setFilterPriority(priority: Priority | 'all') {
        this._filterPriority.set(priority);
    }

    setFilterStatus(status: TaskStatus | 'all') {
        this._filterStatus.set(status);
    }
}