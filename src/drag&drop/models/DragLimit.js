import { Drag } from './Drag.js'

export class DragLimit extends Drag {
  onMouseMove = (event) => {
    let left = event.clientX - this.offsetX
    let top = event.clientY - this.offsetY

    if (left < 0) {
      left = 0
    } else if (left > this.container.clientWidth - this.target.offsetWidth) {
      left = this.container.clientWidth - this.target.offsetWidth
    }

    if (top < 0) {
      top = 0
    } else if (top > this.container.clientHeight - this.target.offsetHeight) {
      top = this.container.clientHeight - this.target.offsetHeight
    }

    this.target.style.left = left + 'px'
    this.target.style.top = top + 'px'

    if (Date.now() - this.timer > 1000 / 60) {
      this.dispatch({
        left,
        top
      })
      this.timer = Date.now()
    }
  }
}
