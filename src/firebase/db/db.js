import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  })

export const doCreateJob = (id, position, company) =>
  db.ref(`users/${id}`).set({
    position,
    company
  })

export const onceGetUsers = () =>
  db.ref('users').once('value')