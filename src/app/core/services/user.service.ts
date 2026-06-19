import { Injectable, signal, computed } from "@angular/core";
import { AppUser } from "../models/task.model";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly _users = signal<AppUser[]>([
        { id: '1', name: 'Admin', avatar: 'AD', role: 'admin' },
    { id: '2', name: 'Anna Kowalska', avatar: 'AK', role: 'member' },
    { id: '3', name: 'Piotr Nowak', avatar: 'PN', role: 'member' },
    { id: '4', name: 'Marek Wiśniewski', avatar: 'MW', role: 'member' },
    { id: '5', name: 'Katarzyna Zając', avatar: 'KZ', role: 'member' },
    ]);

    readonly users = this._users.asReadonly();

    getUserById(id: string | null) {
        if (!id) return null;
        return this._users().find(u =>u.id === id) ?? null;
    }
}