import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://reading-backend-qtft.onrender.com'
  : 'http://localhost:8000';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get(`${API_URL}/flashcards`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const addFlashcard = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/flashcards`, {
        question: newQuestion,
        answer: newAnswer
      });
      setNewQuestion('');
      setNewAnswer('');
      fetchFlashcards();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  if (flashcards.length === 0) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Flashcards</h1>
        <form onSubmit={addFlashcard}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>Add Flashcard</button>
        </form>
        <p>No flashcards yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Flashcards ({currentCard + 1}/{flashcards.length})</h1>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '20px', 
        minHeight: '200px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Question:</h3>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            {flashcards[currentCard]?.question}
          </p>
          
          {showAnswer && (
            <>
              <h3>Answer:</h3>
              <p style={{ fontSize: '18px', color: '#007bff' }}>
                {flashcards[currentCard]?.answer}
              </p>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={prevCard} style={{ padding: '10px 20px' }}>Previous</button>
        <button onClick={() => setShowAnswer(!showAnswer)} style={{ padding: '10px 20px' }}>
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        <button onClick={nextCard} style={{ padding: '10px 20px' }}>Next</button>
      </div>

      <form onSubmit={addFlashcard}>
        <h3>Add New Flashcard</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Add Flashcard</button>
      </form>
    </div>
  );
}

export default App;