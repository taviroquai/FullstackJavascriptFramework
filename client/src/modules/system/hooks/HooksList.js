import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Loader,
  Message,
  Button,
  Icon
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getHooks } from './actions';

class HooksList extends Component {

  state = {
    loading: false,
    total: 0,
    hooks: [],
    errors: null
  }

  componentDidMount() {
    this.setState({ ...this.state, loading: true});
    getHooks().then((hooks, total) => {
      this.setState({
        ...this.state,
        loading: false,
        hooks,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { loading, errors, hooks } = this.state;
    return (
      <Layout>
        <Header as='h1'>
          Hooks

          <Button floated='right' primary
            as={Link} to='/hooks/edit'>
            New
          </Button>
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }

        { loading ? <Loader active inline='centered' /> : (
          <Table size='small'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>System</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { hooks.map(hook => (
                <Table.Row key={hook.id}>
                  <Table.Cell>{hook.id}</Table.Cell>
                  <Table.Cell>{hook.system}</Table.Cell>
                  <Table.Cell width={1}>
                    <Button.Group size='mini'>
                      <Button primary icon
                        as={Link} to={'/hooks/edit/'+hook.id}>
                        <Icon name="pencil" />
                      </Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        )}

      </Layout>
    )
  }
}

export default HooksList;
