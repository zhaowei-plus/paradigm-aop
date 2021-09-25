var _dec, _dec2, _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

// 日志上报
// 前置装饰器
function before(beforeFn = function () {}) {
  return function (_, name, descriptor) {
    const value = descriptor.value;

    descriptor.value = function () {
      beforeFn.apply(this, arguments); // 执行前置操作

      return value.apply(this, arguments);
    };

    return descriptor;
  };
} // 后置装饰器


function after(afterFn = function () {}) {
  return function (_, name, descriptor) {
    const value = descriptor.value;

    descriptor.value = function () {
      const result = value.apply(this, arguments);
      afterFn.apply(this, arguments); // 执行后置操作

      return result;
    };

    return descriptor;
  };
}

let Dialog = (_dec = before(function () {
  // 自定义前置增强逻辑
  console.log('before 前置日志:', this.visible);
}), _dec2 = after(function () {
  // 自定义前置增强逻辑
  console.log('after 后置日志:', this.visible);
}), (_class = class Dialog {
  constructor() {
    this.visible = false;
  }

  open() {
    this.visible = true;
    console.log('Dialog open');
  }

  close() {
    this.visible = false;
    console.log('Dialog close');
  }

}, (_applyDecoratedDescriptor(_class.prototype, "open", [_dec, _dec2], Object.getOwnPropertyDescriptor(_class.prototype, "open"), _class.prototype)), _class)); // 模拟按钮点击事件

new Dialog().open();
