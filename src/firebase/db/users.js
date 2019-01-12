import { db } from '../firebase';

// User API

const users = db.ref('users')

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    applications: {}
  })

export const getOneUser = (id) =>
  db.ref(`users/${id}`).once('value')

export const updateUsername = (id, username) =>
  db.ref(`users/${id}`).update({
      username
  })

// Jobs 

export const doCreateJobRef = (id) => 
  users.child(id).child('applications').push()

export const doCreateJob = (id, ref, data) =>
  db.ref(`users/${id}/applications/${ref}`).set({
    position: data.title, 
    company: data.company,
    dateNumeric: data.dateNumeric,
    dateSanitized: data.dateSanitized,
    contact: data.jobContact,
    contactEmail: data.jobContactEmail,
    notes: data.notes,
    postingLink: data.posting,
    location: data.location,
    salary: data.salary,
    source: data.source,
    companyLink: data.companyLink,
    confidence: data.confidence,
    fresh: data.fresh,
    inactive: data.inactive
  })

export const onceGetUserJobs = (id) =>
  db.ref(`users/${id}/applications`).once('value')

export const removeOneJob = (id, application) =>
  db.ref(`users/${id}/applications/${application}`).remove()

export const removeAllJobs = (id) =>
  db.ref(`users/${id}/applications`).remove()

export const getOneJob = (id, application) =>
  db.ref(`users/${id}/applications/${application}`).once('value')

export const editOneJob = (id, application, data) =>
  db.ref(`users/${id}/applications/${application}`).update({
    position: data.position,
    company: data.company,
    dateNumeric: data.dateNumeric,
    dateSanitized: data.dateSanitized,
    contact: data.contact,
    contactEmail: data.contactEmail,
    notes: data.notes,
    postingLink: data.postingLink,
    location: data.location,
    salary: data.salary,
    source: data.source,
    companyLink: data.companyLink,
    confidence: data.confidence,
    inactive: data.inactive,
    fresh: data.fresh
  })

export const addResume = (id, application, filePath) =>
  db.ref(`users/${id}/applications/${application}`).update({
    resume: filePath
  })

export const deleteResume = (id, application) => 
  db.ref(`users/${id}/applications/${application}/resume`).remove()

export const addCoverLetter = (id, application, filePath) =>
  db.ref(`users/${id}/applications/${application}`).update({
    coverLetter: filePath
  })

export const deleteCoverLetter = (id, application) => 
  db.ref(`users/${id}/applications/${application}/coverLetter`).remove()


// Interactions
export const addInteraction = (id, application, ref, data) =>
  db.ref(`users/${id}/interactions/${application}/${ref}`).set({
    type: data.type,
    date: data.date,
    notes: data.notes
  })

export const updateInteraction = (id, application, ref, data) =>
  db.ref(`users/${id}/interactions/${application}/${ref}`).update({
    type: data.type,
    date: data.date,
    notes: data.notes
  })

export const deleteInteraction = (id, application, ref) => 
  db.ref(`users/${id}/interactions/${application}/${ref}`).remove()

export const onceGetInteractions = (id) => 
  db.ref(`users/${id}/interactions/`).once("value")

// Wishlist
export const addWishlistItem = (id, data) =>
  db.ref(`users/${id}/wishlist/`).push().set({
      url: data.url,
      title: data.title,
      company: data.company,
      date: data.date
  })

export const updateWishlistItem = (id, ref, data) =>
  db.ref(`users/${id}/wishlist/${ref}`).update({
      url: data.url,
      title: data.title,
      company: data.company,
      date: data.date
  })

export const deleteWishlistItem = (id, ref) =>
  db.ref(`users/${id}/wishlist/${ref}`).remove()

export const onceGetWishlist = (id) =>
  db.ref(`users/${id}/wishlist/`).once("value")