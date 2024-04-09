<template>
    <div class="container">
        <GraphCanvas :nodes="nodes" :edges="edges" @nodes-selected="handleNodesSelected"/>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import GraphCanvas from '../components/GraphCanvas.vue'

const data = ref([]);
const nodes = computed(() => formatNodes(data.value));
const edges = computed(() => formatEdges(data.value));

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3000/schema');
        if (response.ok) {
            const result = await response.json();
            data.value = { nodes: result.nodes, relationships: result.relationships };
        } else {
            console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
         console.error('Error:', error);
    }
});

const formatNodes = (data) => {
    if (!data.nodes) return [];
    const nodes = data.nodes.reduce((acc, node) => {
      acc[node.elementId] = {
            id: node.elementId,
            label: node.labels ? node.labels[0] : '',
            name: node.labels ? node.labels[0] : '',
        };
        return acc;
    }, {});

    return nodes;
};

const formatEdges = (data) => {
    if (!data.relationships) return [];
    
    const edges = data.relationships.map(edge => ({
        source: edge.startNodeElementId, // Adjust according to your data's structure
        target: edge.endNodeElementId, // Adjust according to your data's structure
    }));
    
    return edges;
}

const calculateLayouts = (nodes) => {
    // Calculate positions and assign to nodes
    const layouts_data = { nodes: {} };

    Object.keys(nodes).forEach(nodeId => {
        const node = nodes[nodeId];
        const label = node.label;

        // Calculate position based on base position, current offset, and additional Y offset for Topics
        const position = {
            x: 0,
            y: 0
        };
        
        // Assign position to this node in the layout
        layouts_data.nodes[nodeId] = position;
    });

    return layouts_data
}

const handleNodesSelected = (selectedNodeIds) => {
    console.log("selectedNodeIds: ", selectedNodeIds)
    // const linkedQuestions = this.findLinkedQuestions(selectedNodeIds);
    // this.filterResponses(linkedQuestions);
}
</script>

<style>
.container {
  height: 100%;
  width: 100%;
}
</style>