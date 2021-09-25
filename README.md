# Web领域中关于AOP的实践

## 背景

最近在学习NestJs框架时，在使用中间件、异常过滤器、路由守卫等特性时，对其背后的设计思想 - AOP也很感兴趣，其主要作用通过最小化的更改对OOP的封装进行扩展，达到补充增强的目的。这是在Node端AOP的实践，下面简单介绍下AOP在Web领域的使用场景

## 正文

### 什么是AOP

AOP (Aspect Oriented Programming)，即面向切面编程，是通过预编译方式和运行期间动态代理实现程序功能统一维护的一种技术，这个概念出现已经很久了，在java spring中遇到的比较多。

AOP中有以下4个基本概念：

-   连接点（JointPoint）

表示能够被拦截的地方，一般是成员方法或属性，都可以称之为连接点。

-   切点（PointCut）

表示具体定位的连接点，只有特定的连接点才能执行处理逻辑，那些匹配的连接点就是切点。

-   增强（Advice）

用来添加到切点的上的逻辑代码，用于“增强”原有的功能。

“增强”的类型比较多，使用比较频繁的有以下三种：

1. 前置（before）

表示在连接点执行前实施“增强”，即在目标执行前做“想做的事”，通常做如初始化的处理

2. 后置（after）

表示在连接点执行后实施“增强”，即在目标执行后做“想做的事”，通常做收尾处理

3. 环绕（around）

表示在连接点前后都实施“增强”，甚至可以让连接点“可选”的执行

-   切面（Aspect）

切面由“切点”和“增强”组成，表示定义要在“什么地方”以“何种方式”做“什么事情”。

实际场景中，AOP思想的重点是从核心关注点中分离出横切关注点，切入“增强”处理逻辑，基本模型如下图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/5/16a87f40b544e7e5~tplv-t2oaga2asx-watermark.awebp)

### 为什么使用AOP

