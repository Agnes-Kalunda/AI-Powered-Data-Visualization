import logo from './logo.svg';
import './App.css';
import DatasetUpload from './components/DatasetUpload';
import DatasetList from './components/DatasetList';

function App() {
  return (
    <div className="App">
<DatasetUpload/>
<DatasetList/>
    </div>
  );
}

export default App;
