<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
    <span>{{ socket ? "socket" : "no socket" }}</span>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { Component, Prop } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { MyState } from "./store";

import io from "socket.io-client";

@Component
class App extends Vue {
  $store: Store<MyState>;
  @State socket: SocketIOClient.Socket;
  @Mutation setSocket: (socket: SocketIOClient.Socket) => void;
  mounted() {
    const socket = io("http://localhost:5010");
    this.setSocket(socket);
  }
}
export default App;
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
