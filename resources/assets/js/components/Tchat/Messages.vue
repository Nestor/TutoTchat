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
    previousLastMessage: IMessage
    $conversation: HTMLElement

    get messages (): IMessage[] {
        return this.$store.getters.messagesFor(parseInt(this.$route.params.id, 10))
    }

    get lastMessage (): IMessage {
      return this.messages[this.messages.length - 1]
    }

    get hasMoreMessages (): IMessage[] {
      return this.$store.getters.hasMoreMessage(this.$route.params.id)
    }

    get user (): number {
      return parseInt(this.$route.params.id, 10)
    }

    get username (): string {
      return this.$store.getters.username(this.$route.params.id)
    }

    async mounted () {
      this.$conversation = this.$el.querySelector('.conversations') as HTMLElement
      this.onScroll = this.onScroll.bind(this)
      await this.loadMessages()
    }

    resetErrors () {
      this.errors = {}
    }

    @Watch('$route.params.id')
    async loadMessages () {
      this.loading = true
      await this.$store.dispatch('loadMessagesFor', this.$route.params.id)
      this.loading = false
      if (this.hasMoreMessages) {
        this.$conversation.addEventListener('scroll', this.onScroll)
      }
    }

    async onScroll () {
      if (this.$conversation.scrollTop === 0) {
        this.$conversation.removeEventListener('scroll', this.onScroll)
        this.loading = true
        await this.$store.dispatch('loadPreviousMessagesFor', this.$route.params.id)
        this.loading = false
        if (this.hasMoreMessages) {
          this.$conversation.addEventListener('scroll', this.onScroll)
        }
      }
    }

    @Watch('messages')
    scrollBot () {
      if (this.previousLastMessage != this.lastMessage) {
        let conversation = this.$el.querySelector('.conversations') as Element
        this.$nextTick(() => {
          conversation.scrollTop = conversation.scrollHeight
        })
        this.previousLastMessage = this.lastMessage
      }
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
        } catch (e) {
          this.errors = e.errors
        }
        this.loading = false
      }
    }

  }
</script>
