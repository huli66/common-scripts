/**
 * 队列 先进先出 最多10条
 */
class OperationQueue {
  private queue: any[] = [];
  private maxLength = 10;

  constructor(maxLength: number = 10) {
    this.queue = [];
    this.maxLength = maxLength;
  }

  add(item: any) {
    this.queue.unshift(item);
    if (this.queue.length > this.maxLength) {
      this.queue.length = this.maxLength;
    }
  }

  get() {
    return this.queue;
  }
}

export default OperationQueue;
