import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Todo } from '../../models/Todo';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class TodoService {

  todos: Todo[];
  path = '/todo';

  constructor(
    private httpClient: HttpClient
  ) { }

  loadTodos(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${environment.api}${this.path}`).pipe(
      catchError((error: any) => Observable.throw(error))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.httpClient.post(`${environment.api}${this.path}`, JSON.stringify(todo)).pipe(
      catchError((error: any) => Observable.throw(error))
    );
  }

  editTodo(todo: Todo): Observable<Todo> {
    return this.httpClient.put(`${environment.api}${this.path}/${todo.id}`, JSON.stringify(todo)).pipe(
      catchError((error: any) => Observable.throw(error))
    );
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    return this.httpClient.delete(`${environment.api}${this.path}/${todo.id}`).pipe(
      catchError((error: any) => Observable.throw(error))
    );
  }

  getTodos(): Observable<Todo[]> {
    const localTodos = JSON.parse(localStorage.getItem('todos'));
    if (!localTodos) {
      return this.loadTodos();
    } else {
      return of(localTodos);
    }
  }

  addNewTodo(todo: Todo): void {
    this.todos = [...this.todos, todo];
    this.saveTodos();
  }

  spliceTodo(todo: Todo): void {
    const index: number = this.todos.findIndex((t: Todo) => t.id === todo.id);
    if (index > -1) {
      this.todos.splice(index, 1);
      this.saveTodos();
    }
  }

  updateTodos(todo: Todo): void {
    this.todos = this.todos.map(item => {
      return {
        id: item.id,
        taskName: item.id === todo.id ? todo.taskName : item.taskName,
        isComplete: item.id === todo.id ? todo.isComplete : item.isComplete,
        queueing: item.id === todo.id ? Number(todo.queueing) : Number(item.queueing),
        link: item.id === todo.id ? todo.link : item.link,
        createdOn: item.createdOn,
        createdBy: item.createdBy,
        modifiedOn: item.modifiedOn,
        modifiedBy: item.modifiedBy
      };
    });
    this.saveTodos();
  }

  saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }



}
