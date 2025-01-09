import styles from './UserLogin.module.css';

import md5 from 'md5';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [registerMessage, setRegisterMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    const hashedPassword = md5(password);

    try {
      const response = await fetch(`/user/?username=${username}`);
      const userData = await response.json();

      if (!response.ok) {
        setUsernameError(userData.error || 'Unbekannter Fehler');
        setTimeout(() => setUsernameError(''), 2000);
        return;
      }
      if (response.ok && userData.password !== hashedPassword) {
        setPasswordError('Passwort nicht korrekt');
        setTimeout(() => setPasswordError(''), 2000);
        return;
      }

      localStorage.setItem('username', username);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo);
    } catch (error) {
      console.error('Fehler: ', error.message);
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewUser = async (event) => {
    event.preventDefault();

    const hashedPassword = md5(password);

    const newUser = {
      email: email,
      username: username,
      password: hashedPassword
    };

    try {
      const response = await fetch('/user/new-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const userData = await response.json();

      if (!validateEmail(email)) {
        setEmailError('Bitte eine gültige E-Mailadresse angeben');
        setTimeout(() => setEmailError(''), 2000);
      }

      if (!response.ok) {
        setUsernameError(userData.error || 'Unbekannter Fehler');
        setTimeout(() => setUsernameError(''), 2000);
        return;
      }

      if (response.status === 200) {
        localStorage.setItem('username', username);
        setRegisterMessage('Du hast dich erfolgreich registriert');
        setTimeout(() => setRegisterMessage(''), 2000);
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo);
      }

    } catch (error) {
      console.error('Fehler: ', error.message);
    }

  }

  return (
    <div className={styles.login_container}>
      <div className={styles.login_left}>

        <form className={styles.login_form}>
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt='ToDo Logo'
            className={styles.logo}
          />

          {isLogin ? (
            <>
              <fieldset>
                <legend>Login</legend>

                <label htmlFor='username'>Benutzername</label>
                <input
                  id='username'
                  type='text'
                  name='username'
                  autoComplete='username'
                  value={username}
                  required
                  onChange={event => setUsername(event.target.value)}
                ></input>
                <small className={styles.small_error}>{usernameError}</small>

                <label htmlFor='password'>Passwort</label>
                <input
                  id='password'
                  type='password'
                  name='password'
                  autoComplete="current-password"
                  value={password}
                  required
                  onChange={event => setPassword(event.target.value)}
                ></input>
                <small className={styles.small_error}>{passwordError}</small>
              </fieldset>

              <div className={styles.form_btns}>
                <small className={styles.small_text}>Passwort vergessen?</small>
                <button type='button'
                  onClick={handleLogin}
                  className={styles.submit_btn}
                >Login
                </button>

                <small className={styles.small_text}>Noch kein Konto?
                  <button
                    type='button'
                    className={styles.switch_link}
                    onClick={() => setIsLogin(false)}>
                    Registrieren
                  </button>
                </small>
              </div>
            </>
          ) : (
            <>
              <fieldset>
                <legend>Registrieren</legend>

                <label htmlFor='email'>E-Mailadresse</label>
                <input
                  id='email'
                  type='email'
                  name='email'
                  autoComplete='email'
                  value={email}
                  required
                  onChange={event => setEmail(event.target.value)}
                ></input>
                <small className={styles.small_error}>{emailError}</small>

                <label htmlFor='username'>Benutzername</label>
                <input
                  id='username'
                  type='text'
                  name='username'
                  autoComplete='username'
                  value={username}
                  required
                  onChange={event => setUsername(event.target.value)}
                ></input>
                <small className={styles.small_error}>{usernameError}</small>

                <label htmlFor='password'>Passwort</label>
                <input
                  id='password'
                  type='password'
                  name='password'
                  autoComplete="new-password"
                  value={password}
                  required
                  onChange={event => setPassword(event.target.value)}
                ></input>
                <small className={styles.small_error}>{passwordError}</small>
              </fieldset>
              <small className={styles.small_msg}>{registerMessage}</small>

              <div className={styles.form_btns}>
                <button
                  type='button'
                  onClick={handleNewUser}
                  className={styles.submit_btn}
                >Registrieren
                </button>

                <small className={styles.small_text}>Du hast schon ein Konto?
                  <button
                    type='button'
                    className={styles.switch_link}
                    onClick={() => setIsLogin(true)}>
                    Login
                  </button>
                </small>
              </div>
            </>
          )}

        </form>
      </div>
      {isLogin ? (

        <div className={styles.login_right}>
          <h1>Willkommen zurück!</h1>

          <p>Wir haben auf dich gewartet!</p>
          <p>
            Lass uns gemeinsam deine Ziele erreichen und deinen Tag optimal planen.
          </p>
          <p>Melde dich an, um deine Aufgaben zu verwalten und produktiv zu bleiben.
            <br />
            Du hast das geschafft, also lass uns das Beste aus deinem Tag herausholen!
          </p>

        </div>
      ) : (
        <div className={styles.login_right}>
          <h1>Mach den ersten Schritt in Richtung Produktivität!</h1>

          <p>Erstelle jetzt dein Konto und verwandle deine Aufgaben in Erfolge.</p>
          <p>
            Mit unserer ToDo-App kannst du deine Ziele im Blick behalten,
            <br />
            deine Zeit besser nutzen und stressfreier leben.
          </p>
          <p>Beginne noch heute, deine Träume zu verwirklichen!</p>

        </div>
      )}

    </div>
  )

}

export default UserLogin;