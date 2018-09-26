import React from 'react';

export default class Filme extends React.Component {

    removeTodo(index) {
        let todos = this.state.todos;
        let todo = todos.findIndex(function (todo) {
            return todo.counter === index
        });

        todos.splice(todo, 1);

        this.setState({
            todos: todos
        });
    }

    addTodo(e) {
        e.preventDefault();
        let name = this.refs.name.value;
        let completed = this.refs.completed.value;
        let counter = this.state.counter;
        counter += 1;

        let todo = {
            name,
            completed,
            counter
        }

        let todos = this.state.todos;
        todos.push(todo);

        this.setState({
            todos: todos,
            counter: counter
        });

        this.refs.todoForm.reset();
    }

    constructor() {
        super();
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);

        this.state = {
            todos: [],
            title: 'App simples',
            counter: 0
        }
    }

    render() {
        let title = this.state.title;
        let todos = this.state.todos;
        return (
            <div>
                <div>
                    <h1>{title}</h1>
                    <form ref="todoForm">
                        <input type="text" ref="name" />
                        <input type="text" ref="completed" />
                        <button onClick={this.addTodo}>Add</button>
                    </form>
                    <ul>
                        {todos.map((todo => <li key={todo.counter}>{todo.name}
                            <button onClick={this.removeTodo.bind(null, todo.counter)}> Del</button>
                            <button onClick={this.removeTodo.bind(null, todo.counter)}> Detalhes</button>
                        </li>))}
                    </ul>
                </div>
            </div>
        );

    }
}