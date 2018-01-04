import { IState } from './State'
import { IConversation, IConversationResponse, IMessage } from '../Interfaces'
import Vue from 'vue'

type messageWithUser = {
  message: IMessage,
  userId: string
}

export const readConversation = function (state: IState, id: string) {
  state.conversations[id].unread = 0
}

export const addMessages = function (state: IState, {conversation, userId}:  {conversation: IConversation, userId: string}) {
  let previousConversation = state.conversations[userId] || {messages: [], count: 0, loaded: false}
  state.conversations = Object.assign(
    {},
    state.conversations,
    {
      [userId]: Object.assign({}, previousConversation, {
        messages: [...conversation.messages, ...(previousConversation.messages || [])],
        count: conversation.count,
        loaded: true
      })
    }
  )
}

export const addMessage = function (state: IState, {message, userId}: {message: IMessage, userId: string}) {
  state.conversations[userId].messages.push(message)
  state.conversations[userId].count++
}

export const incrementUnread = function (state: IState, userId: string) {
  let conversation = state.conversations[userId]
  if (conversation) {
    conversation.unread++
  }
}

export const addConversations = function (state: IState, conversations: IConversationResponse[]) {
  conversations.forEach((conversation) => {
    let previousConversation = state.conversations[conversation.id] || {messages: [], count: 0, unread: 0, loaded: false}
    Object.assign(state.conversations, {
      [conversation.id]: Object.assign(previousConversation, conversation)
    })
  })
}

export const readMessage = function (state: IState, {message}: {message: IMessage}) {
  let conversation = state.conversations[message.from_id]
  if (conversation && message) {
    let msg: IMessage|undefined = conversation.messages.find(m => m.id === (message as IMessage).id)
    if (msg) {
      msg.seen_at = (new Date()).toISOString()
    }
    Vue.set(state.conversations[message.from_id], 'unread', Object.values(conversation.messages).filter(message => message.seen_at === null).length)
  }
}

export const openConversation = function (state: IState, id: string) {
  state.openedConversations = [id]
}
