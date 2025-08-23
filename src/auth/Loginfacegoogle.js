import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { socialLogin } from '../redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification';
import { useTranslation } from 'react-i18next';

const Loginfacegoogle = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || 'en';

  const { t } = useTranslation('auth');

  const [msg, setMsg] = useState({ err: '', success: '' });

  // ---------------- GOOGLE ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;

    if (tokenId) {
      try {
        await dispatch(socialLogin({ tokenId }, 'google'));
        setMsg({ err: '', success: t('login_success_google', { lng: lang }) });
        history.push('/');
      } catch (err) {
        setMsg({ err: t('login_error_google', { lng: lang }), success: '' });
      }
    }
  };

  const handleGoogleError = () => {
    setMsg({ err: t('login_cancel_failed_google', { lng: lang }), success: '' });
  };

  // ---------------- FACEBOOK ----------------
  const handleFacebookResponse = async (response) => {
    try {
      const { accessToken, userID } = response;

      if (!accessToken || !userID) {
        setMsg({ err: t('auth_error_facebook', { lng: lang }), success: '' });
        return;
      }

      await dispatch(socialLogin({ accessToken, userID }, 'facebook'));
      setMsg({ err: '', success: t('login_success_facebook', { lng: lang }) });
      history.push('/');
    } catch (err) {
      setMsg({ err: t('login_error_facebook', { lng: lang }), success: '' });
    }
  };

  return (
    <div className="login_page">
      {/* Mensajes */}
      {msg.err && showErrMsg(msg.err)}
      {msg.success && showSuccessMsg(msg.success)}

      {/* Google Login */}
      <div className="social mb-2">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          render={renderProps => (
            <button
              className="btn btn-danger w-100"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              {t('login_with_google', { lng: lang })}
            </button>
          )}
        />
      </div>

      {/* Facebook Login */}
      <div className="social">
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={renderProps => (
            <button
              className="btn btn-primary w-100"
              onClick={renderProps.onClick}
            >
              {t('login_with_facebook', { lng: lang })}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Loginfacegoogle;
