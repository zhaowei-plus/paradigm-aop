import { AbstractCursorEvent } from './AbstractCursorEvent.js'

export class DragStopEvent extends AbstractCursorEvent {
  type = 'drag:stop'
}
