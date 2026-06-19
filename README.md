# Advanced Todo App — BIU Project

Zaawansowana aplikacja Todo zbudowana w **Angular 19** jako projekt zaliczeniowy przedmiotu "Bogate Interfejsy Użytkownika".

🚀 **Demo:** [szymoncz.github.io/advanced-todo-app-biu](https://szymoncz.github.io/advanced-todo-app-biu/)

## Mapowanie wymagań React → Angular

| Wymaganie (React) | Implementacja (Angular 19) |
|---|---|
| `useState` | `signal()` |
| `useMemo` | `computed()` |
| `useContext` / Context API | `Injectable` serwis + `inject()` |
| Custom hooks | Serwisy (`@Injectable`) |
| React Router | `@angular/router` z lazy loading |
| `fetch` / axios | `HttpClient` |
| Formik / React Hook Form | `ReactiveFormsModule` |
| `React.lazy` + `Suspense` | `loadComponent` + `@defer` |
| Redux / NgRx | Signals + computed() |

## Funkcjonalności

- ✅ CRUD zadań (dodawanie, edycja, usuwanie)
- ✅ System priorytetów z oznaczeniem wizualnym
- ✅ Wyszukiwanie i filtrowanie (status, priorytet, użytkownik)
- ✅ Przypisywanie zadań do użytkowników
- ✅ Dashboard z wykresami (Chart.js)
- ✅ System powiadomień z badge
- ✅ Import/Export CSV z deduplikacją
- ✅ Responsywność (RWD) z hamburger menu
- ✅ CI/CD — GitHub Actions → GitHub Pages

## Stack techniczny

- Angular 19 (standalone components)
- Angular Material (Material Design 3)
- Signals + computed() (state management)
- RxJS (HttpClient, BreakpointObserver)
- Chart.js + ng2-charts
- MockAPI.io (mock backend)
- GitHub Actions (CI/CD)

## Uruchomienie lokalnie

```bash
npm install
npm run api    # uruchamia JSON Server na localhost:3000
ng serve       # uruchamia aplikację na localhost:4200
```