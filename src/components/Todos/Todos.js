import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Todo from './Todo';
import { styles as GlobalStyles } from '../../utils/styles';


const styles = StyleSheet.create({
  noTodo: {
    fontSize: GlobalStyles.fontSize,
    color: GlobalStyles.fontColor,
    fontWeight: 'bold',
  },
});

const Todos = (props) => {
  const {
    todos,
    checkBoxToggle,
    onFeedBack,
    submitFeedBack,
    showTodoUpdateModal,
    showFeedBackModal,
    toggleModal,
    setData,
    showDatepicker,
    onChange,
    updateTodo,
    showPicker,
    todo,
    notes,
    remindMe,
    strDate,
    dueDate
  } = props;
  let todosEl = <Text style={styles.noTodo}>No TODOs</Text>;

  if (todos !== undefined) {
    const todoKeys = Object.keys(todos);
    todosEl = todoKeys.map((todoKey) => {
      const targetTodo = todos[todoKey];

      return (
        <Todo
          key={todoKey}
          id={todoKey}
          checkBoxToggle={checkBoxToggle}
          onFeedBack={onFeedBack}
          submitFeedBack={submitFeedBack}
          showTodoUpdateModal={showTodoUpdateModal}
          showFeedBackModal={showFeedBackModal}
          toggleModal={toggleModal}
          title={targetTodo.title}
          completed={todo.completed}
          todo={todo}
          notes={notes}
          remindMe={remindMe}
          strDate={strDate}
          dueDate={dueDate}
          setData={setData}
          showDatepicker={showDatepicker}
          onChange={onChange}
          updateTodo={(todoKey) => {updateTodo(todoKey)}}
          showPicker={showPicker}
        />
      );
    });
  }
  return todosEl;
};

export default Todos;