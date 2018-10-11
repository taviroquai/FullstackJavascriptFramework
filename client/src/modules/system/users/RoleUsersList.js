import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox
} from 'semantic-ui-react';
import { getRoleUsers, updateRoleUser } from './actions';
import { NamespacesConsumer } from 'react-i18next';

/**
 * Component for user's roles list
 */
class RoleUsersList extends Component {

  state = {
    loading: false,
    total: 0,
    roles: [],
    current: [],
    errors: null
  }

  reload(user) {
    const variables = { user_id: user.id }
    this.setState({ ...this.state, loading: true});
    getRoleUsers(variables).then(result => {
      this.setState({
        ...this.state,
        loading: false,
        errors: null,
        roles: result.results
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    const { user } = this.props;
    if (!user.id) return;
    this.reload(user);
  }

  toggleRole(role) {
    const { user } = this.props;
    this.setState({ ...this.state, loading: true});
    const variables = { ...role, active: !role.active };
    updateRoleUser(variables).then(() => {
      this.reload(user);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { loading, errors, roles } = this.state;
    const { user } = this.props;
    if (!user.id) return null;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>
            <Header as='h3'>
              {t('user')} {t('roles')}
            </Header>

            { errors && <Message negative size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            { loading ? <Loader active inline='centered' /> : (
              <Table size='small'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>
                      {t('id')}
                    </Table.HeaderCell>
                    <Table.HeaderCell>{t('username')}</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { roles.map(role => (
                    <Table.Row key={role.id}>
                      <Table.Cell width={1}>
                        {role.id}
                      </Table.Cell>
                      <Table.Cell>{role.role.label}</Table.Cell>
                      <Table.Cell width={1}>

                        <Checkbox toggle
                          disabled={loading}
                          checked={role.active}
                          title={role.active ? t('remove') : t('add')}
                          size='mini'
                          onClick={this.toggleRole.bind(this, role)}
                          style={{ marginTop: '0.5rem' }}
                        />

                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>

              </Table>
            )}

          </React.Fragment>
        )}
      </NamespacesConsumer>
    )
  }
}

export default RoleUsersList;
