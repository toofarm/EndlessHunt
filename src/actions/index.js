//////////JOBS\\\\\\\\\\\\

export const getJobs = (id) => {
    return {
        type: 'GET_JOBS',
        id: id
    }
}

export const setUserJobs = (jobs) => {
    return {
        type: 'SET_USER_JOBS',
        jobs: jobs
    }
}

export const getSomeJobs = (id, jobIds) => {
    return {
        type: 'GET_SEVERAL_JOBS',
        id: id,
        jobIds: jobIds
    } 
}

export const deleteOneJob = (userId, jobId) => {
    return {
        type: 'DELETE_JOB',
        userId: userId,
        jobId: jobId
    }
}

export const deleteAllJobs = (userId) => {
    return {
        type: 'DELETE_ALL_JOBS',
        userId: userId
    }
}

export const createOneJob = (id, ref, data) => {
    return {
        type: 'ADD_JOB',
        id: id,
        ref: ref,
        data: data
    }
}

export const editOneJob = (id, jobId, data) => {
    return {
        type: 'EDIT_JOB',
        id: id,
        jobId: jobId,
        data: data
    }
}

export const reorderJobs = (id, order, jobs) => {
    return {
        type: 'REORDER_USER_JOBS',
        id: id,
        order: order,
        jobs: jobs 
    }
}

///////////INACTIVE STATE\\\\\\\\\\\\\

export const toggleInactiveState = (order) => {
    return {
        type: 'SET_INACTIVE_STATE',
        order: order
    }
}

///////////USER\\\\\\\\\\\\\

export const getUser = (id) => {
    return {
        type: 'GET_USER',
        id
    }
}

export const setUser = (user) => {
    return {
        type: 'USER_SET',
        user: user
    }
}

export const resetUsername = (id, username) => {
    return {
        type: 'RESET_USERNAME',
        id,
        username
    }
}

//////////UI PANEL\\\\\\\\\\\\

export const toggleUiPanel = (order, data) => {
    return {
        type: 'TOGGLE_UI_CONTROLS',
        order,
        data
    }
}

//////////INTERACTIONS\\\\\\\\\\\\

export const setInteractions = (interactions) => {
    return {
        type: 'SET_INTERACTIONS',
        interactions: interactions 
    }
}

export const getInteractions = (id) => {
    return {
        type: 'GET_INTERACTIONS',
        id: id
    }
} 

export const addInteraction = (id, jobId, ref, data) => {
    return {
        type: 'ADD_INTERACTION',
        id: id,
        jobId: jobId,
        ref: ref,
        data: data
    }
}

export const updateInteraction = (id, jobId, ref, data) => {
    return {
        type: 'UPDATE_INTERACTION',
        id,
        jobId,
        ref,
        data
    }
}

export const deleteInteraction = (id, application, ref) => {
    return {
        type: 'DELETE_INTERACTION',
        id,
        application,
        ref
    }
}

//////////WISHLIST ACTIONS\\\\\\\\\\\\

export const setWishlistItems = (items) => {
    return {
        type: 'SET_WISHLIST',
        items
    }
}

export const addWishlistItem = (id, data) => {
    return {
        type: 'ADD_WISHLIST_ITEM',
        id,
        data
    }
}

export const updateWishlistItem = (id, ref, data) => {
    return {
        type: "UPDATE_WISHLIST_ITEM",
        id,
        ref,
        data
    }
}

export const deleteWishlistItem = (id, ref) => {
    return {
        type: "DELETE_WISHLIST_ITEM",
        id,
        ref
    }
}

export const getWishlistItems = (id) => {
    return {
        type: "GET_WISHLIST_ITEMS",
        id
    }
}

//////////MODAL ACTIONS\\\\\\\\\\\\

export const toggleModal = (jobOrder, interactionOrder, job, interaction) => {
    return {
        type: 'SET_MODAL_STATE',
        jobModal: jobOrder,
        interactionModal: interactionOrder,
        job: job,
        interaction: interaction
    }
}