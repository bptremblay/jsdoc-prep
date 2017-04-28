/**
 * The class Observable.
 */
class Observable {
  /**
   * @param o
   */
  addObserver(o) {
    if (o == null) {
      return;
    }
    if (o.update == null) {
      return;
    }
    if (this._observers == null) {
      this._observers = [];
    }
    if (this._hasObserver(o) == false) {
      this._observers.push(o);
    }
  }
  /**
   * @private 
   * @param o
   */
  _hasObserver(o) {
    return (this._observers.indexOf(0) !== -1);
  }
  /**
   * @private 
   */
  _clearChanged() {
    this._changed = false;
  }
  /**
   * @function
   */
  countObservers() {
    return this._observers.length;
  }
  /**
   * @param o
   */
  deleteObserver(o) {
    let where = this._observers.indexOf(o);
    if (where !== -1) {
      this._observers.splice(where, 1);
    }
    return this._observers;
  }
  /**
   * @function
   */
  deleteObservers() {
    this._observers = [];
  }
  /**
   * Returns true if has changed.
   * @param o
   * @return {Object} boolean
   */
  hasChanged(o) {
    return this._changed;
  }
  /**
   * @param o
   */
  notifyObservers(o) {
    if (this._changed) {
      this._notifyObservers(o);
    }
  }
  /**
   * @private 
   * @param o
   */
  _notifyObservers(o) {
    o._notifier = this;
    if (this._observers == null) {
      this._observers = [];
    }
    let i = 0;
    let observer = null;
    for (i = 0; i < this._observers.length; i++) {
      observer = this._observers[i];
      if (observer.enable_updates == true) {
        if (observer.update) {
          observer.update(o);
        }
      }
    }
    this._clearChanged();
  }
  /**
   * @function
   */
  setChanged() {
    this._changed = true;
  }
  /**
   * @function
   */
  suspendUpdates() {
    this.enable_updates = false;
  }
  /**
   * @function
   */
  resumeUpdates() {
    this.enable_updates = true;
  }
  /**
   * @param o
   */
  update(o) {}
}
export default Observable;
