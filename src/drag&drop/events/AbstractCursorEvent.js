
export class AbstractCursorEvent {
  constructor(data) {
    this.data = data || {
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      target: null,
      view: window
    }

    this.transformCoordinates()
  }

  // 坐标转换
  transformCoordinates () {
    // frameElement 获取嵌入到 view 中的元素（如：<iframe> 或 <object >），如果是顶层则为null
    const { frameElement } = this.data.view

    if (frameElement && this.data.view !== window) {
      // 如果嵌入的是 iframe
      const frameRect = frameElement.getBoundingClientRect()

      /**
       * offsetWidth/offsetHeight 元素宽度/高度（包括元素宽度/高度、内边距和边框，不包括外边框）
       * clientWidth/clientHeight 元素宽度/高度（包括元素宽度/高度，不包括边框和外边框）
       * */

      // 处理有缩放的情况
      const scale = frameRect.width / frameElement['offsetWidth']

      this.data.topClientX = this.data.clientX * scale + frameRect.x
      this.data.topClientY = this.data.clientY * scale + frameRect.y
      this.data.topPageX = this.data.pageX + frameRect.x - this.data.view.scrollX
      this.data.topPageY = this.data.pageY + frameRect.y - this.data.view.scrollY

      const topElement = document.elementFromPoint(
        this.data.topPageX,
        this.data.topClientY
      )

      if (topElement !== frameElement) {
        this.data.target = topElement
      }
    } else {
      this.data.topClientX = this.data.clientX
      this.data.topClientY = this.data.clientY
      this.data.topPageX = this.data.pageX
      this.data.topPageY = this.data.pageY
    }
  }
}
