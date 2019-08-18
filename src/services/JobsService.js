
import { users } from '../firebase';
import { setUserJobs } from '../actions'

const jobsUpdate = (id, next) => {
    users.onceGetUserJobs(id).then(snapshot => {
        let jobs = snapshot.val()
        setWithSortOrder(id, jobs, next)
    }).catch(err => {
        console.log(err.message)
    })
}

const setWithSortOrder = (id, jobs, next) => {
    users.getSortPreference(id).then(sortSnapshot => {
        let sort = sortSnapshot.val()
        next(setUserJobs(jobs, sort))
    }).catch(err => {
        console.log(err)
    })
}

export const handleUserJobs = store => next => action => {
    switch(action.type) {
        case 'GET_JOBS':
            jobsUpdate(action.id, next)
            break
        case 'GET_SEVERAL_JOBS':
            let jobs = {}
            for (let i = 0; i < action.jobIds.length; i++) {
                users.getOneJob(action.id, action.jobIds[i]).then( (snapshot) => {
                    jobs[action.jobIds[i]] = snapshot.val()
                })
            }
            console.log(jobs)
            setWithSortOrder(action.id, jobs, next)
            break
        case 'ADD_JOB':
            users.doCreateJob(action.id, action.ref, action.data).then((snapshot) => {
                jobsUpdate(action.id, next)
            })
            .catch(error => {
                console.log(error)
            })
            break
        case 'EDIT_JOB':
            users.editOneJob(action.id, action.jobId, action.data).then(snapshot => {
                jobsUpdate(action.id, next)
            }).catch(err => {
                console.log(err.message)
            })
            break
        case 'DELETE_JOB':
            users.removeOneJob(action.userId, action.jobId).then( () => {
                jobsUpdate(action.userId, next)
            }).catch(err => {
                console.log(err.message)
            })          
            break
        case 'DELETE_ALL_JOBS':
            users.removeAllJobs(action.userId).then( () => {
                jobsUpdate(action.userId, next)
            }).catch( (err) => {
                console.log(err.message)
            })
            break
        default:
            next(action)
            break
    }
}