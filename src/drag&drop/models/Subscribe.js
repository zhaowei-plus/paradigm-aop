import { isFunction } from '../utils.js'

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL')

export class Subscribe {
  subscribers = {
    index: 0
  }

  dispatch (event) {
    for (const key in this.subscribers) {
      if (isFunction(this.subscribers[key])) {
        this.subscribers[key](event)
      }
    }
  }

  subscribe (subscriber) {
    let id
    if (isFunction(subscriber)) {
      id = this.subscribers.index + 1
      this.subscribers[id] = subscriber
      this.subscribers.index ++
    }

    const unsubscribe = () => {
      this.unsubscribe(id)
    }

    // 返回的函数中包含不可遍历的Symbol
    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id
    return unsubscribe
  }

  unsubscribe (id) {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key)
      }
      return
    }

    if (!isFunction(id)) {
      delete this.subscribers[id]
    } else {
      delete this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]]
    }
  }
}
