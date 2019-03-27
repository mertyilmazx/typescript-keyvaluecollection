export class KeyValueCollection<K, V> {
  keys: K[] = [];
  values: V[] = [];

  constructor() {
    this.keys = [];
    this.values = [];
  }

  get(key: K): V {
    var index: number = this.keys.indexOf(key);
    return this.values[index];
  }
  getAt(index: number): V {
    return this.values[index];
  }
  getRange(startIndex: number, endIndex: number): V[] {
    var items: V[] = [];
    for (var i = startIndex; i < endIndex; i++) {
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
    var deleteKey: K;
    var deleteValue: V;
    if (key != null || key != undefined) {
      var index: number = this.keys.indexOf(key);
      deleteKey = this.keys[index];
      deleteValue = this.values[index];
      this.keys.splice(index, 1);
      this.values.splice(index, 1);
    } else {
      var index: number = this.keys.indexOf(key);
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
    var deletedKeys: K[] = this.keys.splice(index, 1);
    var deletedValues: V[] = this.values.splice(index, 1);

    if (this.onItemDeleted) {
      this.onItemDeleted(deletedValues[0], deletedKeys[0]);
    }
  }
  clear() {
    var _that = this;
    this.keys = [];
    this.values = [];
    if (this.onItemClear) {
      this.onItemClear(_that);
    }
  }
  clone(): KeyValueCollection<K, V> {
    var newMixedCollection: KeyValueCollection<K, V> = new KeyValueCollection();
    newMixedCollection.keys = this.keys;
    newMixedCollection.values = this.values;
    return newMixedCollection;
  }
  count(): number {
    return this.keys.length;
  }
  replace(key: K, value: V) {
    var index = this.keys.indexOf(key);
    var oldValue: any = this.values[<any>key];
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
    var combine: any[] = [];
    for (var i = 0; i < this.keys.length; i++) {
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
    for (var j = 0; j < combine.length; j++) {
      this.values[j] = combine[j].value;
      this.keys[j] = combine[j].key;
    }
  }
  toObject(): Object {
    var object = new Object();

    //for (var i = 0; i < this.Count(); i++) {
    //    object[<any>(this.Keys[i])] = this.Values[i];
    //}
    return object;
  }
  toJSON(): string {
    return JSON.stringify(this.toObject());
  }
  toXML(): string {
    var xmlString: string = "";
    for (var i = 0; i < this.values.length; i++) {
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
    var mixedCollection = new KeyValueCollection<string, any>();
    for (var key in object) {
      if (object.hasOwnProperty(key) && typeof object[key] !== "function") {
        mixedCollection.values.push(object[key]);
        mixedCollection.keys.push(key);
      }
    }
    return mixedCollection;
  }
  static parseFromJSON(JSONStr: string): KeyValueCollection<string, any> {
    var obj: any = JSON.parse(JSONStr);
    return this.parseFromObject(obj);
  }
  static parseFromArray(
    arrVal: any[],
    arrKeys: string[]
  ): KeyValueCollection<string, any> {
    var newCollection = new KeyValueCollection<string, any>();
    for (var i = 0; i < arrVal.length; i++) {
      newCollection.add(arrVal[i], arrKeys[i]);
    }
    return newCollection;
  }
  static parseFromString(textToParse: string, splitSeperator: string) {
    var newCollection = new KeyValueCollection<string, any>();

    for (var item in textToParse.split(splitSeperator)) {
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
