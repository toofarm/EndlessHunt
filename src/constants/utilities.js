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