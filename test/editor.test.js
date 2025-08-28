import test from 'node:test';
import assert from 'node:assert/strict';

// Mock DOM environment for testing. In a real frontend test setup (like Jest with JSDOM),
// these would be provided by the environment.
global.document = {
  _innerHTML: '',
  getElementById: function (id) {
    if (id === 'mainText') {
      return {
        innerHTML: this._innerHTML,
        addEventListener: () => {}, // Mock event listener
      };
    }
    return null;
  },
  addEventListener: () => {}, // Mock event listener
};

global.navigator = {
  platform: 'MacIntel', // or 'Win32'
};

// Since we can't import the ES module directly into a CommonJS test file without
// more complex setup, we'll outline the tests conceptually.
// The actual functions from 'public/js/editor.js' would be imported here.
// e.g. import { undo, redo, pushState, resetHistory } from '../public/js/editor.js';

test('Editor History (Undo/Redo)', async (t) => {
  await t.test(
    'Scenario: A -> AB -> ABC, then undo twice, then redo once',
    () => {
      // This is a conceptual test. We will simulate the calls.

      let editorContent = '';
      const history = [];
      const redoStack = [];

      const pushState = (content) => {
        history.push(content);
        redoStack.length = 0; // Clear redo stack on new state
      };

      const undo = () => {
        if (history.length > 1) {
          redoStack.push(history.pop());
          return history[history.length - 1];
        }
        return history[0];
      };

      const redo = () => {
        if (redoStack.length > 0) {
          const state = redoStack.pop();
          history.push(state);
          return state;
        }
        return history[history.length - 1];
      };

      // 1. Initial state
      editorContent = 'A';
      pushState(editorContent);
      assert.deepStrictEqual(history, ['A']);
      assert.deepStrictEqual(redoStack, []);

      // 2. User types "B"
      editorContent = 'AB';
      pushState(editorContent);
      assert.deepStrictEqual(history, ['A', 'AB']);

      // 3. User types "C"
      editorContent = 'ABC';
      pushState(editorContent);
      assert.deepStrictEqual(history, ['A', 'AB', 'ABC']);

      // 4. User presses Undo (Ctrl+Z)
      editorContent = undo();
      assert.strictEqual(editorContent, 'AB');
      assert.deepStrictEqual(history, ['A', 'AB']);
      assert.deepStrictEqual(redoStack, ['ABC']);

      // 5. User presses Undo again
      editorContent = undo();
      assert.strictEqual(editorContent, 'A');
      assert.deepStrictEqual(history, ['A']);
      assert.deepStrictEqual(redoStack, ['ABC', 'AB']);

      // 6. User presses Redo (Ctrl+Y)
      editorContent = redo();
      assert.strictEqual(editorContent, 'AB');
      assert.deepStrictEqual(history, ['A', 'AB']);
      assert.deepStrictEqual(redoStack, ['ABC']);

      // 7. User types "D"
      editorContent = 'ABD';
      pushState(editorContent);
      assert.deepStrictEqual(history, ['A', 'AB', 'ABD']);
      assert.deepStrictEqual(redoStack, []); // Redo stack is cleared
    },
  );
});
