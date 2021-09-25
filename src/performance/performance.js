
// 性能分析：统计一段代码在用户侧的执行时间
function measure(_, name, descriptor) {
  const value = descriptor.value

  descriptor.value = function () {
    performance.mark('startWork')
    const result = value.apply(this, arguments)
    performance.mark('endWork')
    performance.measure('work', 'startWork', 'endWork')
    performance
      .getEntries()
      .map(entry => console.log(JSON.stringify(entry, null, 2)))
    return result
  }
}

class Dialog {
  @measure
  showDialog () {
    for (let i = 0; i < 1_0000_0000; i++) {

    }
  }
}

const dialog = new Dialog()
dialog.showDialog()
