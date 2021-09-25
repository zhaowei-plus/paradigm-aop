var _dec, _dec2, _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

// AOP 实现防抖与节流
// 防抖
function debounce(fn, wait = 200) {
  let timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
} // 节流


function throttle(func, delay = 200) {
  let prev = Date.now();
  return function () {
    const now = Date.now();

    if (now - prev >= delay) {
      func.apply(this, arguments);
      prev = Date.now();
    }
  };
} // AOP 防抖改造


function decoratorDebounce(wait = 200) {
  return function (_, name, descriptor) {
    descriptor.value = debounce(descriptor.value, wait);
    return descriptor;
  };
} // AOP 节流改造


function decoratorThrottle(wait = 200) {
  return function (_, name, descriptor) {
    descriptor.value = throttle(descriptor.value, wait);
    return descriptor;
  };
}

let Dialog = (_dec = decoratorDebounce(), _dec2 = decoratorThrottle(1000), (_class = class Dialog {
  input(params) {
    console.log('input: ', Date.now(), params);
  }

  scroll(params) {
    console.log('scroll: ', Date.now(), params);
  }

  start() {
    for (let i = 0; i <= 1000_0000; i++) {
      this.input(i.toString().padStart(8, '0'));
      this.scroll(i.toString().padStart(8, '0'));
    }
  }

}, (_applyDecoratedDescriptor(_class.prototype, "input", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "input"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "scroll", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "scroll"), _class.prototype)), _class));
new Dialog().start();
