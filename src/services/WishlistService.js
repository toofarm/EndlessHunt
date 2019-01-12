
import { users } from '../firebase';
import { setWishlistItems } from '../actions'

const wishlistUpdate = (id, next) => {
    users.onceGetWishlist(id).then(snapshot => {
        let items = snapshot.val()
        next(setWishlistItems(items))
    }).catch(err => {
        console.log(err.message)
    })
}

export const handleWishlist = store => next => action => {
    switch(action.type) { 
        case 'GET_WISHLIST_ITEMS':
            wishlistUpdate(action.id, next)
            break
        case 'ADD_WISHLIST_ITEM':
            users.addWishlistItem(action.id, action.data).then( () => {
                wishlistUpdate(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        case 'DELETE_WISHLIST_ITEM':
            users.deleteWishlistItem(action.id, action.ref).then( () => {
                wishlistUpdate(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        case 'UPDATE_WISHLIST_ITEM':
            users.updateWishlistItem(action.id, action.ref, action.data).then( () => {
                wishlistUpdate(action.id, next)
            }).catch(error => {
                console.log(error)
            })
            break
        default:
            next(action)
            break
    }
}