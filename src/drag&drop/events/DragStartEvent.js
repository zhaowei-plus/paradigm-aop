import { AbstractCursorEvent } from './AbstractCursorEvent.js'

export class DragStartEvent extends AbstractCursorEvent {
  type = 'drag:start'
}
