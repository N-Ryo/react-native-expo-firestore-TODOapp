import React from 'react';
import { View, Text, Switch, StyleSheet, TextInput, Button } from 'react-native';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons';
import SimpleModal from '../Modals/SimpleModal';
import Buttons from '../UI/Buttons';
import { styles as GlobalStyles, textInputs } from '../../utils/styles';


const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowOffset: { height: 2, width: 0 },
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    elevation: 5,
    position: 'relative',
  },
  todoTitle: {
    fontSize: 18,
    paddingLeft: 15,
    width: '80%',
  },
  titleComplete: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  feedBackIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  textInput: {
    fontSize: 28,
    fontStyle: 'italic',
  },
});
const Todo = (props) => {

  const {
    id,
    checkBoxToggle,
    onFeedBack,
    submitFeedBack,
    showFeedBackModal,
    showTodoUpdateModal,
    toggleModal,
    title,
    todo,
    notes,
    completed,
    remindMe,
    strDate,
    dueDate,
    setData,
    showDatepicker,
    onChange,
    updateTodo,
    showPicker
  } = props;
  const todoCheckIcon = completed ? 'check-square-o' : 'square-o';
  const todoCheckIconColor = completed ? 'green' : '#333';
  const titleStyle = completed ? [styles.todoTitle, styles.titleComplete] : [styles.todoTitle];
  return (
    <View style={styles.todoContainer}>
      <FontAwesome
        name={todoCheckIcon}
        size={GlobalStyles.iconSize}
        color={todoCheckIconColor}
        onPress={() => checkBoxToggle(id)}
      />
      <Text style={titleStyle}>{title}</Text>
      <MaterialIcons
        style={styles.feedBackIcon}
        name="edit"
        size={GlobalStyles.iconSize}
        onPress={() => toggleModal('showTodoUpdateModal', id) }
      />
      <SimpleModal
        title="Update todo:"
        visible={showTodoUpdateModal}
        closeAction={() => toggleModal('showTodoUpdateModal', id)}
      >
        <TextInput
          style={textInputs.default}
          autoCapitalize="sentences"
          placeholder="What needs to be done?"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          onChangeText={input => setData({todo: input})}
          blurOnSubmit={false}
          value={todo}
        />
        <TextInput
          style={textInputs.default}
          autoCapitalize="sentences"
          placeholder="description"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          onChangeText={input => setData({notes: input})}
          blurOnSubmit={false}
          value={notes}
        />
        <View><Text>Remind Me</Text></View>
        <Switch
          onValueChange={input => setData({remindMe: input})}
          value={remindMe}
        />
        <View>
          <Button onPress={showDatepicker} title={strDate} />
        </View>
        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dueDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <Buttons
          type="primary"
          title="Add List"
          onPress={() => updateTodo(id)}
        />
      </SimpleModal>
      {completed
        && (
          <>
            <MaterialIcons
              style={styles.feedBackIcon}
              name="feedback"
              size={GlobalStyles.iconSize}
              onPress={() => toggleModal('showFeedBackModal') }
            />
            <SimpleModal
              title="Add new list:"
              visible={showFeedBackModal}
              closeAction={() => toggleModal('showFeedBackModal')}
            >
              <TextInput
                style={textInputs.default}
                autoCapitalize="sentences"
                placeholder="How did you do?"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                onChangeText={input => onFeedBack(id, input)}
                blurOnSubmit={false}
                value={feedBack}
              />
              <Button
                type="primary"
                title="Send FeedBack"
                onPress={() => {
                  toggleModal('showFeedBackModal', id)
                  submitFeedBack(id)
                }}
              />
            </SimpleModal>
          </>
        )
      }
    </View>
  );
};

propTypes = {
  id: PropTypes.string.isRequired,
  checkBoxToggle: PropTypes.func.isRequired,
  onFeedBack: PropTypes.func.isRequired,
  submitFeedBack: PropTypes.func.isRequired,
  showFeedBackModal: PropTypes.bool.isRequired,
  showTodoUpdateModal: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  todo: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  remindMe: PropTypes.bool.isRequired,
  strDate: PropTypes.string.isRequired,
  dueDate: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  showDatepicker: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  showPicker: PropTypes.bool.isRequired
};

export default Todo;