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
        image_url: newImageUrl || 'https://via.placeholder.com/300x200?text=Word+Image'
      });
      setNewWord('');
      setNewCategory('');
      setNewImageUrl('');
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

  if (words.length === 0) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Word Cards</h1>
        <form onSubmit={addWord}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>Add Word</button>
        </form>
        <p>No words yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Word Cards ({currentCard + 1}/{words.length})</h1>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '20px', 
        minHeight: '300px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <img 
          src={words[currentCard]?.image_url} 
          alt={words[currentCard]?.original_word}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '200px', 
            marginBottom: '20px',
            borderRadius: '4px'
          }}
        />
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
          {words[currentCard]?.original_word}
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
          Category: {words[currentCard]?.category}
        </p>
        <button 
          onClick={() => speakWord(words[currentCard]?.original_word)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔊 Pronounce
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={prevCard} style={{ padding: '10px 20px' }}>Previous</button>
        <button onClick={nextCard} style={{ padding: '10px 20px' }}>Next</button>
      </div>

      <form onSubmit={addWord}>
        <h3>Add New Word</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Add Word</button>
      </form>
    </div>
  );
}

export default App;