import { Event } from './Event.js'
import { DragMoveEvent } from '../events/DragMoveEvent.js'
import { DragStartEvent } from '../events/DragStartEvent.js'
import { DragStopEvent } from '../events/DragStopEvent.js'


const GlobalState = {
  dragging: false,
  onMouseDownAt: 0, // 鼠标按下时间
  startEvent: null,
  moveEvent: null
}

export class Drag extends Event {
  constructor(props) {
    super(props)
    this.offsetX = 0
    this.offsetY = 0
    this.timer = Date.now()

    this.mount()
  }

  onMouseDown = (event) => {
    // MouseEvent
    // ctrlKey（标明是否同时按下 ctrl）
    // metaKey（标明是否同时按下 meta）
    // button。默认0。当事件发生时，哪个按键按下或被释放: 0（左键按下） 1 2（右键按下）
    if (event.button !== 0 || event.ctrlKey || event.metaKey) {
      return
    }

    GlobalState.startEvent = event
    GlobalState.dragging = false
    GlobalState.onMouseDownAt = Date.now()

    this.offsetX = event.clientX - this.target.offsetLeft
    this.offsetY = event.clientY - this.target.offsetTop

    // 这里需要区分 document
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onDistanceChange)
  }

  onDistanceChange = (event) => {
    // 当鼠标按下拖动距离超过一定具体，则认定为是拖拽事件
    const distance = Math.sqrt(
      Math.pow(event.pageX - GlobalState.startEvent.pageX, 2) +
      Math.pow(event.pageY - GlobalState.startEvent.pageY, 2)
    )
    // 截流处理
    const timeDelta = Date.now() - GlobalState.onMouseDownAt
    // 事件超过 10 毫秒，距离超过 4 像素
    if (timeDelta > 10 && event !== GlobalState.startEvent && distance > 4) {
      this.removeEventListener('mousemove', this.onDistanceChange)
      this.onStartDrag(event)
    }
  }

  onMouseMove = (event) => {
    if (
      event.clientX === GlobalState.moveEvent?.clientX &&
      event.clientY === GlobalState.moveEvent?.clientY
    ) {
      return
    }

    this.dispatch(
      new DragMoveEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        target: event.target, // 拖拽目标
        view: event.view,
      })
    )
    GlobalState.moveEvent = event

    // 移动目标对象
    this.target.style.left = event.clientX - this.offsetX + 'px'
    this.target.style.top = event.clientY - this.offsetY + 'px'
  }

  onMouseUp = (event) => {
    if (GlobalState.dragging) {
      this.dispatch(
        new DragStopEvent({
          clientX: event.clientX,
          clientY: event.clientY,
          pageX: event.pageX,
          pageY: event.pageY,
          target: event.target,
          view: event.view, // 事件所属视图
        })
      )
    }
    GlobalState.dragging = false
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onDistanceChange)
  }

  onStartDrag = (event) => {
    if (GlobalState.dragging) {
      return
    }
    GlobalState.startEvent = GlobalState.startEvent || event

    document.addEventListener('mousemove', this.onMouseMove)

    this.dispatch(
      new DragStartEvent({
        clientX: GlobalState.startEvent.clientX,
        clientY: GlobalState.startEvent.clientY,
        pageX: GlobalState.startEvent.pageX,
        pageY: GlobalState.startEvent.pageY,
        target: GlobalState.startEvent.target,
        view: GlobalState.startEvent.view,
      })
    )
    GlobalState.dragging = true
  }

  mount() {
    this.attach()
  }

  unmount() {
    this.detach()
  }

  attach() {
    this.addEventListener('mousedown', this.onMouseDown)
  }

  detach() {
    this.removeEventListener('mousedown', this.onMouseDown)
  }
}
