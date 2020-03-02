<template>
  <div id="app">
    <StreamerGrid v-if="twitchData" v-bind:streams="twitchData.streams" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { Component, Prop } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

import { socketActions } from "./socket_utils/socket_actions";

import { TwitchPayload } from "./data_types";
import { MyState } from "./store";

import StreamerGrid from "./components/Streamer_Grid.vue";

import io from "socket.io-client";

@Component({
  components: {
    StreamerGrid
  }
})
class App extends Vue {
  $store: Store<MyState>;
  @State socket: SocketIOClient.Socket;
  @State twitchData: TwitchPayload;
  @Mutation setSocket: (socket: SocketIOClient.Socket) => void;
  mounted() {
    const socket = io("http://localhost:5010");
    socketActions(socket, this.$store);
    this.setSocket(socket);
  }
  updated() {
    console.log(this.twitchData);
  }
}
export default App;
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #eee;
  background-color: black;
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>
