import React, { Component } from 'react';
import {
  Grid,
  Header,
  Form,
  Loader,
  Message,
  Button
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import RoleUsersList from './RoleUsersList';
import { getRoleById, saveRole } from './actions';

class RolesForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: {
      id: '',
      label: '',
      system: ''
    }
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) return;

    // Load role
    this.setState({ ...this.state, loading: true });
    getRoleById(params.id).then(edit => {
      this.setState({ ...this.state, loading: false, edit });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  onEdit(field, value) {
    const { edit } = this.state;
    edit[field] = value;
    this.setState({ ...this.state, edit });
  }

  onSubmit(e) {
    e.preventDefault();
    let { edit } = this.state;

    // Save role
    this.setState({ ...this.state, loading: true, success: null });
    saveRole(edit).then(() => {
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: 'Role saved successfully'
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  render() {
    const { loading, errors, success, edit } = this.state;
    return (
      <Layout>

        <Header as='h1'>
        { edit.id ? 'Edit Role' : 'Create Role' }
          <Button primary
            floated='right'
            onClick={e => this.onSubmit(e)}
            type='submit'>
            Save
          </Button>
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors[0].message.split(',')}
        /> }

        { success && <Message success size='mini'
          icon='bullhorn'
          content='Role saved successfully'
        /> }

        { loading ? <Loader active inline='centered' /> : (
          <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>

            <Grid>
              <Grid.Column mobile={12}>
                <Form.Field>
                  <label>Label</label>
                  <Form.Input value={edit.label}
                    placeholder="Enter label..."
                    onChange={e => this.onEdit('label', e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid>

            <Grid>
              <Grid.Column computer={12} mobile={12} tablet={12}>
                <Form.Field>
                  <label>System</label>
                  <Form.Input value={edit.system}
                    placeholder="Enter system keyword..."
                    onChange={e => this.onEdit('system', e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid>

            <RoleUsersList role={edit} />

          </Form>
        )}

      </Layout>
    )
  }
}

export default RolesForm;
