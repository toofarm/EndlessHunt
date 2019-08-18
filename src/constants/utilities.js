// Add commas to salary values
export const formatSalary = (value) => {
    value = value.toString().replace(/[^\d]/g, '')
    let arr = value.split('').reverse()
    let result = []
    arr.forEach( (num, index) => {
      if ( (index + 1) % 3 === 0 &&
          index !== arr.length - 1 ) {
            num = "," + num
          }
      result.push(num)
    })
    return result.reverse().join('')
}

// Set state by property value
export const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  })

// Create one day in milliseconds
export const one_day = 1000*60*60*24

// Datalayer pushes for job panel actions
export const jobPanelDatalayerPush = (jobPanelAction, jobTitle, jobCompany, meta) => {
  let dataLayer = window.dataLayer || []
  dataLayer.push({
    'event': 'Job Panel Interaction',
    jobPanelAction,
    jobTitle,
    jobCompany,
    data: {...meta}
  })
}

// Datalayer pushes for control panel actions
export const controlPanelDatalayerPush = ( panelName, panelAction, panelParam, meta) => {
  let dataLayer = window.dataLayer || []
  dataLayer.push({
    'event': 'Control Panel Interaction',
    panelName,
    panelAction,
    panelParam,
    data: {...meta}
  })
}