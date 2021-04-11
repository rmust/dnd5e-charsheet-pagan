import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { CharactersSheetPage } from './pages/characters-sheet-page';
import { SpellsPage } from './pages/spells-page';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/dashboard/:id/:sheet/spells">
          <SpellsPage />
        </Route>
        <Route path="/dashboard/:id/:sheet">
          <CharactersSheetPage />
        </Route>
        <Route path="/dashboard/:id">
          <DashboardPage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
