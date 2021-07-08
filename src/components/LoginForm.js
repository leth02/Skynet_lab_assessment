import {
  Button,
  Segment,
} from 'semantic-ui-react';

const LoginForm = (props) => {

  return (
    <Segment>
      {props.loggedIn === true && (
        <Button onClick={props.handleMySkyLogout}>
          Log Out of MySky
        </Button>
      )}
      {props.loggedIn === false && (
        <Button onClick={props.handleMySkyLogin}>
          Login with MySky
        </Button>
      )}
      {props.loggedIn === null && <Button>Loading MySky...</Button>}
      
    </Segment>
  );
}

export default LoginForm;