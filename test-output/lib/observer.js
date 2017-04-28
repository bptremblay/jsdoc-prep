/**
 * @module observer
 * @requires ../../../../bower_components/sightglass/index
 */
import sightglass from '../../../../bower_components/sightglass/index';
sightglass.adapters['.'] = {
  id: '_rv',
  counter: 0,
  weakmap: {},
  /**
   * @param obj  
   * @return {Boolean}
   */
  weakReference(obj) {
    let id;
    if (!obj.hasOwnProperty(this.id)) {
      id = this.counter++;
      Object.defineProperty(obj, this.id, {
        value: id
      });
    }
    return this.weakmap[obj[this.id]] || (this.weakmap[obj[this.id]] = {
      callbacks: {}
    });
  },
  /**
   * @param ref  
   * @param id  
   * @return {Object} UnaryExpression
   */
  cleanupWeakReference(ref, id) {
    if (!Object.keys(ref.callbacks).length) {
      if (!ref.pointers || !Object.keys(ref.pointers).length) {
        return delete this.weakmap[id];
      }
    }
  },
  /**
   * @param obj  
   * @param fn  
   * @return {Object} AssignmentExpression
   */
  stubFunction(obj, fn) {
    let original = obj[fn];
    let map = this.weakReference(obj);
    let {
      weakmap
    } = this;
    /**
     * @function
     */
    return obj[fn] = function () {
      let response = original.apply(obj, arguments);
      for (let r in map.pointers) {
        let k = map.pointers[r];
        for (let callback of Array.from((weakmap[r] != null ? weakmap[r].callbacks[k] : undefined) != null ? (weakmap[r] != null ? weakmap[r].callbacks[k] : undefined) : [])) {
          callback();
        }
      }
      return response;
    };
  },
  /**
   * @param obj  
   * @param ref  
   * @param keypath
   */
  observeMutations(obj, ref, keypath) {
    if (Array.isArray(obj)) {
      let map = this.weakReference(obj);
      if (map.pointers == null) {
        map.pointers = {};
        let functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
        for (let fn of Array.from(functions)) {
          this.stubFunction(obj, fn);
        }
      }
      if (map.pointers[ref] == null) {
        map.pointers[ref] = [];
      }
      if (!Array.from(map.pointers[ref]).includes(keypath)) {
        return map.pointers[ref].push(keypath);
      }
    }
  },
  /**
   * @param obj  
   * @param ref  
   * @param keypath
   */
  unobserveMutations(obj, ref, keypath) {
    if (Array.isArray(obj) && (obj[this.id] != null)) {
      let map;
      if (map = this.weakmap[obj[this.id]]) {
        let pointers;
        if (pointers = map.pointers[ref]) {
          let idx;
          if ((idx = pointers.indexOf(keypath)) >= 0) {
            pointers.splice(idx, 1);
          }
          if (!pointers.length) {
            delete map.pointers[ref];
          }
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    }
  },
  /**
   * @param obj  
   * @param keypath  
   * @param callback
   */
  observe(obj, keypath, callback) {
    let {
      callbacks
    } = this.weakReference(obj);
    if (callbacks[keypath] == null) {
      callbacks[keypath] = [];
      let desc = Object.getOwnPropertyDescriptor(obj, keypath);
      if (!(desc != null ? desc.get : undefined) && !(desc != null ? desc.set : undefined)) {
        let value = obj[keypath];
        Object.defineProperty(obj, keypath, {
          enumerable: true,
          get() {
            return value;
          },
          set: newValue => {
            if (newValue !== value) {
              let map;
              this.unobserveMutations(value, obj[this.id], keypath);
              value = newValue;
              if (map = this.weakmap[obj[this.id]]) {
                ({
                  callbacks
                } = map);
                if (callbacks[keypath]) {
                  for (let cb of Array.from(callbacks[keypath].slice())) {
                    if (Array.from(callbacks[keypath]).includes(cb)) {
                      cb();
                    }
                  }
                }
                return this.observeMutations(newValue, obj[this.id], keypath);
              }
            }
          }
        });
      }
    }
    if (!Array.from(callbacks[keypath]).includes(callback)) {
      callbacks[keypath].push(callback);
    }
    return this.observeMutations(obj[keypath], obj[this.id], keypath);
  },
  /**
   * @param obj  
   * @param keypath  
   * @param callback
   */
  unobserve(obj, keypath, callback) {
    let map;
    if (map = this.weakmap[obj[this.id]]) {
      let callbacks;
      if (callbacks = map.callbacks[keypath]) {
        let idx;
        if ((idx = callbacks.indexOf(callback)) >= 0) {
          callbacks.splice(idx, 1);
          if (!callbacks.length) {
            delete map.callbacks[keypath];
            this.unobserveMutations(obj[keypath], obj[this.id], keypath);
          }
        }
        return this.cleanupWeakReference(map, obj[this.id]);
      }
    }
  },
  /**
   * @param obj  
   * @param keypath
   */
  get(obj, keypath) {
    return obj[keypath];
  },
  /**
   * @param obj  
   * @param keypath  
   * @param value  
   * @return {Object} AssignmentExpression
   */
  set(obj, keypath, value) {
    return obj[keypath] = value;
  }
};
sightglass.root = '.';
export default sightglass;