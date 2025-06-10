import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://reading-backend-qtft.onrender.com'
  : 'http://localhost:8000';

function App() {
  const [words, setWords] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newGraphemes, setNewGraphemes] = useState('');

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`${API_URL}/words`);
      setWords(response.data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const addWord = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/words`, {
        original_word: newWord,
        category: newCategory,
        image_url: newImageUrl || 'https://via.placeholder.com/300x200?text=Word+Image',
        graphemes: newGraphemes || null
      });
      setNewWord('');
      setNewCategory('');
      setNewImageUrl('');
      setNewGraphemes('');
      fetchWords();
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % words.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + words.length) % words.length);
  };

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#FDF0D5',
      minHeight: '100vh',
      fontFamily: "'Open Sans', sans-serif",
    },
    header: {
      color: '#003049',
      textAlign: 'center',
      marginBottom: '30px',
      fontWeight: '700',
    },
    cardContainer: {
      border: '2px solid #003049',
      borderRadius: '16px',
      padding: '30px',
      minHeight: '400px',
      marginBottom: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'relative',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '250px',
      marginBottom: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    word: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#780000',
      marginBottom: '15px',
      textAlign: 'center',
    },
    category: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#669BBC',
      marginBottom: '15px',
      textAlign: 'center',
    },
    graphemes: {
      fontSize: '18px',
      fontWeight: '400',
      color: '#003049',
      marginBottom: '20px',
      textAlign: 'center',
    },
    pronounceButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#C1121F',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s',
    },
    navigationButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '40px',
    },
    navButton: {
      padding: '12px 24px',
      backgroundColor: '#003049',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    formTitle: {
      color: '#003049',
      marginBottom: '20px',
      fontWeight: '700',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '2px solid #669BBC',
      borderRadius: '8px',
      fontSize: '16px',
      fontFamily: "'Open Sans', sans-serif",
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#780000',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
  };

  if (words.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Word Cards</h1>
        <div style={styles.formContainer}>
          <form onSubmit={addWord}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Graphemes (optional) - e.g., sh, i, p"
                value={newGraphemes}
                onChange={(e) => setNewGraphemes(e.target.value)}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>Add Word</button>
          </form>
          <p style={{ textAlign: 'center', color: '#003049', marginTop: '20px' }}>
            No words yet. Add your first one above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Word Cards ({currentCard + 1}/{words.length})</h1>
      
      <div style={styles.cardContainer}>
        <button 
          onClick={() => speakWord(words[currentCard]?.original_word)}
          style={styles.pronounceButton}
        >
          🔊
        </button>
        <img 
          src={words[currentCard]?.image_url} 
          alt={words[currentCard]?.original_word}
          style={styles.image}
        />
        <h2 style={styles.word}>
          {words[currentCard]?.original_word}
        </h2>
        <p style={styles.category}>
          Category: {words[currentCard]?.category}
        </p>
        {words[currentCard]?.graphemes && (
          <p style={styles.graphemes}>
            Graphemes: {words[currentCard]?.graphemes}
          </p>
        )}
      </div>

      <div style={styles.navigationButtons}>
        <button onClick={prevCard} style={styles.navButton}>Previous</button>
        <button onClick={nextCard} style={styles.navButton}>Next</button>
      </div>

      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Add New Word</h3>
        <form onSubmit={addWord}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Graphemes (optional) - e.g., sh, i, p"
              value={newGraphemes}
              onChange={(e) => setNewGraphemes(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Add Word</button>
        </form>
      </div>
    </div>
  );
}

export default App;