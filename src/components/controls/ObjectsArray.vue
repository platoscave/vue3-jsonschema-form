<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";

const props = defineProps({
    modelValue: { type: Object, default: () => ([{}]) },
    property: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({ items: {} }) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' }
});
const emits = defineEmits(['update:modelValue'])

const onUpdateModelValue = (newDataObj: any, idx: string) => {
    props.modelValue[idx] = newDataObj
    emits('update:modelValue', props.modelValue)
}

// Drag and drop subforms
let draggedItem: any;

const findAncestor = (el: Element, cls: string) => {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

const handleDragstart = (evt: Event) => {
    console.log('handleDragstart event:', evt.target)
    //const targetItem = findAncestor(evt.target, "drag-item")
    if (evt.target) {
        evt.target.classList.add("dark")
        //evt.target.style("margin: 10px")
        draggedItem = evt.target;
        setTimeout(function () {
            evt.target.style.visibility = "hidden";
        }, 0);
    }
}

const handleDrageover = (evt: Event) => {
    const targetItem = findAncestor(evt.target, "drag-item")

    evt.target.classList.add('fiftyPercent')
    evt.target.classList.add('dark')

    if (targetItem && targetItem !== draggedItem && targetItem.classList.contains('drag-item')) {
        const boundingRect = targetItem.getBoundingClientRect();
        const offset = boundingRect.y + (boundingRect.height / 2);
        if (evt.clientY - offset > 0) {
            //console.log('DraggableItem, below:', targetItem.getAttribute("idx"))
            targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
            //console.log('DraggableItem, above:', targetItem.getAttribute("idx"))
            targetItem.parentNode.insertBefore(draggedItem, targetItem);
        }
    }
};
const handleDragend = (evt: Event) => {
    //console.log('DraggableItem, handleDragsend event:', evt)
    const parentElement = findAncestor(evt.target, "dndParent")


    console.log('parentElement:', evt.target.parentElement)

    let allChildren = parentElement.querySelectorAll(".drag-item");
    console.log('allChildren:', allChildren)

    const modelValueReordered = []

    allChildren.forEach((dragItem) => {
        console.log('New order:', dragItem.getAttribute("idx"))
        const oldIdx = dragItem.getAttribute("idx")
        modelValueReordered.push(props.modelValue[oldIdx])
    })

    emits('update:modelValue', modelValueReordered)
    evt.target.style.visibility = "visible";

    // None of this works
    // setTimeout(function () {
    // emits('update:modelValue', modelValueReordered)
    // }, 0);
    // const instance = getCurrentInstance();
    // instance?.proxy?.$forceUpdate();
};
const handleDrop = (evt: Event) => {
    console.log('DraggableItem, handleDragstart event:', evt)
};

const addIcon =
    `<svg id="el-icon-plus" viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-38.4 409.6H326.4a38.4 38.4 0 1 0 0 76.8h147.2v147.2a38.4 38.4 0 0 0 76.8 0V550.4h147.2a38.4 38.4 0 0 0 0-76.8H550.4V326.4a38.4 38.4 0 1 0-76.8 0v147.2z" > </path>` +
    `< /svg>`
const deleteIcon =
    `<svg id="el-icon-close" viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z" > </path>` +
    `< /svg>`

</script>

<template>
    <div class="dndParent">
        <!-- Create a subForm for each of the items in the modelValue array -->
        <div
            v-for="(item, idx) in modelValue"
            :key="idx"
        >
            <div
                :class="{
                    'dark': true,
                    'drag-item': true,
                    'sf-subform-background': true,
                    'not-readonly': formMode.startsWith('Edit') && property.additionalItems,
                }"
                :idx="idx"
                :draggable="formMode.startsWith('Edit') && property.additionalItems"
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
                    draggable="false"
                    @update:modelValue="($event: any) => onUpdateModelValue($event, idx)"
                >
                </JsonschemaForm>
                <!-- Delete icon -->
                <div
                    v-if="formMode.startsWith('Edit') && property.additionalItems"
                    class="icon-delete"
                    v-html="deleteIcon"
                    @click="modelValue.splice(idx, 1)"
                ></div>
            </div>
            <!-- Add icon -->
            <div
                v-if="formMode.startsWith('Edit') && property.additionalItems"
                class="icon-add"
                v-html="addIcon"
                @click="modelValue.push({})"
            ></div>
        </div>
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
