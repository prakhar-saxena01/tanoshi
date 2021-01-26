import './App.css';
import { Router } from "@reach/router";
import Library from './Library';
import Browse from './Browse';
import BrowseSources from './BrowseSources';
import BrowseSource from './BrowseSource';
import SourceLogin from './SourceLogin';
import Manga from './Manga';
import Reader from './Reader';
import Settings from './Settings';
import SettingCategories from './SettingCategories';
import SettingSources from './SettingSources';

function App() {
  return (
    <div className="App">
      <Router>
        <Library path="/" />
        <Browse path="browse">
          <BrowseSources path="/"/>
          <BrowseSource path="/:sourceName"/>
          <SourceLogin path="/:sourceName/login"/>
        </Browse>
        <Manga path="manga/:mangaId" />
        <Reader path="chapter/:chapterId" />
        <Settings path="settings">
          <SettingCategories path="/" />
          <SettingSources path="sources" />
        </Settings>
      </Router>
    </div>
  );
}

export default App;
