import { defineStore } from "pinia";
import axios from 'axios'

const BASE_URL = 'https://6628dbc954afcabd0737388f.mockapi.io';

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todoList: [],
        selectedTodo: {},
        stateuses: ['Pending', 'Doing', 'Done'],
    }),
    actions: {
        async loadTodos() {
            try {
                const response = await axios.get(`${BASE_URL}/todos`)
                this.todoList = response.data
                console.log('fetch data success', response.data)
            } catch (error) {
                console.error('error to fetch data: ', error.message)
            }
        },
        async loadTodo(id) {
            try {
                const response = await axios.get(`${BASE_URL}/todos/${id}`)
                this.selectedTodo = response.data
                console.log('fetch data success')
            } catch (error) {
                console.error('error to fetch data: ', error.message)
            }
        },
        async addTodo(todoText) {
            try {
                const todoObj = {
                    name: todoText,
                    status: 'Pending'
                }
                const response = await axios.post(`${BASE_URL}/todos`, todoObj)
                // refresh technique by push res.data to todolist array
                this.todoList.push(response.data)
                console.log('add data success')
            } catch (error) {
                console.error('error to add data: ', error.message)
            }
        },
        async updateTodo(id, todoData) {
            try {
                const response = await axios.put(`${BASE_URL}/todos/${id}`, todoData)
                console.log('update data success')
                
                // splice old data and replace with new data
                const index = this.todoList.findIndex(todo => todo.id == id)
                this.todoList.splice(index, 1, todoData)
            } catch (error) {
                console.error('error to update data: ', error.message)
            }
        },
        async deleteTodo(id) {
            try {
                console.log('delete id:', id)
                const response = await axios.delete(`${BASE_URL}/todos/${id}`)
                // delete data in todolist array by using return data from res.data by id
                const index = this.todoList.findIndex(todo => todo.id === id)
                this.todoList.splice(index, 1)
                console.log('delete data success')
            } catch (error) {
                console.error('error to delete data: ', error.message)
            }
        },
    }
})