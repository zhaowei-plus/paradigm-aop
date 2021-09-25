import { AbstractCursorEvent } from './AbstractCursorEvent.js'

export class MouseClickEvent extends AbstractCursorEvent {
  type = 'mouse:click'
}
