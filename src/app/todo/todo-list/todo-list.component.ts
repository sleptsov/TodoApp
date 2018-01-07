import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../../../models/Todo';

@Component({
  selector: 'td-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  @Input() todos: Todo[];

  @Output() editClick: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteClick: EventEmitter<Todo> = new EventEmitter<Todo>();

  constructor() { }

  ngOnInit() {
  }

  delete(todo: Todo): void {
    if (!todo) {
      return;
    }
    this.deleteClick.emit(todo);
  }

  edit(todo: Todo): void {
    if (!todo) {
      return;
    }
    this.editClick.emit(todo);
  }

}
