<template>
  <div ref="editorElement">
    <slot v-if="isLoading" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { defu } from "defu";
import { useMonaco } from "./composables";
const props = defineProps({
  lang: { type: String, required: false, default: () => "plaintext" },
  options: { type: null, required: false, default: () => ({}) },
  originalModelUri: { type: null, required: false },
  modelUri: { type: null, required: false },
  original: { type: String, required: false, default: () => "" },
  modelValue: { type: String, required: false, default: () => "" }
});
const emit = defineEmits(["update:modelValue", "load"]);
const isLoading = ref(true);
const editorElement = shallowRef();
const editorRef = shallowRef();
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
let originalModel;
let modifiedModel;
watch(() => [props.original, props.modelValue], () => {
  if (originalModel.getValue() !== props.original || modifiedModel.getValue() !== props.modelValue) {
    originalModel.setValue(props.original);
    modifiedModel.setValue(props.modelValue);
  }
});
watch(() => props.lang, () => {
  const originalValue = originalModel?.getValue() || props.original;
  const modifiedValue = modifiedModel?.getValue() || props.modelValue;
  if (originalModel) {
    originalModel.dispose();
  }
  if (modifiedModel) {
    modifiedModel.dispose();
  }
  originalModel = monaco.editor.createModel(originalValue, props.lang, props.originalModelUri);
  modifiedModel = monaco.editor.createModel(modifiedValue, props.lang, props.modelUri);
  editor.setModel({
    original: originalModel,
    modified: modifiedModel
  });
});
watch(() => props.options, () => {
  editor?.updateOptions(defu(props.options, defaultOptions));
});
watch(editorElement, (newValue, oldValue) => {
  if (!editorElement.value || oldValue) {
    return;
  }
  editor = monaco.editor.createDiffEditor(editorElement.value, defu(props.options, defaultOptions));
  editorRef.value = editor;
  originalModel = monaco.editor.createModel(props.original, props.lang, props.originalModelUri);
  modifiedModel = monaco.editor.createModel(props.modelValue, props.lang, props.modelUri);
  editor.setModel({
    original: originalModel,
    modified: modifiedModel
  });
  editor.onDidUpdateDiff(() => {
    emit("update:modelValue", editor.getModel().modified.getValue());
  });
  isLoading.value = false;
  emit("load", editor);
});
onBeforeUnmount(() => {
  editor?.dispose();
  originalModel?.dispose();
  modifiedModel?.dispose();
});
</script>
