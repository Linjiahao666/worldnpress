<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
  }>(),
  {
    placeholder: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorRef = ref<HTMLDivElement | null>(null);

const commands = [
  { icon: "i-lucide-bold", command: "bold" },
  { icon: "i-lucide-italic", command: "italic" },
  { icon: "i-lucide-underline", command: "underline" },
  { icon: "i-lucide-list", command: "insertUnorderedList" },
  { icon: "i-lucide-list-ordered", command: "insertOrderedList" },
  { icon: "i-lucide-quote", command: "formatBlock", value: "blockquote" },
  { icon: "i-lucide-heading-2", command: "formatBlock", value: "h2" },
  { icon: "i-lucide-heading-3", command: "formatBlock", value: "h3" },
  { icon: "i-lucide-undo-2", command: "undo" },
  { icon: "i-lucide-redo-2", command: "redo" },
];

function exec(command: string, value?: string) {
  editorRef.value?.focus();
  document.execCommand(command, false, value);
  syncToModel();
}

function syncToModel() {
  const html = editorRef.value?.innerHTML ?? "";
  emit("update:modelValue", html);
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorRef.value) return;

    if ((editorRef.value.innerHTML || "") !== (value || "")) {
      editorRef.value.innerHTML = value || "";
    }
  },
);

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || "";
  }
});
</script>

<template>
  <div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <div
      class="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50"
    >
      <UButton
        v-for="item in commands"
        :key="`${item.command}-${item.value || ''}`"
        color="neutral"
        variant="ghost"
        size="xs"
        :icon="item.icon"
        @click.prevent="exec(item.command, item.value)"
      />
    </div>

    <div
      ref="editorRef"
      contenteditable="true"
      class="min-h-64 p-4 outline-none prose prose-slate max-w-none"
      :data-placeholder="placeholder"
      @input="syncToModel"
    />
  </div>
</template>

<style scoped>
[contenteditable="true"]:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
}
</style>
