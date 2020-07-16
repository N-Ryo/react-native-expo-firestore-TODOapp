import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import md5 from 'md5';
import { styles } from '../utils/styles';
import Header from '../components/UI/Header';
import Todos from '../components/Todos/Todos';
import Filter from '../components/Filter/Filter';
import ListsDb from '../database/Lists';
import SimpleModal from '../components/Modals/SimpleModal';
import Switch from '../components/SwitchCase/Switch';
import Buttons from '../components/UI/Buttons';


const localStyles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textInput: {
    fontSize: 28,
    fontStyle: 'italic',
  },
  listHeaderWrp: {
    marginBottom: 10,
  },
  listHeader: {
    fontSize: styles.fontSize,
  },
  todosWrp: {
    marginTop: 20,
  },
});

export default class Tasks extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.FILTER_ALL = 'all';
    this.FILTER_ACTIVE = 'active';
    this.FILTER_COMPLETE = 'completed';
    this.filters = ['all', 'active', 'completed'];
    this.listOptions = {
      DEFAULT: 'default',
      DELETE: 'delete',
      RENAME: 'rename',
      ADDEMAIL: 'add-email',
      REMINDER: 'reminder',
    };
    this.deleteListAction = null;

    this.state = {
      showListOptions: false,
      todo: '',
      todos: {},
      currentFilter: 'all',
      currentUser: null,
      selectedList: {
        key: '',
        name: '',
        owner: '',
        userEmails: {},
      },
      route: this.listOptions.DEFAULT,
      emailInput: '',
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const { navigation } = this.props;
    const list = navigation.getParam('selectedList');
    const currentUser = navigation.getParam('currentUser');
    this.deleteListAction = navigation.getParam('deleteListAction');
    const todos = await ListsDb.getTodos(list.key)
    console.log(`componentDidMount => ${todos}`)
    this.setState({ todos, selectedList: list, currentUser });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  save = async (todoId, listId, todo) => {
    try {
      await ListsDb.updateTodo(todoId, listId, todo);
    } catch (e) {
      console.log('Error while storing Todo Items >', e);
    }
  };

  addTodo = () => {
    const { todo, todos, selectedList, currentUser } = this.state;
    if (todo.length === 0) {
      this.setState({ inputError: true });
      return;
    }
    const todoKey = md5(todo);
    const todoNew = {
      key: todoKey,
      title: todo,
      completed: false,
      createdOn: Date.now(),
      notes: '',
      dueDate: null,
      remindMe: false,
      completedOn: null,
    };

    todos[todoKey] = todoNew;
    console.log(todos)
    this.setState({ todos, todo: '' }, () => ListsDb.setTodos(selectedList, todoNew, currentUser.uid));
  };

  checkBoxToggle = async (todoKey) => {
    console.log(`checkBoxToggle => ${todoKey}`)
    const { todos, selectedList } = this.state;
    const todo = todos[todoKey];
    console.log(todos)
    console.log(todo)
    todo.completed = !todo.completed;
    todo.completedOn = todo.completed ? Date.now() : null;
    todos[todoKey] = todo;
    await this.setState({ todos }, () => this.save(todoKey, selectedList.key, todo));
  };

  onDeleteAction = (todoKey) => {
    const { todos, selectedList } = this.state;
    delete todos[todoKey];
    this.setState({ todos }, () => ListsDb.deleteTodo(todoKey, selectedList.key));
  };

  deleteAllContinue = () => {
    const { todos, selectedList } = this.state;
    

    const todoKeys = Object.keys(todos);
    todoKeys.map((todoKey) => {
      if (this._shouldDeleteTodo(todos[todoKey])) {
        delete todos[todoKey];
      }

      return null;
    });

    this.setState({ todos, currentFilter: 'all' }, this.save(todoKey, selectedList.key));
  }

  _shouldDeleteTodo = (todo) => {
    const { currentFilter } = this.state;

    return (currentFilter === this.FILTER_ACTIVE && !todo.completed)
      || (currentFilter === this.FILTER_COMPLETE && todo.completed)
      || currentFilter === this.FILTER_ALL;
  }

  deleteAllCancel = () => {
    // eslint-disable-next-line no-console
    console.log('Delete All canceled!');
  }

  selectFilter = (filter) => {
    this.setState({ currentFilter: filter });
  }

  showListOptions = () => {
    this.setState({ showListOptions: true });
  }

  deleteList = () => {
    const { selectedList } = this.state;
    const { navigation } = this.props;
    // TodosDb.deleteTodoList(selectedList.key, currentUser.uid);
    this.deleteListAction(selectedList.key);
    navigation.navigate('TaskLists');
  }

  updateList = () => {
    const { selectedList } = this.state;
    ListsDb.updateTodoList(selectedList);
    this.setState({ showListOptions: false });
  }

  showAddedEmails = () => {
    const { selectedList } = this.state;
    const userEmails = selectedList.userEmails;
    const emailKeys = Object.keys(userEmails);

    return emailKeys.map((emailKey) => {
      let owner = null;
      const listUser = userEmails[emailKey];

      if (listUser.email === selectedList.owner) {
        owner = <Text>Owner</Text>;
      }
      return (
        <View key={emailKey}>
          <Text>
            {listUser.email}
          </Text>
          <Text>
            {owner}
          </Text>
        </View>
      );
    });
  }

  addEmailToList = () => {
    const { selectedList } = this.state;
    const { userEmails } = selectedList;
    let { emailInput } = this.state;
    const emailKey = md5(emailInput);

    userEmails[emailKey] = this.addUnverifiedUserToList(emailKey, emailInput);
    selectedList.userEmails = userEmails;
    ListsDb.updateTodoList(selectedList);
    emailInput = '';
    this.setState({ selectedList, emailInput });
  }

  render() {
    const { navigation } = this.props;
    const {
      currentFilter,
      todo,
      todos,
      showListOptions,
      selectedList,
      route,
      emailInput,
    } = this.state;
    const {
      DEFAULT,
      DELETE,
      RENAME,
      ADDEMAIL,
      REMINDER,
    } = this.listOptions;

    if (currentFilter !== 'all') {
      const todoKeys = Object.values(todos);
      todos = {};
      todoKeys.map((_todo) => {
        if ((currentFilter === this.FILTER_ACTIVE && _todo.completed === false)
          || (currentFilter === this.FILTER_COMPLETE && _todo.completed)) {
          todos[_todo.key] = _todo;
        }
        return null;
      });
    }

    return (
      <LinearGradient
        style={{ flex: 1 }}
        colors={styles.appBackgroundColors}
      >
        <Header
          title="Tasks"
          backgroundColor="transparent"
          iconLeft={(
            <FontAwesome
              style={{ position: 'absolute', left: 10 }}
              name="chevron-left"
              size={20}
              onPress={() => navigation.goBack()}
            />
          )}
          iconRight={(
            <MaterialCommunityIcons
              style={{ position: 'absolute', right: 10 }}
              name="arrow-down-bold-box"
              size={20}
              onPress={() => this.showListOptions()}
            />
          )}
        />
        <View style={localStyles.container}>
          <TextInput
            style={[localStyles.textInput, { color: 'white' }]}
            autoCapitalize="sentences"
            placeholder="What needs to be done?"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            onChangeText={input => this.setState({ todo: input })}
            blurOnSubmit={false}
            onSubmitEditing={this.addTodo}
            value={todo}
          />
          <View style={localStyles.todosWrp}>
            {/* <Filter
              filterTitle="Your Todos"
              currentFilter={currentFilter}
              filterTypes={this.filters}
              deleteContinue={this.deleteAllContinue}
              deleteCancel={this.deleteAllCancel}
              selectFilter={this.selectFilter}
            /> */}
            <ScrollView>
              <Todos
                todos={todos}
                checkBoxToggle={this.checkBoxToggle}
                onDelete={this.onDeleteAction}
              />
            </ScrollView>
          </View>
        </View>

        {/* List Options Modal */}
        <SimpleModal
          title="List Options"
          visible={showListOptions}
          closeAction={
            () => this.setState({
              showListOptions: false,
              route: this.listOptions.DEFAULT,
            })
          }
        >
          <Switch route={route}>
            {/* DEFAULT */}
            <Switch.Case match={DEFAULT}>
              <View>
                <Buttons
                  type="link"
                  title="Delete"
                  onPress={() => this.setState({ route: this.listOptions.DELETE })}
                />
              </View>
            </Switch.Case>

            {/* DELETE */}
            <Switch.Case match={DELETE}>
              <View>
                <Text>Are you sure you wanna DELETE this list: </Text>
              </View>
              <View>
                <Buttons
                  type="primary"
                  title="Yes"
                  onPress={this.deleteList}
                />
              </View>
            </Switch.Case>

            {/* RENAME */}
            <Switch.Case match={RENAME}>
              <View>
                <Text>List Name</Text>
                <TextInput
                  placeholder="Enter a name for the list"
                  value={selectedList.name}
                  onSubmitEditing={this.updateList}
                />
              </View>
            </Switch.Case>

            {/* ADDUSER */}
            <Switch.Case match={ADDEMAIL}>
              <View>
                <Text>Add Users:</Text>
              </View>
              <View>
                {this.showAddedEmails()}
              </View>
              <View>
                <TextInput
                  placeholder="Add email"
                  value={emailInput}
                  onSubmitEditing={this.addEmailToList}
                />
              </View>
            </Switch.Case>

            {/* REMINDER */}
            <Switch.Case match={REMINDER}>
              <View>
                <Text>Reminder:</Text>
              </View>
            </Switch.Case>
          </Switch>
        </SimpleModal>
      </LinearGradient>
    );
  }
}

Tasks.propTypes = {
  navigation: PropTypes.object.isRequired,
};