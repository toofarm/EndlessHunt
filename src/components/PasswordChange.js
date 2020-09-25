import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'


export default function PasswordChangeForm() {

    const [passwordOne, setPasswordOne] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
    const [error, setError] = useState(null)
    const [resetSuccess, setResetSuccess] = useState(false)

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '';

    const pwWrongFormat =
        passwordOne.length < 8 ||
        passwordOne.search(/\d/) === -1

    useEffect(() => {
        auth.doPasswordUpdate(passwordOne)
            .then(() => {
                setPasswordOne('')
                setPasswordTwo('')
                setError(null)
                setResetSuccess(true)
            })
            .catch(error => {
                setError(error)
            });
    }, [])

    const onSubmit = (event) => {
        event.preventDefault();
    
        let dataLayer = window.dataLayer || []
        dataLayer.push({
          'event': 'profilePageInteraction',
          'profileAction': 'Change password',
          'newCredential': null
        })
    
        auth.doPasswordUpdate(passwordOne)
          .then(() => {
            setPasswordOne('')
            setPasswordTwo('')
            setError(null)
            setResetSuccess(true)
          })
          .catch(error => {
            setError(error)
          })
      }

    return (
        <form onSubmit={onSubmit} className="login-form">
            {passwordOne !== passwordTwo && <div className="ui-info">
                Your passwords do not match
            </div>}
            {!isInvalid && pwWrongFormat && <div className="ui-info">
                Your password must be at least 8 characters long and contain at least one number
          </div>}
            <input
                value={passwordOne}
                onChange={event => setPasswordOne(event.target.value)}
                type="password"
                placeholder="New Password"
            />
            <input
                value={passwordTwo}
                onChange={event => setPasswordTwo(event.target.value)}
                type="password"
                placeholder="Confirm New Password"
            />
            <button disabled={isInvalid || pwWrongFormat} type="submit">
                Reset My Password
          </button>
            {resetSuccess && <div className="ui-info">
                Your password has been updated
          </div>}
            {error && <p className="error">{error.message}</p>}
        </form>
    )
}