AOP和OOP两种编程范式是面向不同领域的两种设计思想，关于二者以及POP（面向过程编程）的基本概念和优缺点可以查看这篇文章：[[理解POP，OOP，AOP之间的关系]](https://blog.csdn.net/y_m_h111/article/details/98611188)。

OOP（面向对象编程）针对业务处理过程中的实体及其属性和行为做封装抽离，以获得更加清晰高效的逻辑单元划分

AOP是OOP的延续，是针对业务处理过程中的切面进行提取，它所面对的是处理过程中的某个步骤或者某个阶段，以获得逻辑处理过程中各部分之间隔离效果。例如对于数据权限的切面处理，就是AOP的目标领域。

简单的来讲，良好践行AOP思想旨在尽量不修改原有代码的基础上，插入新的功能，从而实现快速扩展

### 如何使用AOP

AOP在Web领域的应用场景还是比较多的，下面就从几个简单案例来介绍下其使用场景：

注：以下所有案例都是基于ES7的装饰器编码，以OOP的方式来实现，对于装饰器模式有疑问可以查看官方文档：[装饰器](https://es6.ruanyifeng.com/#docs/decorator)

案例demo项目地址：[paradigm-aop](https://github.com/zhaowei-plus/paradigm-aop)

<!--

#### 属性只读（ readonly）

只读是对类中所有属性都可以设置，但是只有变量才会有意义，也就是说变量才是“切点”，其“增强”逻辑则是配置属性描述符（descriptor）的 writable 为 false

实现如下：

```js
// "增强"函数
function readonly(target, name, descriptor) {
  // 不可写操作
  descriptor.writable = false
  return descriptor
}


class Person {
  // 设置只读
  @readonly
  name = '张三'
}

const person = new Person()
console.log('name:', person.name)
person.name = '李四' // 执行写操作
console.log('name:', person.name)
```

在严格模式下，则在编译时就会报错，从而在bable编译阶段就实现属性只读

```js
person.name = '李四';
            ^

TypeError: Cannot assign to read only property 'name' of object '#<Person>'
    at Object.<anonymous> (D:\selfWorkspace\study\src\AOP\readonly.babel.js:34:13)
```

可以看到，在装饰器的支持下，使用AOP的思想来“增强”属性特性变得非常简单-->

#### 日志输出

打印日志是常见的调试方式，可以使用AOP思想对其进行简单封装，基本逻辑是通过配置前置和后置“增强”函数，来对数据变化做监听并输出打印

实现如下：

1. 定义前置/后置“增强”函数

```js
// 前置装饰器：接受自定义逻辑
function before(beforeFn = function() {}) {
  return function (_, name, descriptor)  {
    const value = descriptor.value // 备份

    descriptor.value = function () {
      beforeFn.apply(this, arguments) // 执行前置操作
      // 执行目标方法
      return value.apply(this, arguments)
    }

    return descriptor
  }
}

// 后置装饰器：接受自定义逻辑
function after (afterFn = function () {}) {
  return function (_, name, descriptor) {
    const value = descriptor.value // 备份

    descriptor.value = function () {
      // 执行目标方法
      const result = value.apply(this, arguments) 
      afterFn.apply(this, arguments) // 执行后置操作
      return result
    }

    return descriptor
  }
}
```

这里的“增强”函数是一个高阶函数，接受自定义逻辑，返回装饰函数

2. 寻找“切面”，切入“增强”逻辑

```js
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
```

babel编译：

```bash
npx babel log.js --out-file log.bable.js
```

执行结果如下：
```bash
node log.babel.js

# 结果输出
before 前置日志: false
Dialog open
after 后置日志: true
```

在Dialogl类中，当需要进行数据调试时，可以快速接入日志模块而不影响原有结构，以实现最小成本的功能扩展。
同样的，性能监控、数据埋点也可以这么做。

源码地址：[日志输出](https://github.com/zhaowei-plus/paradigm-aop/blob/master/src/log/log.js)

#### 备用录模式 memoize

Vue的computed的特性大家都用过，而computed中的值的具有缓存特性，也可以使用AOP实现

实现思路大概如下：

1. 初始化 WeakMap 对象，用于弱缓存实例对象
2. 第一次获取值时，计算新值，缓存实例，再次获取值时，从缓存中取值，不在重新计算
3. 当值发生变化时，清除掉已缓存实例

具体实现如下：

```js
// 缓存数据 Map
const memoized = new WeakMap使用 WeakMap();

function memoize(_, name, descriptor) {
  const getter = descriptor.get; // 获取 get
  const setter = descriptor.set; // 获取 set

  // 重写 get
  descriptor.get = function() {
    const target = memoization(this);
    if (name in target) {
      return target[name];
    }
    // 调用getter获取值并缓存
    return target[name] = getter.call(this);
  }

  // 重写 set
  descriptor.set = function(value) {
    // 调用set设置值
    setter.call(this, value);
    // 值修改时删除缓存
    memoized.delete(this);
  }
}

// 缓存和提取实例
function memoization(obj) {
  let target = memoized.get(obj);
  if (!target) {
    target = Object.create(null);
    memoized.set(obj, target);
  }
  return target;
}
```

对自定义 Person 类中的属性启用备用录

```js
class Person {
  constructor(name) {
    this.first = '';
    this.last = '';
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
console.log('person:', person.name); // 调用 getter
console.log('person:', person.name); // 从缓存中取值
console.log('person:', person.name); // 从缓存中取值

person.name = '李 四';

console.log('person:', person.name); // 调用 getter
console.log('person:', person.name); // 从缓存中取值
console.log('person:', person.name); // 从缓存中取值
```

输出如下：

```bash
call name setter
call name getter
person: 张 三
person: 张 三
person: 张 三
call name setter
call name getter
person: 李 四
person: 李 四
person: 李 四
```

可以看到，当 name 发生改变后，取值时就会重新计算，之后缓存值，再次取值时直接从缓存获取

源码地址：[备用录模式 memoize](https://github.com/zhaowei-plus/paradigm-aop/blob/master/src/memoize/memoize.js)

#### 防抖与节流

防抖与节流是最常见的性能优化的措施，当需要对项目进行防抖与节流处理时，可以使用AOP的思想进行封装，方便快捷的接入业务

实现如下：

1. 实现防抖函数主体：

```js
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
```

2. 利用装饰器对其进行“增强”改造以支持切面插入

```js
function decoratorDebounce (wait = 2000) {
  return function (_, name, descriptor) {
    // 修改方法，赋予新值
    descriptor.value = debounce(descriptor.value, wait)
    return descriptor
  }
}
```

3. 快速接入切点

```js
class Dialog {
  @decoratorDebounce() // 防抖优化
  input (params) {
    console.log('input: ', Date.now(), params)
  }

  @decoratorDebounce(2000) // 节流优化
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
```

输出结果如下：

```bash
scroll:  1631704883755 03669635
scroll:  1631704884756 05588233
scroll:  1631704885756 07513167
scroll:  1631704886757 09447625
input:  1631704887254 10000000
```

可以看到，通过AOP思想抽离防抖与节流逻辑后，对于类中方法的优化改造是非常简单的，代码量少，可维护性高

源码地址：[防抖与节流](https://github.com/zhaowei-plus/paradigm-aop/blob/master/src/debounce-throttle/debounce-throttle.js)

#### 基于 mixin 特性提取公共逻辑

Vue中的混入（mixin）是AOP思想的框架实现，主要体现在其生命周期钩子函数的调用顺序，可以插入自定义处理逻辑，基于该特性可以抽离公用逻辑，在合适的场景下注入，快速实现功能扩展。对于mixin特性不了解的同学可以查看官方文档：[传送门](https://cn.vuejs.org/v2/guide/mixins.html)。

例如：项目中分页查询的场景是很常见的，对其中分页逻辑可以做简单抽离，在合适的场景下快速接入，快速实现分页场景的组件扩展，提高开发效率，同时还可以在一定程度上规范数据结构和接口请求，避免出错。

具体实现如下：

1. 抽离基本逻辑

```
export default {
  props: {
    url: {
      require: true,
      type: String
    },
    // 接受外部的结果请求参数
    query: {
      type: Function
    }
  },

  data() {
    return {
      data: [], // 数据列表
      params: {}, // 查询参数
      loading: false, // loading 处理
      // 分页配置
      pagination: { 
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },

  created() {
    // 初始化提交数据，可以配置支持 v-model 绑定
    this.onEmitChange()
  },

  methods: {
    onEmitChange() {
      this.$emit('change', {
        url: this.url,
        data: this.data,
        params: this.params,
        loading: this.loading,
        pagination: this.pagination,
        onSearch: this.onSearch,
        onRefresh: this.onRefresh
      })
    },

    onSearch(params = {}) {
      return this.onRefresh(params, { ...this.pagination, currentPage: 1 })
    },

    async onRefresh(params = this.params, pagination = this.pagination) {
      const {
        currentPage,
        pageSize
      } = pagination
      this.loading = true

      if (this.query) {
        this.loading = true
        this.params = params
        this.pagination.pageSize = pageSize
        this.pagination.currentPage = currentPage

        // 提交数据
        this.onEmitChange()

        // 查询数据
        return this.query(this.url, {
          ...params,
          pageNum: currentPage,
          pageSize
        }).then(({ list = [], total = 0, ...rest }) => {
          this.data = list
          this.pagination.total = total
          return {
            list,
            total,
            ...rest
          }
        }).finally(() => {
          this.loading = false
          // 查询结束，再次提交数据
          this.onEmitChange()
        })
      }
    }
  }
}
```

基本逻辑比较简单，代码地址：[基于 mixin 特性提取公共逻辑](https://github.com/zhaowei-plus/paradigm-aop/blob/master/src/vue-demo/src/mixins/pagination.js)

2. 组件快速接入

目前比较多的分页查询的场景大概有三种，Table、自定义list、上/下拉刷新列表等，都可以基于上面的封装快速扩展

具体可以查看示例demo：[示例](https://zhaowei-plus.github.io/paradigm-aop/src/vue-demo/dist/index.html)

由于接口无法访问，可以克隆下来本地测试，项目地址：[传送门](https://github.com/zhaowei-plus/paradigm-aop/tree/master/src/vue-demo)

> 友好提示： 对于Vue的mixin特性，在使用时需要考虑当前场景是否适合，避免引入冗余逻辑

## 总结

AOP的编程思想是对OOP的扩展，当使用OOP并不适合的情况下，可以考虑采用“增强”切入的方式以达到快速扩展补充，也可以通过AOP可以对当前业务逻辑进行合理划分，对公用属性做统一抽离，如SSO、权限控制、异常处理、数据分析和监控等，从而实现业务快速扩展，提高开发效率。

但需要注意的是，AOP和良好定义的OOP的接口都是用来解决并且实现需求中的切面的问题，但是对于OOP中的接口来说，它仍然需要在相应的模块中去调用该接口中相关的方法，这是它无法避免的，并且一旦接口不得不进行修改的时候，所有事情都会变得一团糟

AOP则不会这样，只需要修改相应的切面“增强”函数，在重新编织(weave)即可，这就是AOP出现的原因。

好了，今天的分享就到此结束了，具体详细的AOP实践有兴趣的小伙伴可以一起深入学习。

## 参考文章

1. [用 AOP 改善 javascript 代码](http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/#prettyPhoto)
2. [在JavaScript中进行面向切面编程](https://juejin.cn/post/6844903831365500936)
3. [Spring AOP就是这么简单啦](https://juejin.cn/post/6844903609889456142)
