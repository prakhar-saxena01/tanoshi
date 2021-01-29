import './App.css';
import 'animate.css'
import { Router } from "@reach/router";
import Library from './Library';
import LibraryManga from './LibraryManga';
import Browse from './Browse';
import BrowseSources from './BrowseSources';
import BrowseSource from './BrowseSource';
import Manga from './Manga';
import Reader from './Reader';
import Update from './Update';
import History from './History';
import Settings from './Settings';
import SettingCategories from './SettingCategories';
import SettingSources from './SettingSources';
import SettingSource from './SettingSource';
import SettingReader from './SettingReader';

function App() {
  document.body.classList.add('bg-gray-100');
  document.body.classList.add('dark:bg-gray-900');

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  return (
    <div className="App">
      <Router>
        <Library path="/" >
          <LibraryManga path="/" />
          <Update path="update" />
          <History path="history" />
        </Library>
        <Browse path="browse">
          <BrowseSources path="/" />
          <BrowseSource path="/:sourceName" />
        </Browse>
        <Manga path="manga/:mangaId" />
        <Reader path="chapter/:chapterId" />
        <Settings path="settings">
          <SettingCategories path="/" />
          <SettingReader path="reader" />
          <SettingSources path="source" />
          <SettingSource path="source/:sourceName" />
        </Settings>
      </Router>
    </div>
  );
}

export default App;
