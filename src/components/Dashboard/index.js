import React, { useEffect, useState } from 'react'
import { 
	Typography, 
	Paper,
	TextField, 
	Button,
	AppBar,
	Toolbar,
	IconButton, CssBaseline, Grid
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import firebase from '../firebase'
import { withRouter } from 'react-router-dom'

import NotesList from './NotesList'
import Firebase from '../firebase'

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: 2,
		marginRight: 2,
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	submit: {
		marginLeft: theme.spacing.unit * 140,
	}
})



function Dashboard(props) {
	const { classes } = props

	if(!firebase.getCurrentUsername()) {
		// not logged in
		alert('Please login first')
		props.history.replace('/login')
		return null
	}

	const [quote, setQuote] = useState('')
	const [notes, setNotes] = useState([{id:'', note:{title: '', date:'', content:'' }}])

	useEffect(() => {
		firebase.getCurrentUserQuote().then(setQuote)
		firebase.getNotes().then(setNotes)
	})

	return (
		<React.Fragment>
			<AppBar position="static" className={classes.root}>
				<Toolbar>
					<IconButton edge="start" className={classes.avatar} >
						<VerifiedUserOutlined />
					</IconButton>
					<Typography className={classes.title}>
						{ firebase.getCurrentUsername() }
					</Typography>
					<Button
						className={classes.submit}
						type="submit"
						variant="contained"
						color="secondary"
						onClick={logout}>
					Logout
          			</Button>
				</Toolbar>
			</AppBar>
			<CssBaseline />
			<Grid container maxWidth="xs">
				<Grid xs={12} sm={4} spacing={2}>
					<Paper className={classes.paper}>
						<NoteFormBase />
					</Paper>
				</Grid>
				<Grid xs={12} sm={8} spacing={3}>
					<NotesList quotes={notes} />
				</Grid>
				
			</Grid>
		</React.Fragment>
		
	)

	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}

}

const NoteFormBase = (props) => {

	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')


	async function handleSave() {
		await Firebase.addNote(title, content)
		.catch(err => {
			alert(err)
		})
	}

	return(
		<form width="100%">
			<TextField
				padding={2}
				label="Title"
				placeholder="Title"
				onChange={
					(event) => {setTitle(event.target.value)}
				}
				multiline
				variant="outlined" />
			<TextField
				padding={2}
				label="Note"
				placeholder="Write note here"
				onChange={
					(event) => {setContent(event.target.value)}
				}
				multiline
				rows={4}
				variant="outlined" />
			<Button
				fullWidth
				variant="contained"
				color="secondary" 
				onClick={handleSave}>
				Save Note
          	</Button>
		</form>
	)
}

export default withRouter(withStyles(styles)(Dashboard))