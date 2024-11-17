<script setup>
import { useRoute, RouterLink } from "vue-router";
import { onMounted, reactive, ref, defineProps } from "vue";
import { useTodoStore } from "@/stores/todo";
import Loading from "../components/Loading.vue";

const route = useRoute();
const todoStore = useTodoStore();

const todoData = reactive({});
const btnContext = ref("Update");
const isLoading = ref(false);
const loadingText = ref("Loading...");
const isUpdated = ref(false);
const isModel = ref(false);

const props = defineProps({
  id: String,
  isModal: Function,
  showAlertUpdate: Function
});

onMounted(async () => {
  if (props.id) {
    toggleLoading();
    const id = parseInt(props.id);
    console.log("params: ", id);

    // get old data
    await todoStore.loadTodo(id);
    console.log("selected item: ", todoStore.selectedTodo);
    Object.assign(todoData, todoStore.selectedTodo);
    toggleLoading();
  }

  if (isModel) {
    document.getElementById("my_modal_1").showModal();
  }
});

const updateTodo = async (todo) => {
  // update api
  loadingText.value = "Updating...";
  toggleLoading();
  await todoStore.updateTodo(todo.id, todo);
  toggleLoading();
  loadingText.value = "Loading...";
  props.showAlertUpdate()
  // close modal
  document.getElementById("my_modal_1").close();
};

const toggleLoading = () => {
  isLoading.value = !isLoading.value;
};
</script>

<template>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <div class="mx-auto my-12 w-1/2">
        <Loading v-if="isLoading"></Loading>
        <div class="flex items-center">
          <RouterLink class="btn btn-square p-4" :to="{ name: 'todo-list' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
              />
            </svg>
          </RouterLink>
          <span class="text-xl font-semibold ml-4">Edit</span>
        </div>
        <div class="font-semibold text-lg mt-4 flex items-center">
          Update at ID
          <span class="ml-2 badge text-lg badge-secondary font-semibold p-3">
            {{ id }}
          </span>
        </div>
        <div>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Item name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              v-model="todoData.name"
            />
          </label>
        </div>
        <div>
          <div>
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Status</span>
              </div>
              <select class="select select-bordered" v-model="todoData.status">
                <option
                  v-for="status in todoStore.stateuses"
                  :value="status"
                  :key="status"
                >
                  {{ status }}
                </option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <button
            class="btn btn-secondary w-full mt-4"
            @click="updateTodo(todoData)"
          >
            {{ btnContext }}
          </button>
        </div>
        <!-- <div v-if="isUpdated" class="toast toast-center">
          <div class="alert alert-success">
            <span>Update successfully!</span>
          </div>
        </div> -->
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="isModal">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
