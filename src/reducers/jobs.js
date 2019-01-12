const INITIAL_STATE = {
    jobs: {},
  };

const setUserJobs = (state, action) => ({
    ...state,
    jobs: action.jobs
  })

  function jobsReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_USER_JOBS': {
        return setUserJobs(state, action);
      }
      case 'REORDER_USER_JOBS': {
        switch (action.order) {
          case 'alpha-company-asc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].company < jobs[b].company) return -1
                if (jobs[a].company > jobs[b].company) return 1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'alpha-company-desc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].company < jobs[b].company) return 1
                if (jobs[a].company > jobs[b].company) return -1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'alpha-position-asc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].position < jobs[b].position) return -1
                if (jobs[a].position > jobs[b].position) return 1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'alpha-position-desc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].position < jobs[b].position) return 1
                if (jobs[a].position > jobs[b].position) return -1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'chrono-asc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].dateNumeric < jobs[b].dateNumeric) return -1
                if (jobs[a].dateNumeric > jobs[b].dateNumeric) return 1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'chrono-desc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].dateNumeric < jobs[b].dateNumeric) return 1
                if (jobs[a].dateNumeric > jobs[b].dateNumeric) return -1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'confidence-asc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].confidence < jobs[b].confidence) return -1
                if (jobs[a].confidence > jobs[b].confidence) return 1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'confidence-desc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (jobs[a].confidence < jobs[b].confidence) return 1
                if (jobs[a].confidence > jobs[b].confidence) return -1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          case 'salary-desc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (Number(jobs[a].salary) < Number(jobs[b].salary)) return 1
                if (Number(jobs[a].salary) > Number(jobs[b].salary)) return -1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered 
          }
          break
          case 'salary-asc': {
            let jobs = action.jobs
            let jobsReordered = {}
            let newKeys = Object.keys(jobs)
              .sort((a,b) => {
                if (Number(jobs[a].salary) < Number(jobs[b].salary)) return -1
                if (Number(jobs[a].salary) > Number(jobs[b].salary)) return 1
                return 0
              })
            newKeys.forEach( key => jobsReordered[key] = jobs[key])
            action.jobs = jobsReordered
          }
          break
          default : return state;
        }
        return setUserJobs(state, action);
      }
      default: return state;
    }
  }
  
  export default jobsReducer;