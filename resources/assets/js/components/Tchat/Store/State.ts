import { IConversation } from '../Interfaces'

export type IState = {
  conversations: {[key: string]: IConversation}
  messages: {[key: string]: IConversation}
  openedConversations: string[]
}

export let State = {
  conversations: {},
  messages: {},
  openedConversations: []
} as IState
