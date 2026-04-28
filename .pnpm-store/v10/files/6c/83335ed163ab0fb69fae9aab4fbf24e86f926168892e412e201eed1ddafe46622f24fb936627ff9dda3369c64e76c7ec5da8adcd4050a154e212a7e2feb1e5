<template>
  <div ref="editorElement">
    <slot v-if="isLoading" />
  </div>
</template>

<script setup>
import { computed, ref, shallowRef, watch, onBeforeUnmount } from "vue";
import { defu } from "defu";
import { useMonaco } from "./composables";
const props = defineProps({
  lang: { type: String, required: false, default: () => "plaintext" },
  options: { type: null, required: false, default: () => ({}) },
  modelUri: { type: null, required: false },
  modelValue: { type: String, required: false, default: () => "" }
});
const emit = defineEmits(["update:modelValue", "load"]);
const isLoading = ref(true);
const lang = computed(() => props.lang || props.options.language);
const editorRef = shallowRef();
const editorElement = ref();
const defaultOptions = {
  automaticLayout: true
};
defineExpose({
  /**
     * Monaco editor instance
     */
  $editor: editorRef
});
const monaco = await useMonaco();
let editor;
let model;
watch(() => props.modelValue, () => {
  if (editor?.getValue() !== props.modelValue) {
    editor?.setValue(props.modelValue);
  }
});
watch(() => [props.lang, props.modelUri], () => {
  if (model) {
    model.dispose();
  }
  model = monaco.editor.createModel(props.modelValue, lang.value, props.modelUri);
  editor?.setModel(model);
});
watch(() => props.options, () => {
  editor?.updateOptions(defu(props.options, defaultOptions));
});
watch(editorElement, (newValue, oldValue) => {
  if (!editorElement.value || oldValue) {
    return;
  }
  editor = monaco.editor.create(editorElement.value, defu(props.options, defaultOptions));
  model = monaco.editor.createModel(props.modelValue, lang.value, props.modelUri);
  editorRef.value = editor;
  editor.layout();
  editor.setModel(model);
  editor.onDidChangeModelContent(() => {
    emit("update:modelValue", editor.getValue());
  });
  isLoading.value = false;
  emit("load", editor);
});
onBeforeUnmount(() => {
  editor?.dispose();
  model?.dispose();
});
</script>
