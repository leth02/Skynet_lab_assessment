
import { useState, useEffect } from 'react';
import { Header, Container, List, Segment, Dimmer, Loader } from 'semantic-ui-react';

import { SkynetClient } from 'skynet-js';

import LoginForm from './components/LoginForm';
import TodoForm from './components/TodoForm';
import Todo from './components/Todo';

const client = new SkynetClient();

function App() {
	const dataDomain = "localhost";
  const [loading, setLoading] = useState(false);
	const [loggedIn, setLoggedIn] = useState(null);
	const [userID, setUserID] = useState('');
	const [mySky, setMySky] = useState(null);
	const [filePath, setFilePath] = useState(`${dataDomain}/todo.json`);
	const [newTask, setNewTask] = useState('');
	const [tasks, setTasks] = useState([]);


	// Initialize MySky when app starts
	useEffect(() => {
		async function initMySky() {
			try {
				const mySky = await client.loadMySky(dataDomain);
				const loggedIn = await mySky.checkLogin();
				setMySky(mySky);
				setLoggedIn(loggedIn);
				if (loggedIn) {
					setUserID(await mySky.userID());

					// fetch tasks and populate the task list if user is logged in
					setLoading(true);
					const {data, dataLink} = await mySky.getJSON(filePath);
					if (data !== null) setTasks(data);
					setLoading(false);
				}
			}
			catch (error){
				console.error(error);
			}
		}

		initMySky();
	}, []);

	const handleMySkyLogin = async () => {
		const status = await mySky.requestLoginAccess();
		setLoggedIn(status);
		if (status) {
			setUserID(await mySky.userID());
			setLoading(true);
			await getTasksFromMySky();
			setLoading(false);
		}
	};

	const handleMySkyLogout = async () => {
		await mySky.logout();
		setLoggedIn(false);
		setUserID('');
		setTasks([]); // erase task list when user logs out
	};

	const getTasksFromMySky = async () => {
		try {
			const {data, dataLink} = await mySky.getJSON(filePath);
			if (data === null) {
				console.log(`No task is saved on path "${filePath}"`);
				return;
			}

			setTasks(data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleTaskSubmit = (event) => {
		event.preventDefault();

		if (newTask === "") {
			alert("A task must not be empty");
			return;
		}

		const createdTime = new Date().toJSON();
		const aNewTask = {
			id: createdTime,
			content: newTask
		};

		const updatedTasks = tasks.concat(aNewTask);
		saveTasksToMySky(updatedTasks);
	};

	const saveTasksToMySky = async (updatedTasks) => {
		try {
			setLoading(true);
			const {data, dataLink} = await mySky.setJSON(filePath, updatedTasks);
			setTasks(data);
			setLoading(false);

		} catch (error) {
			console.log(`error with setJSON: ${error.message}`);
		}
	};

	const handleTaskDelete = (id) => {
		const remainingTasks = tasks.filter(task => id !== task.id);
		saveTasksToMySky(remainingTasks);
	}

	const appProps = {
		loggedIn,
		userID,
		handleMySkyLogin,
		handleMySkyLogout,
		handleTaskSubmit,
		setNewTask,
	};

	const taskList = tasks.map(task => (
		<Todo 
			id={task.id}
			content={task.content}
			key={task.id}
			deleteTask = {handleTaskDelete}
		/>
	));

	return (
		<Container>
			<Header
				as="h1"
				content = "Skynet App - Todo List (Tan Le)"
				textAlign="center"
				style={{ margin: "1em 0" }}
			/>	
			<LoginForm {...appProps}></LoginForm>
			<TodoForm {...appProps}></TodoForm>
			<Segment>
				<Dimmer active={loading}>
          <Loader active={loading} />
        </Dimmer>
				<Header as="h4">Task list</Header>
				<List>
					{taskList}
				</List>
			</Segment>
		</Container>
	);
}

export default App;
