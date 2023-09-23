import * as vscode from 'vscode';

export default class Store {
  constructor(private readonly _state: vscode.Memento) {
  }

  // Set a value in the state
  set(key: string, value: any) {
    this._state.update(key, value);
  }

  // Get a value from the state
  get<TData>(key: string): TData {
    return this._state.get(key) as TData;
  }

  // Remove a value from the state
  remove(key: string) {
    this._state.update(key, undefined);
  }

  // Clear the state
  clear() {
    for (const key in this._state.keys()) {
      this._state.update(key, undefined);
    }
  }
}