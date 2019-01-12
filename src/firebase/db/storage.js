import { storage } from '../firebase';

// File system API

export const resumes = storage.ref().child('resumes/')
export const coverletters = storage.ref().child('coverlettters')
