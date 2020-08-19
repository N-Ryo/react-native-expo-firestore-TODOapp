import uuid from 'uuid/v4';
import Database from './Database';

class Lists extends Database {
  getTodoList = async (userId) => {
    const userListsRef = `users/${userId}/lists`;

    
    const lists = {};
    let index = 0;
    await this.database.collection(userListsRef).get().then(async function(querySnapshot) {
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        lists[index] = doc.data();
        index++
      });
    });
    // console.log(userList)
    // // const userList = userListSnapshot.val();
    // const lists = {};
    // if (userList) {
    //   const listIds = Object.keys(userList);
    //   console.log(listIds)
    //   await Promise.all(listIds.map(async (listId) => {
    //     const listsRefKey = `lists/${listId}`;
    //     const snapshot = await this.database.ref(listsRefKey).once('value');
    //     const list = snapshot.val();

    //     if (list) {
    //       lists[listId] = list;
    //     }
    //     return null;
    //   }));

      return lists;
    // }

  }

  addTodoList = async (list, userId, _listId = null) => {
    try {
      const listId = _listId !== null ? _listId : uuid();
      const userListsRef = `users/${userId}/lists`;
      // const lists = {};
      // await this.database.collection(userListsRef).get().then(async function(querySnapshot) {
      //   await querySnapshot.forEach(function(doc) {
      //     // doc.data() is never undefined for query doc snapshots
      //     console.log(doc.id, " => ", doc.data());
      //     lists[doc.id] = doc.data();
      //   });
      // });
      return await this.database.collection(userListsRef).doc(listId).set(list);
    } catch (e) {
      console.log('addTodoList error >>', e);
      return null;
    }
  }

  updateTodoList = async (list, userId) => {
    try {
      const listRef = `users/${userId}/lists/${list.key}`;
      return await this.database.ref(listRef).update(list);
    } catch (e) {
      console.log('updateTodoList error >>', e);
      return null;
    }
  }

  deleteTodoList = async (listId, userId) => {
    const userListsRef = `users/${userId}/lists`
    await this.database.collection(userListsRef).doc(listId).delete();
  }

  getTodos = async (listId, userId) => {
    let todos = {}
    const refKey = `users/${userId}/lists/${listId}/todos`
    await this.database.collection(refKey).get().then(async function(querySnapshot) {
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        todos[doc.id] = doc.data();
      });
    });
    return todos
  }

  setTodos = (list, todo, userId) => {
    if (!userId) {
      return false;
    }
    const todoId = uuid();
    const refKey = `users/${userId}/lists/${list.key}/todos`;
    return this.database.collection(refKey).doc(todoId).set(todo);
  }

  updateTodo = async (todoId, listId, userId, todo) => {
    const refKey = `users/${userId}/lists/${listId}/todos`;
    console.log(refKey)
    console.log(todo)
    return this.database.collection(refKey).doc(todoId).set(todo, { merge: true });
  }

  deleteTodo = (todoId, listId, userId) => {
    const refKey = `users/${userId}lists/${listId}/todos`;
    return this.database.collection(refKey).doc(todoId).delete();
  }
}

const todos = new Lists();
export default todos;