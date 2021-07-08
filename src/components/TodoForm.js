import {
  Button,
  Form,
  Input,
  Header,
  Segment,
} from 'semantic-ui-react';

const TodoForm = (props) => {

  return (
    <Segment>
      <Form onSubmit={props.handleTaskSubmit}>
        <Header as="h4">Submit a task</Header>
        <Form.Field>
          <label>
            Enter your task below
          </label>
          <Input
            disabled = {!props.loggedIn}
            placeholder= {props.loggedIn ? "" : "You must log in with MySky..."}
            icon="tasks"
            iconPosition="left"
            onChange = { (event) => {
              props.setNewTask(event.target.value);
            }}
          />
        </Form.Field>
        <Button primary type="submit" >
          Create
        </Button>
      </Form>
    </Segment>
  );
}

export default TodoForm;