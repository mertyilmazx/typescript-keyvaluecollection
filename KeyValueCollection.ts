export class KeyValueCollection<K, V> {
  keys: K[] = [];
  values: V[] = [];

  constructor() {
    this.keys = [];
    this.values = [];
  }

  get(key: K): V {
    const index: number = this.keys.indexOf(key);
    return this.values[index];
  }
  getAt(index: number): V {
    return this.values[index];
  }
  getRange(startIndex: number, endIndex: number): V[] {
    const items: V[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(this.values[i]);
    }
    return items;
  }

  add(value: V, key: K) {
    this.keys.push(key);
    this.values.push(value);
    if (this.onItemAdded) {
      this.onItemAdded(value, key);
    }
  }
  remove(key?: K, value?: V) {
    let deleteKey: K;
    let deleteValue: V;
    if (key != null || key != undefined) {
      const index: number = this.keys.indexOf(key);
      deleteKey = this.keys[index];
      deleteValue = this.values[index];
      this.keys.splice(index, 1);
      this.values.splice(index, 1);
    } else {
      const index: number = this.keys.indexOf(key);
      deleteKey = this.keys[index];
      deleteValue = this.values[index];
      this.keys.splice(index, 1);
      this.values.splice(index, 1);
    }
    if (this.onItemDeleted) {
      this.onItemDeleted(deleteValue, deleteKey);
    }
  }
  removeAt(index: number) {
    const deletedKeys: K[] = this.keys.splice(index, 1);
    const deletedValues: V[] = this.values.splice(index, 1);

    if (this.onItemDeleted) {
      this.onItemDeleted(deletedValues[0], deletedKeys[0]);
    }
  }
  clear() {
    const _that = this;
    this.keys = [];
    this.values = [];
    if (this.onItemClear) {
      this.onItemClear(_that);
    }
  }
  clone(): KeyValueCollection<K, V> {
    const newMixedCollection: KeyValueCollection<K, V> = new KeyValueCollection();
    newMixedCollection.keys = this.keys;
    newMixedCollection.values = this.values;
    return newMixedCollection;
  }
  count(): number {
    return this.keys.length;
  }
  replace(key: K, value: V) {
    const index = this.keys.indexOf(key);
    const oldValue: any = this.values[<any>key];
    if (index !== -1) {
      this.values[index] = value;
    }

    if (this.onItemChange) {
      this.onItemChange(oldValue, value, key);
    }
  }
  isInCollection(key?: K, value?: V): boolean {
    if (key != null || key != undefined) {
      return this.keys.indexOf(key) > -1 ? true : false;
    } else if (value != null || value != undefined) {
      return this.values.indexOf(value) > -1 ? true : false;
    }
  }
  indexOf(key?: K, value?: V): number {
    if (key != undefined || key != null) {
      return this.keys.indexOf(key);
    } else if (value != undefined || value != null) {
      return this.values.indexOf(value);
    }
  }
  insert(index: number, value: V, key: K) {
    this.keys.splice(index, 0, key);
    this.values.splice(index, 0, value);

    if (this.onItemAdded) {
      this.onItemAdded(value, key);
    }
  }
  sort(byKey: boolean) {
    const combine: any[] = [];
    for (let i = 0; i < this.keys.length; i++) {
      combine.push({ key: this.keys[i], value: this.values[i] });
    }

    if (byKey) {
      combine.sort(function(a, b) {
        return a.key < b.key ? -1 : a.key == b.key ? 0 : 1;
      });
    } else {
      combine.sort(function(a, b) {
        return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
      });
    }
    for (let j = 0; j < combine.length; j++) {
      this.values[j] = combine[j].value;
      this.keys[j] = combine[j].key;
    }
  }
  toObject(): Object {
    const object = new Object();

    //for (const i = 0; i < this.Count(); i++) {
    //    object[<any>(this.Keys[i])] = this.Values[i];
    //}
    return object;
  }
  toJSON(): string {
    return JSON.stringify(this.toObject());
  }
  toXML(): string {
    let xmlString: string = "";
    for (let i = 0; i < this.values.length; i++) {
      xmlString +=
        "<" + this.keys[i] + ">" + this.values[i] + "<" + this.keys[i] + "/>";
    }
    return xmlString;
  }

  first(): V {
    return this.values[0];
  }
  last(): V {
    return this.values[this.count() - 1];
  }

  // static function
  static parseFromObject(object: any): KeyValueCollection<string, any> {
    const mixedCollection = new KeyValueCollection<string, any>();
    for (const key in object) {
      if (object.hasOwnProperty(key) && typeof object[key] !== "function") {
        mixedCollection.values.push(object[key]);
        mixedCollection.keys.push(key);
      }
    }
    return mixedCollection;
  }
  static parseFromJSON(JSONStr: string): KeyValueCollection<string, any> {
    const obj: any = JSON.parse(JSONStr);
    return this.parseFromObject(obj);
  }
  static parseFromArray(
    arrVal: any[],
    arrKeys: string[]
  ): KeyValueCollection<string, any> {
    const newCollection = new KeyValueCollection<string, any>();
    for (let i = 0; i < arrVal.length; i++) {
      newCollection.add(arrVal[i], arrKeys[i]);
    }
    return newCollection;
  }
  static parseFromString(textToParse: string, splitSeperator: string) {
    const newCollection = new KeyValueCollection<string, any>();

    for (const item in textToParse.split(splitSeperator)) {
      newCollection.add(item, item);
    }
    return newCollection;
  }

  // event
  onItemAdded: (value: V, key: K) => void;
  onItemDeleted: (value: V, key: K) => void;
  onItemChange: (oldValue: V, newValue: V, key: K) => void;
  onItemClear: (deletedCollection: KeyValueCollection<K, V>) => void;
}
