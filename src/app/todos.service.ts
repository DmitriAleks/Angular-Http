import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {map,tap}  from "rxjs/operators";


export interface Todo {
  completed: boolean
  title: string
  id: number
}

@Injectable({
  providedIn: 'root'
})

export class TodosService {
  constructor(private http: HttpClient) {}
  addTodo(newTodo:Todo): Observable<Todo>{
    const headers = new HttpHeaders({
      'MyCustomHeader': Math.random().toString()
    })
   return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos?_limit=2',newTodo, {
    headers
   })
  }
  fetchTodos(): Observable<Todo[]>{
    let params = new HttpParams()
    params = params.append('_limit', '4')
    params = params.append('custom', 'anything')
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos',{
      params,
      observe: 'response'
    })
    .pipe(
      map(response => {
        return response.body as Todo[]
      }), 
      catchError(error=>{
      return throwError(error)
  }))
  }
  removeTodo(id:number): Observable<any>{
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`,{
      observe: 'events'
    })
    .pipe( 
      tap(event=>{
        if(event.type === HttpEventType.Sent){
           console.log('sent', event);
        }
        if(event.type === HttpEventType.Response){
          console.log('Rspose', event);
          
        }
      })
    )
  }
  completeTodo(id: number): Observable<Todo>{
    return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {completed: true},{
      responseType: 'json'
    })
  }
}

