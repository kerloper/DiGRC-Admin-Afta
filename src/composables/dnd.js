import {useVueFlow} from '@vue-flow/core'
import {nextTick, ref, watch} from 'vue'
import {
    genId,
    InflowNodeType,
    rawRule,
    rawRuleApiCall,
    rawRuleIFCondition,
    rawRuleJSNode, RouterIfNodeStyle
} from "@/constants/vueflow.js";

let id = 0

/**
 * @returns {string} - A unique id.
 */
function getId() {
    return `dndnode_${id++}`
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
    /**
     * The type of the node being dragged.
     */
    draggedType: ref(null),
    isDragOver: ref(false),
    isDragging: ref(false),
}

export default function useDragAndDrop() {
    const {draggedType, isDragOver, isDragging} = state

    const {
        addNodes,
        findNode,
        project,
        vueFlowRef,
        getNodes,
    } = useVueFlow()

    watch(isDragging, (dragging) => {
        document.body.style.userSelect = dragging ? 'none' : ''
    })

    function onDragStart(event, type, data = null) {
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/vueflow', type)
            event.dataTransfer.setData('application/template', JSON.stringify(data))
            event.dataTransfer.effectAllowed = 'move'
        }
        draggedType.value = type
        isDragging.value = true
        document.addEventListener('drop', onDragEnd)
    }

    /**
     * Handles the drag over event.
     *
     * @param {DragEvent} event
     */
    function onDragOver(event) {
        event.preventDefault()
        if (draggedType.value) {
            isDragOver.value = true
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move'
            }
        }
    }

    function onDragLeave() {
        isDragOver.value = false
    }

    function onDragEnd() {
        isDragging.value = false
        isDragOver.value = false
        draggedType.value = null
        document.removeEventListener('drop', onDragEnd)
    }

    /**
     * Handles the drop event.
     *
     * @param {DragEvent} event
     */
    function onDrop(event) {
        const type = event.dataTransfer?.getData('application/vueflow');
        let data = event.dataTransfer?.getData('application/template');
        if (data) {
            data = JSON.parse(data)
        }

        // Check for start node constraint
        const startConstraint = getNodes.value.find(v => v.data.nodeType === type && type === InflowNodeType.StartNode);
        if (startConstraint) return;

        // Calculate position relative to the flow container
        const {left, top} = vueFlowRef.value.getBoundingClientRect();
        const position = project({
            x: event.clientX - left,
            y: event.clientY - top,
        });

        // Generate base new node
        const newNode = [{
            id: genId('_parent'),
            type: 'custom',
            position,
            label: `${type} node`,
        }];

        // Populate newNode data based on node type
        const nodeDataMap = {
            [InflowNodeType.GoToNode]: rawRuleIFCondition,
            [InflowNodeType.RestCallNode]: rawRuleApiCall,
            [InflowNodeType.JsCodeNode]: rawRuleJSNode,
        };

        newNode[0].data = {
            ...nodeDataMap[type] || rawRule,
            vfId: newNode[0].id,
            nodeType: type,
            color: '#F05E1C',
            title: type,
            data:data
        };

        // Handle RouterNode special case with child node creation
        if (type === InflowNodeType.RouterNode) {
            newNode[0].label = 'parent node';
            newNode[0].style = {backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '120px'};

            const childNodeId = genId('_child');
            newNode.push({
                id: childNodeId,
                type: 'custom',
                position: {x: 0, y: 75},
                extent: 'parent',
                label: `${type} node`,
                parentNode: newNode[0].id,
                style: RouterIfNodeStyle,
                data: {
                    ...rawRuleIFCondition,
                    vfId: childNodeId,
                    nodeType: InflowNodeType.RouterIFNode,
                    color: '#BEC23F',
                    title: InflowNodeType.RouterIFNode,
                },
            });
        }

        // Add the new nodes to the flow
        addNodes(newNode);

        // Center the node position after drop
        nextTick(() => {
            const node = findNode(newNode[0].id);
            const stopWatch = watch(
                () => node.dimensions,
                (dimensions) => {
                    if (dimensions.width > 0 && dimensions.height > 0) {
                        node.position = {
                            x: node.position.x - node.dimensions.width / 2,
                            y: node.position.y - node.dimensions.height / 2,
                        };
                        stopWatch();
                    }
                },
                {deep: true, flush: 'post'}
            );
        });
    }

    return {
        draggedType,
        isDragOver,
        isDragging,
        onDragStart,
        onDragLeave,
        onDragOver,
        onDrop,
    }
}
