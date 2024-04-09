<template>
    <div class="full-screen-container">
      <v-network-graph
        :nodes="nodes"
        :edges="edges"
        v-model:selected-nodes="selectedNodes"
        :configs="configs"
      />
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, watch, defineEmits } from 'vue';
    import * as vNG from 'v-network-graph';
    import {
        ForceLayout,
        ForceNodeDatum,
        ForceEdgeDatum,
    } from "v-network-graph/lib/force-layout"
  
    const emit = defineEmits(['nodes-selected']);

    const props = defineProps({
        nodes: {
            type: Object,
            required: true,
        },
        edges: {
            type: Object,
            required: true,
        },
        layouts: {
            type: Object,
            required: false,
        }
    });

    const configs = reactive(
        vNG.defineConfigs({
            view: {
                layoutHandler: new ForceLayout({
                    positionFixedByDrag: false,
                    positionFixedByClickWithAltKey: true,
                    createSimulation: (d3, nodes, edges) => {
                    // d3-force parameters
                    const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
                    return d3
                        .forceSimulation(nodes)
                        .force("edge", forceLink.distance(40).strength(0.5))
                        .force("charge", d3.forceManyBody().strength(-800))
                        .force("center", d3.forceCenter().strength(0.05))
                        .alphaMin(0.001)

                        // * The following are the default parameters for the simulation.
                        // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
                        // return d3
                        //   .forceSimulation(nodes)
                        //   .force("edge", forceLink.distance(100))
                        //   .force("charge", d3.forceManyBody())
                        //   .force("collide", d3.forceCollide(50).strength(0.2))
                        //   .force("center", d3.forceCenter().strength(0.05))
                        //   .alphaMin(0.001)
                        }
                }),
            },
            node: {
                selectable: true,
                normal: {
                    type: "circle",
                    radius: 16,
                    // for type is "rect" -->
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    // <-- for type is "rect"
                    strokeWidth: 0,
                    strokeColor: "#000000",
                    strokeDasharray: "0",
                    color: "#4466cc",
                },
                hover: {
                    type: "circle",
                    radius: 16,
                    // for type is "rect" -->
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    // <-- for type is "rect"
                    strokeWidth: 0,
                    strokeColor: "#000000",
                    strokeDasharray: "0",
                    color: "#dd2288",
                },
                selected: {
                    type: "circle",
                    radius: 16,
                    // for type is "rect" -->
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    // <-- for type is "rect"
                    strokeWidth: 0,
                    strokeColor: "#000000",
                    strokeDasharray: "0",
                    color: "#4466cc",
                },
                label: {
                    visible: true,
                    fontFamily: undefined,
                    fontSize: 11,
                    lineHeight: 1.1,
                    color: "white",
                    margin: 4,
                    direction: "south",
                    background: {
                        visible: false,
                        color: "#ffffff",
                        padding: {
                            vertical: 1,
                            horizontal: 4,
                        },
                    borderRadius: 2,
                    }
                },
                focusring: {
                    visible: true,
                    width: 4,
                    padding: 3,
                    color: "#eebb00",
                    dasharray: "0"
                },
            },
            edge: {
                selectable: true,
                normal: {
                    width: 1,
                    color: "#4466cc",
                    dasharray: "0",
                    linecap: "butt",
                    animate: false,
                    animationSpeed: 50,
                },
                hover: {
                    width: 4,
                    color: "#3355bb",
                    dasharray: "0",
                    linecap: "butt",
                    animate: false,
                    animationSpeed: 50,
                },
                selected: {
                    width: 3,
                    color: "#dd8800",
                    dasharray: "6",
                    linecap: "round",
                    animate: false,
                    animationSpeed: 50,
                },
                gap: 3,
                type: "straight",
                summarize: true,
                summarized: {
                    label: {
                        fontSize: 10,
                        color: "#4466cc",
                    },
                    shape: {
                        type: "rect",
                        radius: 6, // for type is "circle"
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        color: "#ffffff",
                        strokeWidth: 1,
                        strokeColor: "#4466cc",
                        strokeDasharray: "0",
                    },
                    stroke: {
                        width: 5,
                        color: "#4466cc",
                        dasharray: "0",
                        linecap: "butt",
                        animate: false,
                        animationSpeed: 50,
                    }
                }
            },
            label: {
                visible: false,
            }
        })
        )
    const selectedNodes = ref<string[]>([]);

    watch(selectedNodes, (newSelectedNodes, oldSelectedNodes) => {
        emit('nodes-selected', newSelectedNodes);
    }, { deep: true });
</script>

<style>
.full-screen-container {
  height: 100%;
  width: 100%;
}
</style>