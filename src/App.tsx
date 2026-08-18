import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkspacePage } from './components/WorkspacePage';

type ViewState = 'landing' | 'workspace';

function App() {
  const [view, setView] = useState<ViewState>('landing');

  return (
    <div className="app-root">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('workspace')} />
      ) : (
        <WorkspacePage onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
