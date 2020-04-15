import { Observable, Observer, Subject, zip } from 'rxjs'

export class Lock {
  private lockAcquire = new Subject<Observer<void>>()
  private lockRelease = new Subject()

  constructor() {
    zip(this.lockAcquire, this.lockRelease.asObservable()).subscribe(
      ([acquirer, released]) => {
        acquirer.next()
        acquirer.complete()
      },
    )

    this.release()
  }

  public acquire(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this.lockAcquire.next(observer)
    })
  }

  public release() {
    this.lockRelease.next()
  }
}
