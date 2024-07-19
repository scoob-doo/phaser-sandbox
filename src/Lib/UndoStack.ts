export default class UndoStack {
  private stack: (() => void)[] = []

  // Push a new undo function onto the stack
  push(undoFunction: () => void): void {
    this.stack.push(undoFunction)
  }

  // Pop the most recent undo function from the stack and execute it
  undo(): void {
    const undoFunction = this.stack.pop()
    if (undoFunction) {
      undoFunction()
    }
  }
}
