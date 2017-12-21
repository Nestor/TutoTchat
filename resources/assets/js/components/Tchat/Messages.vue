<template>
  <div class="card">
    <div class="card-header" @click="loadMessages">{{ username }}</div>
    <div class="card-body conversations">
      <div v-for="message in messages">
        <Message :message="message" :author="user"/>
      </div>
      <div class="form-group">
        <textarea placeholder="Ecrivez un message" :class="{'form-control': true, 'is-invalid': errors['content']}" name="content" id="" rows="3" v-model="message" @focus="resetErrors" @keypress.enter="sendMessage"></textarea>
        <div class="invalid-feedback">{{ errors['content'] ? errors['content'].join(' ') : '' }}</div>
      </div>
    </div>
    <div class="conversations__loading" v-show="loading">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Watch} from 'vue-property-decorator'
  import { IMessage } from './Interfaces'
  import Message from './Message.vue'

  @Component({
    components: {Message},
  })
  export default class Messages extends Vue {

    message: string = ''
    errors: {[key:string]: string} = {}
    loading: boolean = false
    $conversation: HTMLElement

    get messages (): IMessage[] {
        return this.$store.getters.messagesFor(parseInt(this.$route.params.id, 10))
    }

    get hasMoreMessages (): IMessage[] {
      return this.$store.getters.hasMoreMessage(parseInt(this.$route.params.id, 10))
    }

    get user (): number {
      return parseInt(this.$route.params.id, 10)
    }

    get username (): string {
      return this.$store.getters.username(this.$route.params.id)
    }

    mounted () {
      this.loadMessages()
      this.$conversation = this.$el.querySelector('.conversations') as HTMLElement
      this.onScroll = this.onScroll.bind(this)
    }

    resetErrors () {
      this.errors = {}
    }

    @Watch('$route.params.id')
    loadMessages () {
      this.loading = true
      this.$store.dispatch('loadMessagesFor', this.user).then(e => {
        this.loading = false
        // this.scrollBot()
        if (this.hasMoreMessages) {
          this.$conversation.addEventListener('scroll', this.onScroll)
        }
      })
    }

    onScroll () {
      if (this.$conversation.scrollTop === 0) {
        this.$conversation.removeEventListener('scroll', this.onScroll)
        this.loadMessages()
      }
    }

    scrollBot () {
      let conversation = this.$el.querySelector('.conversations') as Element
      this.$nextTick(() => {
        conversation.scrollTop = conversation.scrollHeight
      })
    }

    async sendMessage (e: KeyboardEvent) {
      this.errors = {}
      if (e.shiftKey === false) {
        this.loading = true
        e.preventDefault()
        try {
          await this.$store.dispatch('sendMessageTo', {
            userId: this.user,
            message: this.message
          })
          this.message = ''
          this.scrollBot()
        } catch (e) {
          this.errors = e.errors
        }
        this.loading = false
      }
    }

  }
</script>
