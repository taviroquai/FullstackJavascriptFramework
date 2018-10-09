import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox,
  Input,
  Select
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getPermissions, savePermission } from './actions';

class PermissionsList extends Component {

  state = {
    loading: false,
    total: 0,
    permissions: [],
    roleFilter: 'Registered',
    resourceFilter: '',
    errors: null
  }

  reload() {
    this.setState({ ...this.state, loading: true});
    getPermissions().then((permissions, total) => {
      this.setState({
        ...this.state,
        loading: false,
        permissions,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    this.reload();
  }

  toggleAccess(permission) {
    this.setState({ ...this.state, loading: true});
    const variables = {
      ...permission,
      access: !permission.access
    }
    savePermission(variables).then(() => {
      this.reload();
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  onFilter(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  render() {
    const { loading, errors, permissions, resourceFilter, roleFilter } = this.state;
    let filtered = permissions;

    // Role options
    const roleOptions = permissions.reduce((acc, i) => {
      if (acc.indexOf(i.role.label) < 0) acc.push(i.role.label);
      return acc;
    }, []).map((opt, i) => ({
      key: i,
      value: opt,
      text: opt
    }));

    // Filter by resource
    if (resourceFilter) {
      const regex = new RegExp(resourceFilter, 'ig');
      filtered = filtered.filter(i => regex.test(i.resource.system));
    }

    // Filter by role
    if (roleFilter) {
      const regex = new RegExp(roleFilter, 'ig');
      filtered = filtered.filter(i => regex.test(i.role.label));
    }

    // Render
    return (
      <Layout>
        <Header as='h1'>Permissions</Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }

        <Table size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>
                  <Select
                    style={{ fontSize: '0.8rem'}}
                    placeholder='Filter by role'
                    value={roleFilter}
                    options={roleOptions}
                    onChange={(e, { value }) => this.onFilter('roleFilter', value)}
                  />
                </Table.HeaderCell>
              <Table.HeaderCell>
                Resource
                <Input style={{fontSize: '.8rem', float: 'right'}}
                  placeholder='Filter by resource...'
                  value={resourceFilter}
                  loading={loading}
                  onChange={e => this.onFilter('resourceFilter', e.target.value)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell width={3}>
                { !loading ? 'Allowed' :
                  <Loader size='mini' active inline='centered' />
                }
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { filtered.map(permission => (
              <Table.Row key={permission.id}>
                <Table.Cell>{permission.id}</Table.Cell>
                <Table.Cell>{permission.role.label}</Table.Cell>
                <Table.Cell>{permission.resource.system}</Table.Cell>
                <Table.Cell width={3}>

                  <Checkbox toggle
                    disabled={loading}
                    checked={permission.access}
                    title={permission.access ? 'Deny' : 'Allow'}
                    className='mini'
                    onClick={this.toggleAccess.bind(this, permission)}
                    style={{ marginTop: '0.5rem' }}
                  />

                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>

      </Layout>
    )
  }
}

export default PermissionsList;
