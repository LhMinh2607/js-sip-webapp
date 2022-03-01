// import logo from './logo.svg';
import { Route, Routes } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<HomePage></HomePage>}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;