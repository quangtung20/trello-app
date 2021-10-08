import React from 'react';
import './App.scss';
import AppBar from './components/AppBar/AppBar';
import BoardBar from './components/BoadBar/BoardBar';
import BoardContent from './components/BoardContent/BoardContent';
// khi cai thu vien gap loi nao thi cu chay npm audit fix

function App() {
  return (
    <div className="trello-master">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
