<template>
  <div class="row">
    <div class="col-md-3"><Conversations/></div>
    <div class="col-md-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue} from 'vue-property-decorator'
  import Conversations from './Tchat/Conversations.vue'

  @Component({
    components: { Conversations }
  })
  export default class Tchat extends Vue {
    @Prop() user: number

    mounted () {
      this.$store.dispatch('listenToMessage', this.user)
    }
  }
</script>
