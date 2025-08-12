// App.js
import React from 'react';
import TextEditor from './modules/TextEditor';
import Book from './modules/Book';
import Characters from './modules/Characters';
import World from './modules/World';
import DataPersistence from './modules/DataPersistence';
import Plot from './modules/Plot';
import Magic from './modules/Magic';
import Quests from './modules/Quests';

function App() {
  return (
    <div className="App">
      <TextEditor />
      <Book />
      <Characters />
      <World />
      <DataPersistence />
      <Plot />
      <Magic />
      <Quests />
    </div>
  );
}

export default App;
