// 日志上报

// 前置装饰器
function before(beforeFn = function() {}) {
  return function (_, name, descriptor)  {
    const value = descriptor.value

    descriptor.value = function () {
      beforeFn.apply(this, arguments) // 执行前置操作
      return value.apply(this, arguments)
    }

    return descriptor
  }
}

// 后置装饰器
function after (afterFn = function () {}) {
  return function (_, name, descriptor) {
    const value = descriptor.value

    descriptor.value = function () {
      const result = value.apply(this, arguments)
      afterFn.apply(this, arguments) // 执行后置操作
      return result
    }

    return descriptor
  }
}

class Dialog {
  constructor() {
    this.visible = false
  }

  @before(function() {
    // 自定义前置增强逻辑
    console.log('before 前置日志:', this.visible)
  })
  @after(function() {
    // 自定义前置增强逻辑
    console.log('after 后置日志:', this.visible)
  })
  open () {
    this.visible = true
    console.log('Dialog open')
  }

  close () {
    this.visible = false
    console.log('Dialog close')
  }
}

// 模拟按钮点击事件
new Dialog().open()
