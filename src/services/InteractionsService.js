
import { users } from '../firebase';
import { setInteractions } from '../actions'

const interactionsUpdate = (id, next) => {
    users.onceGetInteractions(id).then(snapshot => {
        let interactions = snapshot.val()
        next(setInteractions(interactions))
    }).catch(err => {
        console.log(err.message)
    })
}

export const handleInteractions = store => next => action => {
        switch(action.type) {
        case 'GET_INTERACTIONS':
            interactionsUpdate(action.id, next)
            break
        case 'ADD_INTERACTION':
            users.addInteraction(action.id, action.jobId, action.ref, action.data).then( () => {
                interactionsUpdate(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        case 'DELETE_INTERACTION':
            users.deleteInteraction(action.id, action.application, action.ref).then( () => {
                interactionsUpdate(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        case 'UPDATE_INTERACTION':
            users.updateInteraction(action.id, action.jobId, action.ref, action.data).then( () => {
                interactionsUpdate(action.id, next)
            }).catch(error => {
                console.log(error)
            })
            break
        default:
            next(action)
            break
    }
}