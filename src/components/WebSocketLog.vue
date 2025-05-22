<script setup>
import {ref, onMounted, onBeforeUnmount, shallowRef, toRef, watch} from 'vue';
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js"
import "codemirror/theme/dracula.css";

const props = defineProps({
  consoleOptions: {
    type: Object,
    default: "",
  }
})
const view = shallowRef();
const handleReady = payload => {
  view.value = payload.view;
};

const log = ref("");
const emit = defineEmits(['updateConsoleLogHistory']);


let websocket;

const connectWebSocket = () => {
  websocket = new WebSocket(props.consoleOptions.webSocketUrl);

  // Handle the open event
  websocket.onopen = () => {
    log.value += `WebSocket connection opened\n`;
  };

  // Handle messages from the WebSocket server
  websocket.onmessage = (event) => {
    log.value += `Received: ${event.data}\n`;
  };

  // Handle the close event
  websocket.onclose = () => {
    log.value += `WebSocket connection closed\n`;
  };

  // Handle errors
  websocket.onerror = (error) => {
    log.value += `WebSocket error: ${error}\n`;
  };
};

// Connect WebSocket on mount
onMounted(() => {
  try{
    log.value = props.consoleOptions.logs
  }catch (error){
    log.value = ""
  }
  log.value += `Try connecting to websocket...\n`;
  connectWebSocket();
});

// Clean up WebSocket connection on unmount
onBeforeUnmount(() => {
  log.value += `WebSocket connection closed.\n`;
  if (websocket) {
    websocket.close();
  }
});

watch(log, ( ) => {
  emit('updateConsoleLogHistory',log.value);
})

const cmOptions = {
  mode: "text/javascript",
  theme: "dracula",
  readOnly: true,
  lineNumbers: true,
  lineWrapping: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
}
</script>

<template>
  <div class="log-container">
    <div class="w-full  "  >
      <Codemirror
          v-model:value="log"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :options="cmOptions"
          @ready="handleReady"
      />
    </div>
  </div>
</template>
