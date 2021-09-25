// AOP 实现防抖与节流

// 防抖
function debounce (fn, wait = 200) {
  let timeout = null
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, wait)
  }
}

// 节流
function throttle (func, delay = 200) {
  let prev = Date.now()
  return function () {
    const now = Date.now()
    if (now - prev >= delay) {
      func.apply(this, arguments)
      prev = Date.now()
    }
  }
}

// AOP 防抖改造
function decoratorDebounce (wait = 200) {
  return function (_, name, descriptor) {
    descriptor.value = debounce(descriptor.value, wait)
    return descriptor
  }
}

// AOP 节流改造
function decoratorThrottle (wait = 200) {
  return function (_, name, descriptor) {
    descriptor.value = throttle(descriptor.value, wait)
    return descriptor
  }
}

class Dialog {
  @decoratorDebounce()
  input (params) {
    console.log('input: ', Date.now(), params)
  }

  @decoratorThrottle(1000)
  scroll (params) {
    console.log('scroll: ', Date.now(), params)
  }

  start () {
    for (let i = 0; i <= 1000_0000; i ++) {
      this.input(i.toString().padStart(8, '0'))
      this.scroll(i.toString().padStart(8, '0'))
    }
  }
}

new Dialog().start()
