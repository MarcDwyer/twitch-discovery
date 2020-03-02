<template>
  <div class="streamer-grid">
    <div v-if="streams.length" class="inner-grid">
      <span v-for="stream in streams" v-bind:key="stream.id">{{stream.streamName}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IStreamers } from "../../../node-backend/src/data_types/td_types";

@Component
class StreamerGrid extends Vue {
  @Prop() streams: IStreamers[];
}
export default StreamerGrid;
</script>

<style lang="scss">
.streamer-grid {
  margin: auto;
  width: 100%;

  .inner-grid {
    display: grid;
    width: 100%;
    grid-auto-rows: 1fr;
    margin: auto;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 25px;
    row-gap: 25px;
  }
}
</style>