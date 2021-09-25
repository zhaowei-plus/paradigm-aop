// 备用录模式

// 缓存数据 Map
const memoized = new WeakMap();

function memoize(_, name, descriptor) {
  const getter = descriptor.get;
  const setter = descriptor.set;

  // 重写 get
  descriptor.get = function() {
    const target = memoization(this);
    if (name in target) {
      return target[name];
    }
    // 调用getter获取值并缓存
    return target[name] = getter.call(this);
  }

  descriptor.set = function(value) {
    setter.call(this, value);
    // 值修改时删除缓存
    memoized.delete(this);
  }
}

// 缓存和提取
function memoization(obj) {
  let target = memoized.get(obj);
  if (!target) {
    target = Object.create(null);
    memoized.set(obj, target);
  }
  return target;
}

class Person {
  constructor(name) {
    this.name = name;
  }

  // 启用备用录
  @memoize
  get name() { 
    console.log('call name getter');
    return `${this.first} ${this.last}`;
  }
  set name(value) {
    console.log('call name setter');
    [this.first, this.last] = value.split(' ');
  }
}

const person = new Person('张 三');
console.log('person:', person.name);
console.log('person:', person.name);
console.log('person:', person.name);

person.name = '李 四';

console.log('person:', person.name);
console.log('person:', person.name);
console.log('person:', person.name);