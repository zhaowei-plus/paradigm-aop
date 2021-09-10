'use strict';

function readonly(target, name, descriptor) {
  // 不可写操作
  descriptor.writable = false
  return descriptor
}

class Person {
  // 配置名称只读
  @readonly
  name = '张三'
}

const person = new Person()
console.log('name:', person.name)
person.name = '李四'
console.log('name:', person.name)