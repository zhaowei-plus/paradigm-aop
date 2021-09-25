import { isArray } from '../utils.js'

import { Subscribe } from './Subscribe.js'

const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL')
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL')

const env = {
  ALL_EVENT_DRIVERS: []
}

export class Event extends Subscribe {
  drivers = []
  containers = []

  constructor(props) {
    super()

    if (isArray(props.effects)) {
      props.effects.forEach(plugin => {
        plugin(this)
      })
    }

    if (isArray(props.drivers)) {
      this.drivers = props.drivers
    }

    this.container = props?.container || document.documentElement
    this.target = props?.target || null
  }

  subscribeTo(type, subscriber) {
    // 添加订阅事件
    console.log('subscribeTo:', type)
    return this.subscribe(event => {
      // event 是 type 的实例
      if (type && event instanceof type) {
        subscriber(event)
      }
    })
  }

  subscribeWith(type, subscriber) {
    // 添加订阅事件
    console.log('subscribeWith:', type)
    return this.subscribe(event => {
      if (isArray(type)) {
        if (type.includes(event.type)) {
          subscriber(event)
        }
      } else {
        if (type && event?.type === type) {
          subscriber(event)
        }
      }
    })
  }

  attach () {}

  detach () {}

  addEventListener (type, listener, options) {
    if (this.target) {
      this.target.addEventListener(type, listener, options)
    }
  }

  batchAddEventListener (type, listener, options) {
    if (!env.ALL_EVENT_DRIVERS.includes(this)) {
      env.ALL_EVENT_DRIVERS.push(this)
    }

    // 为所有的事件驱动添加响应事件
    env.ALL_EVENT_DRIVERS.forEach(driver => {
      const target = driver.eventTarget(type)
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {}
      if (!target[EVENTS_BATCH_SYMBOL][type]) {
        target.addEventListener(type, listener, options)
        target[EVENTS_BATCH_SYMBOL][type] = listener
      }
    })
  }

  removeEventListener (type, listener) {
    if (this.target) {
      if (listener) {
        this.target.removeEventListener(type, listener)
      } else {
        this.target.removeEventListener(type)
      }
    }
  }

  batchRemoveEventListener (type, listener, options) {
    env.ALL_EVENT_DRIVERS.forEach(driver => {
      const target = driver.eventTarget(type)
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {}
      target.removeEventListener(type, listener, options)
      delete target[EVENTS_BATCH_SYMBOL][type]
    })
  }
}

export class EventDriver {
  engine
  container
  contentWindow
  context

  constructor(engine, context) {
    this.engine = engine
    this.context = context
  }

  eventTarget (type) {
    if (type === 'resize' || type === 'scroll') {
      if (this.container === this.contentWindow?.document) {
        return this.contentWindow
      }
    }
    return this.container
  }

}
