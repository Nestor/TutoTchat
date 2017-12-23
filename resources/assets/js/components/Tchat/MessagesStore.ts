import {Request} from '../../libs/Request'
import { IMessage, IConversation, IConversationsResponse, IConversationResponse } from './Interfaces'
import Vuex from 'vuex'
import Vue from 'vue'
import Echo from "laravel-echo"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    conversations: {} as {[key: string]: IConversation}
  },
  mutations: {
    readConversation (state, id: string) {
      state.conversations[id].unread = 0
    },
    addMessages (state, {conversation, userId}) {
      if (state.conversations[userId]) {
        let messages = state.conversations[userId].messages || []
        Vue.set(state.conversations[userId], 'messages', [...conversation.messages, ...messages])
        Vue.set(state.conversations[userId], 'count', conversation.count)
      } else {
        Vue.set(state.conversations, userId, conversation)
      }
    },
    addMessage (state, {message, userId}) {
      let conversation = state.conversations[userId]
      Vue.set(conversation, 'messages', [...conversation.messages, message])
      Vue.set(conversation, 'count', conversation.count + 1)
    },
    incrementUnread (state, userId: string) {
      let conversation = state.conversations[userId]
      if (conversation) {
        conversation.unread++
      }
    },
    addConversations (state, conversations: IConversationResponse[]) {
      conversations.forEach((conversation) => {
        if (state.conversations[conversation.id]) {
          state.conversations[conversation.id] = Object.assign({}, state.conversations[conversation.id], conversation)
        } else {
          Vue.set(state.conversations, conversation.id.toString(), conversation)
        }
      })
    },
  },
  getters: {
    messagesFor (state) {
      return function (userId: string) {
        return state.conversations[userId] !== undefined && state.conversations[userId].messages !== undefined ? state.conversations[userId].messages : []
      }
    },
    conversations (state) {
      return state.conversations
    },
    hasMoreMessage (state) {
      return function (userId: number) {
        return state.conversations[userId] &&
          state.conversations[userId].messages &&
          state.conversations[userId].messages.length < state.conversations[userId].count
      }
    },
    username (state) {
      return function (userId: string) {
        return state.conversations[userId] ? state.conversations[userId].name : ''
      }
    }
  },
  actions: {
    async loadConversations (context) {
      const conversations = await Request.get('/api/conversations') as IConversationsResponse
      return context.commit('addConversations', conversations.conversations)
    },
    async loadMessagesFor (context, userId: number) {
      if (
        context.state.conversations[userId] === undefined ||
        context.state.conversations[userId].messages === undefined
      ) {
        let message = context.getters.messagesFor(userId)[0]
        let url = '/api/conversations/' + userId
        let response = await Request.get(url) as IConversation
        context.commit('addMessages', {userId: userId, conversation: response})
        return response
      }
    },
    async loadPreviousMessagesFor (context, userId: number) {
      let message = context.getters.messagesFor(userId)[0]
      let url = '/api/conversations/' + userId + '?before=' + message.created_at
      let response = await Request.get(url) as IConversation
      context.commit('addMessages', {userId: userId, conversation: response})
      return response
    },
    async sendMessageTo (context, {userId, message}: {userId: number, message: string}) {
      let response = await Request.post('/api/conversations', {
        content: message,
        to_id: userId
      }) as IMessage
      context.commit('addMessage', {message: response, userId})
      return response
    },
    listenToMessage (context, userId: string) {
      let e = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname + ':6001'
      })
      e
        .private(`App.User.${userId}`)
        .listen('NewMessage', function (e: {message: IMessage}) {
          let conversation = context.state.conversations[e.message.from_id]
          if (conversation && conversation.messages) {
            context.commit('addMessage', {message: e.message, userId: e.message.from_id})
          }
          context.commit('incrementUnread', e.message.from_id)
        })
    }
  }
})

