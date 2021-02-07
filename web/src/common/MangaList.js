import React from '@react';
import Cover from './Cover';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

function MangaList(props) {
    const classes = useStyles();

    const {mangaList} = props;

    return (
        <div>{mangaList && mangaList.map((el, index) => (
            <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
        ))}
        </div>
    )
}

export default MangaList;