

module.exports = class Store{
    constructor() {
        this._store = new Map();
    }
    getItem(key) {
        return this._store.get(key);
    }

    setItem(key, value) {
        this._store.set(key, value);
    }
}

