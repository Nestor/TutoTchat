<template>
  <div class="row">
    <div class="col-md-3"><Conversations/></div>
    <div class="col-md-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import Conversations from './Tchat/Conversations.vue'

  export default {
    data () {
      return {
        conversation: 2
      }
    },
    components: { Conversations },
  }
</script>
