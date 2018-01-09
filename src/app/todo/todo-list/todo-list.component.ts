import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../../../models/Todo';
import { TODOS_VIEW_STATUS } from '../../../models/Common';

@Component({
  selector: 'td-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todoStatusType = TODOS_VIEW_STATUS;

  @Input() todos: Todo[];
  @Input() todosViewStatus: string;

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

  isHidden(todo: Todo): boolean {
    // tslint:disable-next-line:max-line-length
    const res = (todo.isComplete && this.todosViewStatus === this.todoStatusType.NOTDONE) || (!todo.isComplete && this.todosViewStatus === this.todoStatusType.DONE);
    return res;
  }

}
