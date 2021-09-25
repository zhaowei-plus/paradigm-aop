var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

// 备用录模式
// 缓存数据 Map
const memoized = new WeakMap();

function memoize(_, name, descriptor) {
  const getter = descriptor.get;
  const setter = descriptor.set; // 重写 get

  descriptor.get = function () {
    const target = memoization(this);

    if (name in target) {
      return target[name];
    } // 调用getter获取值并缓存


    return target[name] = getter.call(this);
  };

  descriptor.set = function (value) {
    setter.call(this, value); // 值修改时删除缓存

    memoized.delete(this);
  };
} // 缓存和提取


function memoization(obj) {
  let target = memoized.get(obj);

  if (!target) {
    target = Object.create(null);
    memoized.set(obj, target);
  }

  return target;
}

let Person = (_class = class Person {
  constructor(name) {
    this.name = name;
  } // 启用备用录


  get name() {
    console.log('call name getter');
    return `${this.first} ${this.last}`;
  }

  set name(value) {
    console.log('call name setter');
    [this.first, this.last] = value.split(' ');
  }

}, (_applyDecoratedDescriptor(_class.prototype, "name", [memoize], Object.getOwnPropertyDescriptor(_class.prototype, "name"), _class.prototype)), _class);
const person = new Person('张 三');
console.log('person:', person.name);
console.log('person:', person.name);
console.log('person:', person.name);
person.name = '李 四';
console.log('person:', person.name);
console.log('person:', person.name);
console.log('person:', person.name);
