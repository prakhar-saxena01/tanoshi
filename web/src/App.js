import './App.css';
import 'animate.css'
import { Router } from "@reach/router";
import Library from './Library';
import Browse from './Browse';
import BrowseSources from './BrowseSources';
import BrowseSource from './BrowseSource';
import Manga from './Manga';
import Reader from './Reader';
import Settings from './Settings';
import SettingCategories from './SettingCategories';
import SettingSources from './SettingSources';
import SettingSource from './SettingSource';
import SettingReader from './SettingReader';

function App() {
  return (
    <div className="App">
      <Router>
        <Library path="/" />
        <Browse path="browse">
          <BrowseSources path="/"/>
          <BrowseSource path="/:sourceName"/>
        </Browse>
        <Manga path="manga/:mangaId" />
        <Reader path="chapter/:chapterId" />
        <Settings path="settings">
          <SettingCategories path="/" />
          <SettingReader path="reader" />
          <SettingSources path="source" />
          <SettingSource path="source/:sourceName"/>
        </Settings>
      </Router>
    </div>
  );
}

export default App;
