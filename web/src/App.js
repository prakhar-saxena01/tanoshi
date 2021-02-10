import './App.css';
import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import ReaderSetting from './common/ReaderSetting';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={"App"}>
        <Router>
          <Library path="/" >
            <LibraryManga path="/" />
            <Update path="update" />
            <History path="history" />
          </Library>
          <Browse path="browse">
            <BrowseSources path="/" />
            <BrowseSource path=":sourceName" />
            <BrowseSource path=":sourceName/latest" />
          </Browse>
          <Manga path="manga/:mangaId" />
          <Reader path="chapter/:chapterId" />
          <Settings path="settings">
            <SettingCategories path="/" />
            <ReaderSetting path="reader" />
            <SettingSources path="source" />
            <SettingSource path="source/:sourceName" />
          </Settings>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
