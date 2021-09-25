var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { 
  var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

// 性能分析：统计一段代码在用户侧的执行时间
function measure(_, name, descriptor) {
  const value = descriptor.value;

  descriptor.value = function () {
    performance.mark('startWork');
    const result = value.apply(this, arguments);
    performance.mark('endWork');
    performance.measure('work', 'startWork', 'endWork');
    performance.getEntries().map(entry => console.log(JSON.stringify(entry, null, 2)));
    return result;
  };
}

let Dialog = (_class = class Dialog {
  showDialog() {
    for (let i = 0; i < 1_0000_0000; i++) {}
  }

}, (_applyDecoratedDescriptor(_class.prototype, "showDialog", [measure], Object.getOwnPropertyDescriptor(_class.prototype, "showDialog"), _class.prototype)), _class);
const dialog = new Dialog();
dialog.showDialog();
