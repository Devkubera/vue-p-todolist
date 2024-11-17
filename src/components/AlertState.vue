<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const context = ref("");

const props = defineProps({
  state: String,
  context: String,
});

onMounted(() => {
  console.log("state: ", props.state);
  console.log("context: ", props.context);

  const alertBox = document.getElementById('alert-container')
  alertBox.className = 'alert alert-' + props.state
});
</script>

<template>
  <div role="alert" id="alert-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
    </svg>
    <span>{{ props.context }}</span>
  </div>
</template>
