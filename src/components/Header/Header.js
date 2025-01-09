import styles from './Header.module.css';

import { useEffect, useState } from 'react';
import addIcon from '../../assets/icons/add_icon.svg';

const Header = () => {

  const [dateTime, setDateTime] = useState(new Date());
  const [newTodo, setNewTodo] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || 'Rockstar';
  });

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date(), 1000));
    return () => clearInterval(interval);
  }, [])

  const formattedDate = dateTime.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      setMessage('Bitte ein ToDo eingeben.');
      setIsError(true);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      const response = await fetch('/todos/add-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          todo: newTodo,
        })
      });

      if (response.ok) {
        const userData = await response.json();
        setMessage(userData);
        setNewTodo('');
        setIsError(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Fehler beim Hinzufügen des ToDos.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Fehler: ', error.message);
    }
    setTimeout(() => setMessage(''), 2000);
  }

  return (
    <header className={styles.header_container}>
      <div className={styles.header_content}>
        <h1>{formattedDate} - {dateTime.toLocaleTimeString()}</h1>
        <p>Hey {username}! Bereit, deinen Tag produktiv zu gestalten?</p>

        <form onSubmit={handleSubmit} className={styles.addTodo_form}>
          <input
            type='text'
            value={newTodo}
            onChange={event => setNewTodo(event.target.value)}
            placeholder="Neues Todo hinzufügen"
          />
          <button type="submit">
            <img src={addIcon} alt="Hinzufügen" className={styles.add_icon} />
          </button>
        </form>
        {message && (
          <p className={`${styles.message} ${isError ? styles.error : ''}`}>
            {message}
          </p>
        )}
      </div>
    </header>
  )
}

export default Header;