<script setup lang="ts">
import { ref, computed } from "vue";
import { useDark } from '@vueuse/core'

const props = defineProps({
    modelValue: { type: Object, default: () => ([{}]) },
    property: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({ items: {} }) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' },
    columWidths: { type: Array, default: () => ([]) }
});
const emits = defineEmits(['update:modelValue', 'current-change', 'header-dragend'])

// used to forece update after reorder
const componentKey = ref(0)

const addIsAllowed = computed(() => {
    if (props.formMode.startsWith('Readonly')) return false
    // TODO work with editPermittedObj
    if (props.formMode === 'Edit Permitted') return 'bottom'
    return 'bottom'
})
const deleteIsAllowed = computed(() => {
    if (props.formMode.startsWith('Readonly')) return false
    // TODO work with editPermittedObj
    if (props.formMode === 'Edit Permitted') return 'true'
    return 'true'
})
const reorderIsAllowed = computed(() => {
    if (props.formMode.startsWith('Readonly')) return false
    // TODO work with editPermittedObj
    if (props.formMode === 'Edit Permitted') return 'true'
    return 'true'
})


// Drag and drop subforms
let draggedItem: any;
let dndParentItem: any;

const findAncestor = (el: Element, cls: string) => {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

const handleDragstart = (evt: Event) => {

    if (evt.target) {
        // get the drag item
        draggedItem = evt.target;
        dndParentItem = findAncestor(draggedItem, "dndParent")
        // Set dark mode for item to be copied (if applicable)
        if (useDark().value) dndParentItem.classList.add('dark')
        // Hide the draggedItem. 
        // This must be sent to the top of the event stack, after handelDragStart
        // otherwise the hidden elemnt will be copied
        setTimeout(function () {
            draggedItem.style.visibility = "hidden";
        }, 0);
    }
}

const handleDrageover = (evt: Event) => {
    const targetItem = findAncestor(evt.target, "drag-item")

    if (targetItem && targetItem !== draggedItem && targetItem.classList.contains('drag-item')) {
        const boundingRect = targetItem.getBoundingClientRect();
        const offset = boundingRect.y + (boundingRect.height / 2);
        if (evt.clientY - offset > 0) {
            console.log('DraggableItem, below:', targetItem.getAttribute("idx"))
            targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
            console.log('DraggableItem, above:', targetItem.getAttribute("idx"))
            targetItem.parentNode.insertBefore(draggedItem, targetItem);
        }
    }
};
const handleDragend = (evt: Event) => {
    // restore class
    dndParentItem.classList.remove('dark')
    // get children that have the new order
    let allChildren = dndParentItem.querySelectorAll(".drag-item");
    // create a new array in the correct order
    const modelValueReordered = []
    allChildren.forEach((dragItem: Element) => {
        const oldIdx = dragItem.getAttribute("idx")
        modelValueReordered.push(props.modelValue[oldIdx])
    })
    // send the new array
    emits('update:modelValue', modelValueReordered)
    // force rerender. The new order does not do this automaticly
    componentKey.value += 1
    // restore visibility
    draggedItem.style.visibility = "visible";
};

const addIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-38.4 409.6H326.4a38.4 38.4 0 1 0 0 76.8h147.2v147.2a38.4 38.4 0 0 0 76.8 0V550.4h147.2a38.4 38.4 0 0 0 0-76.8H550.4V326.4a38.4 38.4 0 1 0-76.8 0v147.2z" > </path>` +
    `< /svg>`
const deleteIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z" > </path>` +
    `< /svg>`

</script>

<template>
    <div
        class="dndParent"
        :key="componentKey"
    >
        <!-- Create a subForm for each of the items in the modelValue array -->
        <div
            v-for="(item, idx) in modelValue"
            :key="idx"
        >
            <div
                :class="{
                    'drag-item': true,
                    'sf-subform-background': true,
                    'not-readonly': formMode.startsWith('Edit') && property.additionalItems,
                }"
                :idx="idx"
                :draggable="reorderIsAllowed"
                @dragstart.stop="handleDragstart"
                @dragover.stop="handleDrageover"
                @dragend.stop="handleDragend"
                @drop.stop="handleDrop"
            >
                <JsonschemaForm
                    :model-value="item"
                    :properties="property.items.properties"
                    :requiredArr="property.required"
                    :updateable-properties="editPermitted.items.properties"
                    :form-mode="formMode"
                    :size="size"
                    :label-position="labelPosition"
                    :label-width="labelWidth"
                    :query-callback="queryCallback"
                    :colum-widths="columWidths"
                    @update:modelValue="($event: Event) => modelValue[idx] = $event"
                    @current-change="($event: Event) => $emit('current-change', $event)"
                    @header-dragend="($event: Event) => $emit('header-dragend', $event)"
                >
                </JsonschemaForm>
                <!-- Delete icon -->
                <div
                    v-if="deleteIsAllowed"
                    class="icon-delete"
                    v-html="deleteIcon"
                    @click="modelValue.splice(idx, 1)"
                ></div>
            </div>
        </div>
        <!-- Add icon -->
        <div
            v-if="addIsAllowed"
            class="icon-add"
            v-html="addIcon"
            @click="modelValue.push({})"
        ></div>
    </div>
</template>

<style scoped>
.fiftyPercent {
    zoom: 0.5;
    -moz-transform: scale(0.5);
}

/* subForm background */
.sf-subform-background {
    position: relative;
}


/* Icons */
.icon-delete {
    height: 1.5em;
    width: 1.5em;
    position: absolute;
    margin: 3px;
    top: 0px;
    right: 0;
    color: var(--el-color-error-light-5);
    z-index: 20;
    border-radius: 50%;
}

.icon-delete :hover {
    /* color: var(--el-color-error); */
    color: red;
}

.icon-add {
    height: 1.5em;
    width: 1.5em;
    margin: 3px;
    color: var(--el-color-success-light-5);
    z-index: 20;
    border-radius: 50%;
}

.icon-add :hover {
    color: var(--el-color-success);
}

.not-readonly:hover {
    cursor: pointer;
}
</style>
