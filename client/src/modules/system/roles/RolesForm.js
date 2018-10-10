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
import RoleHooksList from './RoleHooksList';
import { getRoleById, saveRole } from './actions';
import { I18n } from 'react-i18next';
import Objection from '../../../share/Objection';

class RolesForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: false
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) {
      return this.setState({
        ...this.state,
        edit: {
          id: '',
          label: '',
          system: ''
        }
      })
    }

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
        success: 'role_saved_successfully'
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  render() {
    const { loading, errors, success, edit } = this.state;
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>
              { (edit.id ? t('edit') : t('create')) + ' ' + t('role') }
              { edit && (
                <Button primary
                  floated='right'
                  onClick={e => this.onSubmit(e)}
                  type='submit'>
                  {t('save')}
                </Button>
              ) }
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={Objection.formatErrors(errors[0].message, t)}
            /> }

            { success && <Message success size='mini'
              icon='bullhorn'
              content={t(success)}
            /> }

            { loading && <Loader active inline='centered' /> }
            { edit && (
              <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>

                <Grid>
                  <Grid.Column mobile={12}>
                    <Form.Field>
                      <label>{t('label')}</label>
                      <Form.Input value={edit.label}
                        placeholder={t('edit_label')}
                        onChange={e => this.onEdit('label', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <Grid>
                  <Grid.Column computer={12} mobile={12} tablet={12}>
                    <Form.Field>
                      <label>{t('system_keyword')}</label>
                      <Form.Input value={edit.system}
                        placeholder={t('enter_system_keyword')}
                        onChange={e => this.onEdit('system', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <RoleHooksList role={edit} />

              </Form>
            )}

          </Layout>
        )}
      </I18n>
    )
  }
}

export default RolesForm;
