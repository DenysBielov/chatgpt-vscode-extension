import * as vscode from 'vscode';

export default class Store {
  state: any;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.state = context.workspaceState;
  }

  // Set a value in the state
  set(key: string, value: any) {
    this.state[key] = value;
  }

  // Get a value from the state
  get(key: string) {
    return this.state[key];
  }

  // Remove a value from the state
  remove(key: string) {
    delete this.state[key];
  }

  // Clear the state
  clear() {
    this.state = {};
  }
}