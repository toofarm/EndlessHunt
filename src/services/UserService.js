import { users } from '../firebase';
import { setUser } from '../actions';

const getCurrentUser = (id, next) => {
    users.getOneUser(id).then(snapshot => {
        next(setUser(snapshot.val()))  
    }).catch(err => {
        console.log(err.message)
    });
}

export const handleUser = store => next => action => {
    switch(action.type) {
        case 'GET_USER':
            getCurrentUser(action.id, next)
            break
        case 'RESET_USERNAME':
            users.updateUsername(action.id, action.username).then(() => {
                getCurrentUser(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        default:
            next(action)
            break
    }
}