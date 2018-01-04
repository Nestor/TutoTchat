<template>
  <div>
    <div class="row">
      <div :class="cls">
        <p>
          <strong>{{ name }}</strong>, <span class="text-muted">{{ formatDate(message.created_at) }}</span><br>
          {{ message.content }}
        </p>
      </div>
    </div>
    <hr>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import { IMessage } from './Interfaces'
  import * as moment from 'moment'

  moment.locale('fr')

  @Component
  export default class Message extends Vue {

    @Prop({type: Object}) message: IMessage
    @Prop({type: Number}) author: number
    timer: number = 0

    mounted () {
      window.setInterval(() => {
        this.$forceUpdate()
      }, 60000)
    }

    destroyed () {
      window.clearInterval(this.timer)
    }

    formatDate (): string {
      return moment(this.message.created_at).fromNow()
    }

    get isMe () {
      return this.author !== this.message.from.id
    }

    get name (): string {
      return this.isMe ? 'Moi' : this.message.from.name
    }

    get cls (): Array<string> {
      let cls = ['col-md-10']
      if (this.isMe) {
        cls.push('offset-md-2 text-right')
      }
      return cls
    }
  }

</script>
