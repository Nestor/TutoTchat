<template>
  <div class="list-group">
    <div class="loader" v-if="loading"></div>
    <template v-for="conversation in conversations">
      <router-link :to="{ name: 'conversation', params: { id: conversation.id }}"
        class="list-group-item d-flex justify-content-between align-items-center">
        {{ conversation.name }}
        <span class="badge badge-primary badge-pill" v-if="conversation.unread">{{ conversation.unread }}</span>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Watch} from 'vue-property-decorator'

  @Component
  export default class Conversations extends Vue {

    loading: boolean = true

    get conversations () {
      return this.$store.getters.conversations
    }

    @Watch('$route.params.id')
    markAsRead (id: string): void {
      this.$store.commit('readConversation', id)
    }
    async mounted () {
      try {
        await this.$store.dispatch('loadConversations')
        if (this.$route.params.id) {
          this.markAsRead(this.$route.params.id as string)
        }
      } catch (e) {
        alert(e.message)
      }
      this.loading = false
    }
  }
</script>
