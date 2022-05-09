import {Component, OnInit} from '@angular/core'
import {HttpClient} from "@angular/common/http";
import {delay} from 'rxjs/operators'
import {Todo, TodosService} from "./todos.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  todos: Todo[] = []
  todoTitle = ''
  loading = false

  constructor(private todosService: TodosService) {
  }

  ngOnInit() {
    this.fetchTodos()
  }

  addTodo() {
    if (!this.todoTitle.trim()) return
    const newTodo: Todo = {
      title: this.todoTitle,
      completed: false,
      id: Math.random()
    }
    this.todosService.addTodo(newTodo)
      .subscribe(response => {
        console.log('response', response)
        this.todos.push(response)
        this.todoTitle = ''
      })


  }

  fetchTodos() {
    this.loading = true
    this.todosService.fetchTodos()
      .pipe(delay(1500))
      .subscribe(response => {
        this.todos = response
        this.loading = false
      })
  }

  removeTodo(id: number) {
    this.todosService.removeTodo(id)
      .subscribe(response => {
        this.todos = this.todos.filter(el => el.id !== id)
      })
  }
  completeTodo(id:number){
    this.todosService.completeTodo(id).subscribe(response=>{
      const a = this.todos.find(t=>t.id === response.id)
      if(a){
       a.completed = true
      }

    })
  }

}

