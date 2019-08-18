
import { users } from '../firebase';
import { toggleSortState, toggleInactiveState } from '../actions'

const sortStateUpdate = (id, next) => {
    users.getSortPreference(id).then(snapshot => {
        next(toggleSortState(snapshot.val()))
    }).catch(err => {
        console.log(err)
    })
}

const inactiveStateUpdate = (id, next) => {
    users.getInactivePreference(id).then(snapshot => {
        next(toggleInactiveState(snapshot.val()))
    }).catch(err => {
        console.log(err)
    })
}

export const handleSortState = store => next => action => {
        switch(action.type) {
        case 'GET_SORT_STATE':
            sortStateUpdate(action.id, next)
            break
        case 'GET_INACTIVE_STATE':
            inactiveStateUpdate(action.id, next)
            break
        case 'UPDATE_SORT_STATE':
            users.updateSortPreference(action.id, action.data).then(snapshot => {             
                sortStateUpdate(action.id, next)
            }).catch(err => {
                console.log(err.message)
            })
            break
        case 'UPDATE_INACTIVE_STATE':
            let order = action.data || "showAll"
            users.updateInactivePreference(action.id, order).then(snapshot => {         
                inactiveStateUpdate(action.id, next)
            }).catch(err => {
                console.log(err.message)
            })
            break
        default:
            next(action)
            break
    }
}