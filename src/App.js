import logo from './logo.svg';
import './App.css';
import Root from './components/Root/Root';
import './main/services/demoInterceptor';
import MinimalErrorBoundary from './components/MinimalErrorBoundary';

function App() {
  return (
    <MinimalErrorBoundary>
      <Root />
    </MinimalErrorBoundary>
  );
}

export default App;
