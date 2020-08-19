import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Button
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import md5 from 'md5';
import { styles, textInputs } from '../utils/styles';
import Header from '../components/UI/Header';
import Todos from '../components/Todos/Todos';
import Filter from '../components/Filter/Filter';
import ListsDb from '../database/Lists';
import SimpleModal from '../components/Modals/SimpleModal';
import SwitchCase from '../components/SwitchCase/Switch';
import Buttons from '../components/UI/Buttons';
import { Notifications } from 'expo';
import { Notification } from 'expo/build/Notifications/Notifications.types'


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

    const currentdate = new Date;
    this.state = {
      showListOptions: false,
      showAddNewTodoModal: false,
      showFeedBackModal: false,
      showTodoUpdateModal: false,
      feedBack: '',
      todo: '',
      notes: '',
      dueDate: currentdate,
      strDate: currentdate.toDateString(),
      remindMe: true,
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
      showPicker: false
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const { navigation } = this.props;
    const list = navigation.getParam('selectedList');
    const currentUser = navigation.getParam('currentUser');
    this.deleteListAction = navigation.getParam('deleteListAction');
    const todos = await ListsDb.getTodos(list.key, currentUser.uid)
    console.log(`componentDidMount => ${todos}`)
    this.setState({ todos, selectedList: list, currentUser });

    this._notificationSubscription = Notifications.addListener(this._onReceiveNotification)
  }

  onChange = (event, selectedDate) => {
    this.setState({
      dueDate: selectedDate,
      strDate: selectedDate.toDateString(),
      showPicker: Platform.OS === 'ios'
    })
  };

  showMode = (currentMode) => {
    console.log(currentMode)
    this.setState({showPicker: true, mode: currentMode})
  };

  showDatepicker = () => {
    this.showMode('date');
  };

  showTimepicker = () => {
    this.showMode('time');
  };

  async _sendLocalNotification () {
    await Notifications.scheduleLocalNotificationAsync(
      {
        title: "リマインド",
        body: 'Wow, I can show up even when app is closed',
        data: {
          message: 'テストローカル通知を受け取りました'
        },
      },
      {
        time: new Date().getTime() + 10000,
      },
    );
  }
  
  async _onReceiveNotification (notification) {
    alert(notification.data.message)
  }

  save = async (todoId, listId, todo) => {
    const { navigation } = this.props;
    const currentUser = navigation.getParam('currentUser');
    
    try {
      await ListsDb.updateTodo(todoId, listId, currentUser.uid, todo);
    } catch (e) {
      console.log('Error while storing Todo Items >', e);
    }
  };

  addTodo = () => {
    const { todo, todos, selectedList, currentUser, dueDate, strDate, notes, remindMe } = this.state;
    if (todo.length === 0) {
      this.setState({ inputError: true });
      return;
    }
    const todoKey = md5(todo);
    const todoNew = {
      key: todoKey,
      title: todo,
      completed: false,
      createdOn: new Date,
      notes: notes,
      feedBack: '',
      dueDate: dueDate,
      strDate: strDate,
      remindMe: remindMe,
      completedOn: null,
    };

    todos[todoKey] = todoNew;
    this.setState({ todos, todo: '', notes: '', remindMe: true, dueDate: new Date, showAddNewTodoModal: false }, () => ListsDb.setTodos(selectedList, todoNew, currentUser.uid));
    this._sendLocalNotification(todoNew)
  };

  updateTodo = (todoKey) => {
    console.log(todoKey)
    const { todo, todos, selectedList, currentUser, dueDate, strDate, notes, remindMe } = this.state;
    if (todo.length === 0) {
      this.setState({ inputError: true });
      return;
    }
    const todoNew = {
      key: todoKey,
      title: todo,
      completed: false,
      notes: notes,
      feedBack: '',
      dueDate: dueDate,
      strDate: strDate,
      remindMe: remindMe,
      completedOn: null,
    };
    let nortificate = false
    if (todos[todoKey].strDate !== strDate) {
      nortificate = true
    }

    todos[todoKey] = todoNew;
    const currentDate = new Date;
    this.setState({ todos, todo: '', notes: '', remindMe: true, dueDate: currentDate, strDate: currentDate.toDateString, showTodoUpdateModal: false }, () => ListsDb.updateTodo(todoKey, selectedList.key, currentUser.uid, todoNew));
    if (nortificate) this._sendLocalNotification(todoNew)
  };

  checkBoxToggle = async (todoKey) => {
    const { todos, selectedList } = this.state;
    const todo = todos[todoKey];
    todo.completed = !todo.completed;
    todo.completedOn = todo.completed ? Date.now() : null;
    todos[todoKey] = todo;
    await this.setState(todos, () => this.save(todoKey, selectedList.key, todo));
  };

  onFeedBackAction = (todoKey, feedBack) => {
    const { todos } = this.state;
    const todo = todos[todoKey];
    todo.feedBack = feedBack;
    todos[todoKey] = todo;
    this.setState(todos);
  }
  submitFeedBack = async(todoKey) => {
    const { todos, selectedList } = this.state;
    const todo = todos[todoKey];
    await this.setState(todos, () => this.save(todoKey, selectedList.key, todo));
  }

  toggleModal = (target, id = undefined) => {
    if (target === "showTodoUpdateModal" && !!id) {
      if (!this.state[target]) {
        const { todos } = this.state;
        const todo = todos[id]
        this.setState({
          todo: todo.title,
          notes: todo.notes,
          remindMe: todo.remindMe,
          strDate: todo.strDate,
          dueDate: todo.dueDate
        })
      } else {
        const currentdate = new Date
        this.setState({
          todo: '',
          notes: '',
          remindMe: true,
          strDate: currentdate.toDateString(),
          dueDate: currentdate
        })
      }
    }
    this.setState({[`${target}`]: !this.state[target]});
  }

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
    const { selectedList, currentUser } = this.state;
    ListsDb.updateTodoList(selectedList, currentUser.uid);
    this.setState({ showListOptions: false });
  }

  showAddNewTodo = () => {
    this.setState({ showAddNewTodoModal: true });
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
    const { selectedList, currentUser } = this.state;
    const { userEmails } = selectedList;
    let { emailInput } = this.state;
    const emailKey = md5(emailInput);

    userEmails[emailKey] = this.addUnverifiedUserToList(emailKey, emailInput);
    selectedList.userEmails = userEmails;
    ListsDb.updateTodoList(selectedList, currentUser.uid);
    emailInput = '';
    this.setState({ selectedList, emailInput });
  }

  render() {
    const { navigation } = this.props;
    const {
      currentFilter,
      todo,
      notes,
      completed,
      dueDate,
      strDate,
      remindMe,
      todos,
      showListOptions,
      showAddNewTodoModal,
      showFeedBackModal,
      showTodoUpdateModal,
      selectedList,
      route,
      emailInput,
      listNameErr,
      showPicker
    } = this.state;
    const {
      DEFAULT,
      DELETE,
      RENAME,
      ADDEMAIL,
      REMINDER,
    } = this.listOptions;
    const nameInputStyle = listNameErr ? textInputs.error : textInputs.default;

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
          <FontAwesome
            style={{ position: 'absolute', right: 10 }}
            name="plus"
            size={20}
            onPress={this.showAddNewTodo}
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
                onFeedBack={this.onFeedBackAction}
                submitFeedBack={this.submitFeedBack}
                showTodoUpdateModal={showTodoUpdateModal}
                showFeedBackModal={showFeedBackModal}
                toggleModal={this.toggleModal}
                todo={todo}
                notes={notes}
                completed={completed}
                remindMe={remindMe}
                strDate={strDate}
                dueDate={dueDate}
                setData={(object) => {this.setState(object)}}
                showDatepicker={this.showDatepicker}
                onChange={this.onChange}
                updateTodo={this.updateTodo}
                showPicker={showPicker}
              />
            </ScrollView>
          </View>
        </View>

        <SimpleModal
          title="Add new todo:"
          visible={showAddNewTodoModal}
          closeAction={() => this.setState({ showAddNewTodoModal: false })}
        >
          <TextInput
            style={nameInputStyle}
            autoCapitalize="sentences"
            placeholder="What needs to be done?"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            onChangeText={input => this.setState({ todo: input })}
            blurOnSubmit={false}
            value={todo}
          />
          <TextInput
            style={nameInputStyle}
            autoCapitalize="sentences"
            placeholder="description"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            onChangeText={input => this.setState({ notes: input })}
            blurOnSubmit={false}
            value={notes}
          />
          <View><Text>Remind Me</Text></View>
          <Switch
            onValueChange={input => this.setState({ remindMe: input })}
            value={remindMe}
          />

          <View>
            <Button onPress={this.showDatepicker} title={strDate} />
          </View>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dueDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={this.onChange}
            />
          )}
          <Buttons
            type="primary"
            title="Add List"
            onPress={this.addTodo}
          />
        </SimpleModal>

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
          <SwitchCase route={route}>
            {/* DEFAULT */}
            <SwitchCase.Case match={DEFAULT}>
              <View>
                <Buttons
                  type="link"
                  title="Delete"
                  onPress={() => this.setState({ route: this.listOptions.DELETE })}
                />
              </View>
            </SwitchCase.Case>

            {/* DELETE */}
            <SwitchCase.Case match={DELETE}>
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
            </SwitchCase.Case>

            {/* RENAME */}
            <SwitchCase.Case match={RENAME}>
              <View>
                <Text>List Name</Text>
                <TextInput
                  placeholder="Enter a name for the list"
                  value={selectedList.name}
                  onSubmitEditing={this.updateList}
                />
              </View>
            </SwitchCase.Case>

            {/* ADDUSER */}
            <SwitchCase.Case match={ADDEMAIL}>
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
            </SwitchCase.Case>

            {/* REMINDER */}
            <SwitchCase.Case match={REMINDER}>
              <View>
                <Text>Reminder:</Text>
              </View>
            </SwitchCase.Case>
          </SwitchCase>
        </SimpleModal>
      </LinearGradient>
    );
  }
}

Tasks.propTypes = {
  navigation: PropTypes.object.isRequired,
};