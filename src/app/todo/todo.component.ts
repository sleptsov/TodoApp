import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from '../../models/Todo';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../core/loader/loader.service';
import { SORT_TYPES, TODOS_VIEW_STATUS, ORDER_TYPES } from '../../models/Common';

@Component({
  selector: 'td-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todoMaxLength = 100;
  todoForm: FormGroup;
  currentTodo: Todo;
  sortTypes = SORT_TYPES;
  initialSortBy: string = this.sortTypes.QUEUEING;
  orderTypes = ORDER_TYPES;
  orderedBy: string = this.orderTypes.ASC;
  todoViewStatus = TODOS_VIEW_STATUS;
  initialTodoShow: string = this.todoViewStatus.ALL;

  @ViewChild('todoFormModal') todoFormModal: ModalDirective;
  @ViewChild('confirmModal') confirmModal: ModalDirective;

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadTodos();
  }

  loadTodos(): void {
    this.loaderService.show();
    this.todoService.loadTodos().subscribe((response: Todo[]) => {
      if (response) {
        this.todoService.todos = response;
        this.sortBy(this.initialSortBy);
        // this.todoService.saveTodos(); // Temporary off.
      } else {
        console.log(`Something went wrong.`);
      }
    }, (error) => {
      console.log(error);
      this.loaderService.hide();
    }, () => { this.loaderService.hide(); });
  }

  get todos(): Todo[] {
    return this.todoService.todos;
  }

  get isLoading(): boolean {
    return this.loaderService.isLoading;
  }

  confirmDelete(todo: Todo): void {
    this.currentTodo = todo;
    this.confirmModal.show();
  }

  deleteTodo(todo: Todo): void {
    this.hideModal();
    this.loaderService.show();
    if (!todo) {
      return;
    }

    this.todoService.deleteTodo(todo).subscribe((response: any) => {
      if (response) {
        this.todoService.spliceTodo(todo);
      } else {
        console.log(`Something went wrong.`);
      }
    }, (error) => {
      this.loaderService.hide();
      console.log(error);
    }, () => { this.loaderService.hide(); });
  }

  editTodo(todo: Todo): void {
    if (!todo) {
      return;
    }

    // tslint:disable-next-line:max-line-length
    const isChanged: boolean = todo.isComplete !== this.currentTodo.isComplete || todo.link !== this.currentTodo.link || todo.taskName !== this.currentTodo.taskName || todo.queueing !== this.currentTodo.queueing;
    if (!isChanged) {
      this.hideModal();
      return;
    }
    let editTodo: Todo = { ...this.currentTodo };
    editTodo = Object.assign({}, editTodo, todo, {
      modifiedOn: new Date().toISOString(),
      modifiedBy: 1 // TODO set to userId when backend is ready
    });

    this.hideModal();
    this.loaderService.show();

    this.todoService.editTodo(editTodo).subscribe((response: Todo) => {
      if (true) { // TODO Need to varify is success on backend
        this.todoService.updateTodos(editTodo);
        this.sortBy(this.initialSortBy);
      } else {
        // console.log(`Something went wrong.`);
      }
    }, (error) => {
      this.loaderService.hide();
      console.log(error);
    }, () => { this.loaderService.hide(); });
  }

  addTodo(todo: Todo): void {
    if (!todo) {
      return;
    }
    let newTodo: Todo = new Todo();
    newTodo = Object.assign({}, newTodo, todo);

    this.hideModal();
    this.loaderService.show();
    this.todoService.addTodo(newTodo).subscribe((response: Todo) => {
      if (response) {
        this.todoService.addNewTodo(response);
        this.sortBy(this.initialSortBy);
      } else {
        console.log(`Something went wrong.`);
      }
    }, (error) => {
      this.loaderService.hide();
      console.log(error);
    }, () => { this.loaderService.hide(); });
  }

  showEditModal(todo: Todo): void {
    this.currentTodo = todo;
    this.patchForm(todo);
    this.todoFormModal.show();
  }

  showAddModal(): void {
    this.patchForm();
    this.todoFormModal.show();
  }

  hideModal(): void {
    if (this.todoFormModal.isShown) {
      this.todoFormModal.hide();
      this.todoForm.reset();
    }
    if (this.confirmModal.isShown) {
      this.confirmModal.hide();
    }
    this.currentTodo = null;
  }

  initForm(): void {
    this.todoForm = this.fb.group({
      taskName: ['', Validators.required],
      link: ['', Validators.pattern('^(http:\/\/|https:\/\/)(.*)')],
      queueing: [0, Validators.compose([Validators.required, Validators.min(0)])],
      isComplete: [false]
    });
  }

  patchForm(todo?: Todo): void {
    if (todo) {
      this.todoForm.patchValue({
        taskName: todo.taskName,
        link: todo.link,
        queueing: todo.queueing,
        isComplete: todo.isComplete
      });
    } else {
      this.todoForm.patchValue({
        taskName: '',
        link: '',
        queueing: 0,
        isComplete: false
      });
    }
  }

  onSubmit(data: Todo): void {
    if (!data) {
      return;
    }
    if (this.currentTodo) {
      this.editTodo(data);
    } else {
      this.addTodo(data);
    }
  }

  refresh(): void {
    this.loadTodos();
  }

  orderBy(): void {
    this.sortBy(this.initialSortBy);
  }

  sortBy(sortBy: string): void {
    if (!sortBy) {
      return;
    }

    switch (sortBy) {
      case this.sortTypes.CREATED:
        if (this.orderedBy === this.orderTypes.ASC) {
          this.todos.sort((a, b): any => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
        } else {
          this.todos.sort((a, b): any => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        }
        break;
      case this.sortTypes.MODIFIED:
        if (this.orderedBy === this.orderTypes.ASC) {
          this.todos.sort((a, b): any => new Date(a.modifiedOn).getTime() - new Date(b.modifiedOn).getTime());
        } else {
          this.todos.sort((a, b): any => new Date(b.modifiedOn).getTime() - new Date(a.modifiedOn).getTime());
        }
        break;
      case this.sortTypes.QUEUEING:
        if (this.orderedBy === this.orderTypes.ASC) {
          this.todos.sort((a, b): any => a.queueing - b.queueing);
        } else {
          this.todos.sort((a, b): any => b.queueing - a.queueing);
        }
        break;
      default:
        break;
    }
  }


  setDoneTodoView(status: string): void {
    if (!status) {
      return;
    }
    this.initialTodoShow = status;
  }

}
