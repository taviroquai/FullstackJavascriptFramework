import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Message,
  Button,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getResources } from './actions';

class ResourcesList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      query: '',
      total: 0,
      resources: [],
      errors: null
    };

    // Create search debounce
    this.searchDebounce = debounce(() => {
      this.reload();
    }, 300);
  }


  reload() {
    const { query } = this.state;
    this.setState({ ...this.state, loading: true});
    getResources({ query }).then((resources, total) => {
      this.setState({
        ...this.state,
        loading: false,
        resources,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    this.reload();
  }

  onSearch(query) {
    this.setState({...this.state, query }, () => {
      this.searchDebounce();
    });
  }

  render() {
    const { loading, errors, resources, query } = this.state;
    return (
      <Layout>
        <Header as='h1'>
          Resources

          <Button floated='right' primary
            as={Link} to='/resources/edit'>
            New
          </Button>
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }

        { !!resources.length && (
          <Table size='small'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>
                  System
                  <Input style={{fontSize: '.8rem', float: 'right'}}
                    placeholder='Search...'
                    value={query}
                    loading={loading}
                    onChange={e => this.onSearch(e.target.value)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  { loading && <Loader active inline='centered' /> }
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { resources.map(resource => (
                <Table.Row key={resource.id}>
                  <Table.Cell>{resource.id}</Table.Cell>
                  <Table.Cell>{resource.system}</Table.Cell>
                  <Table.Cell width={1}>
                    <Button.Group size='mini'>
                      <Button primary icon
                        size='mini'
                        as={Link} to={'/resources/edit/'+resource.id}>
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

export default ResourcesList;
