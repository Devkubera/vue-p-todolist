<script setup>
import { useTodoStore } from "../stores/todo";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import AlertState from "../components/AlertState.vue";
import Loading from "../components/Loading.vue";
import UpdateView from "./UpdateView.vue";

const router = useRouter();
const todoText = ref("");
const todoStore = useTodoStore();

const isLoading = ref(false);
const isAlert = ref(false);
const isModal = ref(false);
const alertState = ref("");
const alertContext = ref("");
const updateId = ref("");

const selectedStatus = ref("Pending");

onMounted(async () => {
  loadingToggle();
  await todoStore.loadTodos();
  // console.log("all list: ", todoStore.todoList);
  loadingToggle();
});

const changeStatusTab = (newStatus) => {
  try {
    selectedStatus.value = newStatus;
  } catch (error) {
    console.error(error);
  }
};

const statusFilter = computed(() => {
  return todoStore.todoList.filter(
    (todo) => todo.status === selectedStatus.value
  );
});

const updateTodo = async (id) => {
  // router.push({ name: "todo-update", params: { id: id } });
  // console.log("ID", id);
  updateId.value = id;
  modalToggle();
};

const deleteTodo = async (id) => {
  // console.log("ID: ", id);
  loadingToggle();
  await todoStore.deleteTodo(id);
  loadingToggle();
};

const addTodo = async () => {
  // console.log("todo text: ", todoText.value);
  if (todoText.value) {
    await todoStore.addTodo(todoText.value);
    isAlert.value = false;
  } else {
    alertState.value = "error";
    alertContext.value = "Please name a todo!";
    isAlert.value = true;
  }
};

const loadingToggle = () => {
  isLoading.value = !isLoading.value;
  // console.log(isLoading.value);
};

const modalToggle = () => {
  isModal.value = !isModal.value;
  // console.log(isLoading.value);
};

const statusDone = async (event, todo) => {
  if (event.target.checked) {
    todo.status = "Done";
    loadingToggle();
    await todoStore.updateTodo(todo.id, todo);
    loadingToggle();
  } else {
    todo.status = "Doing";
    loadingToggle();
    await todoStore.updateTodo(todo.id, todo);
    loadingToggle();
  }
};

const showAlertUpdate = async () => {
  alertState.value = "success";
  alertContext.value = "Update successfully!";
  isAlert.value = true;
  await new Promise((resolve) => setTimeout(resolve, 5000));
  isAlert.value = false;
};
</script>

<template>
  <div
    class="container max-w-3xl mx-auto my-12 flex flex-col justify-center box-border"
  >
    <div>
      <AlertState
        v-if="isAlert"
        class="mb-4"
        :state="alertState"
        :context="alertContext"
      />
      <UpdateView v-if="isModal" :id="updateId" :isModal="modalToggle" :showAlertUpdate="showAlertUpdate" />
    </div>
    <div class="text-xl mb-4">Make your todo-list with a passion :)</div>
    <div class="flex">
      <input
        class="input input-bordered w-full"
        placeholder="Add new todo item here"
        type="text"
        v-model="todoText"
      />
      <button class="btn btn-primary ml-4" @click="addTodo()">Add</button>
    </div>
    <div role="tablist" class="tabs tabs-boxed my-4">
      <a
        role="tab"
        :class="
          selectedStatus === status ? 'tab tab-active font-semibold' : 'tab'
        "
        v-for="(status, index) in todoStore.stateuses"
        :key="index"
        @click="changeStatusTab(status)"
      >
        {{ status }}
      </a>
    </div>
    <div v-if="statusFilter.length != 0">
      <table class="table">
        <tbody>
          <th>Status</th>
          <th>Todo item</th>
          <th></th>
          <th></th>
          <template v-for="todo in statusFilter" :key="todo.id">
            <tr
              :class="
                todo.status === 'Done' ? 'font-bold bg-secondary/10' : 'hover'
              "
            >
              <td>
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  :checked="todo.status === 'Done'"
                  @change="statusDone($event, todo)"
                />
              </td>
              <td :class="todo.status === 'Done' ? 'line-through' : ''">
                {{ todo.name }}
              </td>
              <td class="text-right">
                <button
                  class="btn btn-square btn-outline p-4"
                  @click="updateTodo(todo.id)"
                >
                  <svg
                    class="fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                    />
                  </svg>
                </button>
              </td>
              <td class="text-right">
                <button
                  class="btn btn-square btn-outline p-4"
                  @click="deleteTodo(todo.id)"
                >
                  <svg
                    class="fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center">Not have any todo right now :)</div>
  </div>
  <Loading v-if="isLoading" />
</template>
