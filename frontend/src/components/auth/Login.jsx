// import React, { useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../Header';
import RegForm from './RegForm';
import { mestAuth } from '../../utils/Auth';
// import {CurrentUserContext} from '../../contexts/CurrentUserContext.js';
import {signPageCaptions, authRoutes, authFormIds, srvAuthData /*, userAuthData, confirmProp*/} from '../../utils/constants';

export function Login ({loggedIn, startApp, handleToolTipOpen}) {
  const navigate = useNavigate();
  const {inTitle, regTitle: regCaption, btnEnterCaption} = signPageCaptions;
  const {app, signup} = authRoutes; const {signin: formId} = authFormIds;

  if (loggedIn) navigate(`/${app}`);

  function handleRegForm (evt, {email , password}) {
    // console.log(`handleRegForm trace err: ${email} & ${password} entered`);
    // alert(`handleRegForm trace err: ${email} & ${password} entered`);
    evt.preventDefault();
    mestAuth.authorize({email, password}, srvAuthData.signin).then(result => {
      if (result.token) {
        localStorage.setItem('token', result.token);
        // console.log(`handleRegForm trace crash, login token is: ${result.token}`);
        // alert(`handleRegForm trace crash, login token is: ${result.token}`);
        return result.token;
      } else {
        console.log(`Token has not been received from server, result keys are: ${Object.keys(result).join('/')}`); // alert(`token has not been received from server, result keys are: ${Object.keys(result).join('/')}`)
      }
    }).then(token => mestAuth.checkToken(token).then(result => {
      startApp(result);
      navigate(`/${app}`)
    })
    ).catch(err => {handleToolTipOpen(false); console.log(`Login err: ${err}`); //alert(`Login err: ${err}`)
  }); }

  return (
    <>
      <Header routeLink={`/${signup}`} signCaption={regCaption} />
      <RegForm frmId={formId} frmTitle={inTitle} btnCaption={btnEnterCaption} handleRegForm={handleRegForm} />
    </>
  );
}