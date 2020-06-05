import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Firebase from '../../firebase'

function NotesList(props) {
    const note = props.quotes
    
    const classes = {
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: 2,
            height: 140,
            width: 100,
        },
    }
    return(
        <div container className={classes.root}>
            <Grid container justify="center" spacing={2}>
                {note.map(element => 
                <Grid item key={element.id} xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <Note
                            title={element.note.title}
                            content={element.note.content}
                            date={element.note.date}
                            noteID={element.id}
                        />
                    </Paper>
                </Grid>
                )}
            </Grid>
        </div>
    )
}

function Note(props) {
    const classes = {
        main: {
            minWidth: 275,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
    }

    return (
        <Card className={classes.main}>
        <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                Created at: {props.date}
            </Typography>
            <Typography variant="h5" component="h2">
                {props.title}
            </Typography>
            <Typography variant="body2" component="p">
                {props.content}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" 
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />} 
            onClick={
                () => {
                    Firebase.deleteNote(props.noteID).catch(err => {
                        console.log(err.message);
                        
                    })
                }
            } >Delete</Button>
        </CardActions>
        </Card>
    );
}


export default NotesList
