import { List, Icon, Button } from 'semantic-ui-react';

export default function Todo(props) {
    return (
        <List.Item id={props.id} >
            <Button 
              icon style={{ marginRight: '20px' }}
              onClick = {() => props.deleteTask(props.id)}
            >
              <Icon name="delete" />
            </Button>
            <b style = {{ fontSize: "24px" }}>{props.content}</b>
        </List.Item>
    );
}