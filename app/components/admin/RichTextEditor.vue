<script setup lang="ts">
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    modelJson?: string | null;
    placeholder?: string;
  }>(),
  {
    modelJson: null,
    placeholder: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:modelJson", value: string | null): void;
}>();

const plainTextLength = ref(0);

const editor = useEditor({
  content: props.modelValue || "",
  editorProps: {
    attributes: {
      class: "min-h-64 p-4 outline-none prose prose-slate max-w-none",
    },
  },
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
      link: false,
    }),
    Underline,
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    const normalizedHtml = html === "<p></p>" ? "" : html;
    emit("update:modelValue", normalizedHtml);

    const json = editor.isEmpty ? null : JSON.stringify(editor.getJSON());
    emit("update:modelJson", json);

    plainTextLength.value = editor.getText().replace(/\s+/g, " ").trim().length;
  },
  onCreate: ({ editor }) => {
    plainTextLength.value = editor.getText().replace(/\s+/g, " ").trim().length;
    const json = editor.isEmpty ? null : JSON.stringify(editor.getJSON());
    emit("update:modelJson", json);
  },
});

const currentBlockType = computed(() => {
  if (!editor.value) return "paragraph";
  if (editor.value.isActive("heading", { level: 2 })) return "h2";
  if (editor.value.isActive("heading", { level: 3 })) return "h3";
  if (editor.value.isActive("blockquote")) return "blockquote";
  return "paragraph";
});

function setParagraph() {
  if (!editor.value) return;
  editor.value.chain().focus().setParagraph().run();
}

function toggleHeading(level: 2 | 3) {
  if (!editor.value) return;
  editor.value.chain().focus().toggleHeading({ level }).run();
}

function toggleBlockquote() {
  if (!editor.value) return;
  editor.value.chain().focus().toggleBlockquote().run();
}

function clearFormatting() {
  if (!editor.value) return;
  editor.value.chain().focus().clearNodes().unsetAllMarks().run();
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return;
    const currentHtml = editor.value.getHTML();
    const nextHtml = value || "";
    const normalizedCurrent = currentHtml === "<p></p>" ? "" : currentHtml;
    if (normalizedCurrent !== nextHtml) {
      editor.value.commands.setContent(nextHtml || "", false);
      plainTextLength.value = editor.value
        .getText()
        .replace(/\s+/g, " ")
        .trim().length;
    }
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <div
      class="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        label="正文"
        :class="{ 'bg-slate-100': currentBlockType === 'paragraph' }"
        @click.prevent="setParagraph"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        label="H2"
        :class="{ 'bg-slate-100': editor?.isActive('heading', { level: 2 }) }"
        @click.prevent="toggleHeading(2)"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        label="H3"
        :class="{ 'bg-slate-100': editor?.isActive('heading', { level: 3 }) }"
        @click.prevent="toggleHeading(3)"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        label="引用"
        :class="{ 'bg-slate-100': editor?.isActive('blockquote') }"
        @click.prevent="toggleBlockquote"
      />

      <span class="mx-1 h-6 w-px bg-slate-200" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-bold"
        :class="{ 'bg-slate-100': editor?.isActive('bold') }"
        title="加粗"
        @click.prevent="editor?.chain().focus().toggleBold().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-italic"
        :class="{ 'bg-slate-100': editor?.isActive('italic') }"
        title="斜体"
        @click.prevent="editor?.chain().focus().toggleItalic().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-underline"
        :class="{ 'bg-slate-100': editor?.isActive('underline') }"
        title="下划线"
        @click.prevent="editor?.chain().focus().toggleUnderline().run()"
      />

      <span class="mx-1 h-6 w-px bg-slate-200" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-list"
        :class="{ 'bg-slate-100': editor?.isActive('bulletList') }"
        title="无序列表"
        @click.prevent="editor?.chain().focus().toggleBulletList().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-list-ordered"
        :class="{ 'bg-slate-100': editor?.isActive('orderedList') }"
        title="有序列表"
        @click.prevent="editor?.chain().focus().toggleOrderedList().run()"
      />

      <span class="mx-1 h-6 w-px bg-slate-200" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-minus"
        title="分割线"
        @click.prevent="editor?.chain().focus().setHorizontalRule().run()"
      />

      <span class="mx-1 h-6 w-px bg-slate-200" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-eraser"
        title="清除格式"
        @click.prevent="clearFormatting"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-undo-2"
        title="撤销"
        @click.prevent="editor?.chain().focus().undo().run()"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-redo-2"
        title="重做"
        @click.prevent="editor?.chain().focus().redo().run()"
      />

      <div class="ml-auto text-xs text-slate-500 px-2">
        字数 {{ plainTextLength }}
      </div>
    </div>

    <EditorContent :editor="editor" />

    <div
      v-if="editor?.isEmpty && placeholder"
      class="px-4 pb-3 text-sm text-slate-400 pointer-events-none"
    >
      {{ placeholder }}
    </div>
  </div>
</template>

<style scoped>
:deep(.ProseMirror) {
  min-height: 16rem;
}

:deep(.ProseMirror:focus) {
  outline: none;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 1rem 0 0.75rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0.875rem 0 0.625rem;
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(203 213 225);
  padding-left: 0.75rem;
  color: rgb(71 85 105);
  margin: 0.75rem 0;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #94a3b8;
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
