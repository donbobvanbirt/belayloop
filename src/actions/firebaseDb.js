import uuidV1 from 'uuid/v1';

import { firebaseDb, firebaseAuth } from '../firebase';

function receiveUser(user) {
  // console.log('user:', user);
  return {
    type: 'RECEIVE_USER',
    payload: user,
  };
}

function receiveLoggedUser(user) {
  // console.log('user:', user);
  return {
    type: 'RECEIVE_LOGGED_USER',
    payload: user,
  };
}

function receiveConversation(con) {
  // console.log('user:', user);
  return {
    type: 'RECEIVE_CONVERSATION',
    payload: con,
  };
}

function receiveGyms(data) {
  return {
    type: 'RECEIVE_GYMS',
    payload: data,
  };
}

function receiveGym(data) {
  return {
    type: 'RECEIVE_GYM',
    payload: data,
  };
}

function receiveGroups(data) {
  return {
    type: 'RECEIVE_GROUPS',
    payload: data,
  };
}

function receiveGroup(data) {
  // console.log('group data:', data);
  return {
    type: 'RECEIVE_GROUP',
    payload: data,
  };
}

export function startListeningToUser(userId) {
  return (dispatch) => {
    const userRef = firebaseDb.ref('users').child(userId);
    userRef.off();
    userRef.on('value', (snapshot) => {
      const user = snapshot.val();
      dispatch(receiveUser(user));
    });
  };
}

export function listenToLoggedUser() {
  return (dispatch) => {
    // console.log('in listenToLoggedUser');
    const userRef = firebaseDb.ref('users').child(firebaseAuth.currentUser.uid);
    userRef.off();
    userRef.on('value', (snapshot) => {
      const user = snapshot.val();
      dispatch(receiveLoggedUser(user));
    });
  };
}

export function listenToConversation(id) {
  return (dispatch) => {
    // console.log('in listenToConversation');
    const ref = firebaseDb.ref('conversations').child(id);
    ref.off();
    ref.on('value', (snapshot) => {
      const con = snapshot.val();
      // console.log('con:', con);
      dispatch(receiveConversation(con));
    });
  };
}

export function updateUserInfo(userId, obj) {
  const userRef = firebaseDb.ref('users').child(userId);
  userRef.set(obj);

  return {
    type: 'UPDATE_USER_INFO',
    payload: obj,
  };
}

export function sendMessage(conversationId, obj, uid) {
  const conRef = firebaseDb.ref('conversations').child(conversationId);
  const userRef = firebaseDb.ref('users').child(uid).child('messages').child(conversationId).child('read');
  conRef.push(obj);
  userRef.set(false);

  return {
    type: 'SENT_MESSAGE',
    payload: obj,
  };
}

export function markAsRead(conversationId) {
  const { uid } = firebaseAuth.currentUser;
  const userRef = firebaseDb.ref('users').child(uid).child('messages').child(conversationId).child('read');
  userRef.set(true);

  return {
    type: 'MARKED_AS_READ',
    payload: conversationId,
  };
}

export function startConversation(receiverObj, messageObj) {
  const { message, subject } = messageObj;
  const { uid, displayName, photoURL } = firebaseAuth.currentUser;
  const conversationId = uuidV1();
  const userRef = firebaseDb.ref('users').child(uid).child('messages').child(conversationId);
  const receiverRef = firebaseDb.ref('users').child(receiverObj.uid).child('messages').child(conversationId);
  const conversationRef = firebaseDb.ref('conversations').child(conversationId);
  // console.log('conversationId:', conversationId);
  userRef.set({
    uid: receiverObj.uid,
    displayName: receiverObj.displayName,
    photoURL: receiverObj.photoURL,
    subject,
    read: true,
  });
  receiverRef.set({
    uid,
    displayName,
    photoURL,
    subject,
    read: false,
  });
  conversationRef.push({
    message,
    timestamp: Date.now(),
    uid,
    displayName,
    photoURL,
  });
  return {
    type: 'MESSAGE_SENT',
    payload: message,
  };
}

export function addGym(obj) {
  const ref = firebaseDb.ref('gyms');
  ref.push(obj);

  return {
    type: 'GYM_ADDED',
    payload: obj,
  };
}

export function listenToGyms() {
  return (dispatch) => {
    // console.log('in listenToGyms');
    const ref = firebaseDb.ref('gyms');
    ref.off();
    ref.on('value', (snapshot) => {
      const gyms = snapshot.val();
      // console.log('gyms:', gyms);
      dispatch(receiveGyms(gyms));
    });
  };
}

export function listenToGym(id) {
  return (dispatch) => {
    // console.log('in listenToGyms');
    const ref = firebaseDb.ref('gyms').child(id);
    ref.off();
    ref.on('value', (snapshot) => {
      const gym = snapshot.val();
      // console.log('gyms:', gyms);
      dispatch(receiveGym(gym));
    });
  };
}

export function addGroup(groupObj) {
  const { uid, displayName, photoURL } = firebaseAuth.currentUser;
  const obj = {
    name: groupObj.name,
    description: groupObj.description,
    leader: {
      uid,
      displayName,
      photoURL,
    },
    members: {
      [uid]: {
        displayName,
        photoURL,
      },
    },
  };
  const groupId = uuidV1();
  const groupRef = firebaseDb.ref('groups').child(groupId);
  const userRef = firebaseDb.ref('users').child(uid).child('groups').child(groupId);
  // this isn't anything
  groupRef.set(obj);
  userRef.set(groupObj);

  return {
    type: 'GROUP_ADDED',
    payload: obj,
  };
}

export function listenToGroups() {
  return (dispatch) => {
    // console.log('in listenToGroups');
    const ref = firebaseDb.ref('groups');
    ref.off();
    ref.on('value', (snapshot) => {
      const groups = snapshot.val();
      // console.log('groups:', groups);
      dispatch(receiveGroups(groups));
    });
  };
}

export function listenToGroup(id) {
  return (dispatch) => {
    const ref = firebaseDb.ref('groups').child(id);
    ref.off();
    ref.on('value', (snapshot) => {
      const group = snapshot.val();
      dispatch(receiveGroup(group));
    });
  };
}
