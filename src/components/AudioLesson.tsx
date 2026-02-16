import React, { useState, useRef } from 'react';
import { CategoryLesson } from '../data/categoryLessons';
import './AudioLesson.css';

interface AudioLessonProps {
  lesson: CategoryLesson;
  onClose: () => void;
}

const AudioLesson: React.FC<AudioLessonProps> = ({ lesson, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="audio-lesson-overlay" onClick={onClose}>
      <div className="audio-lesson-modal" onClick={(e) => e.stopPropagation()}>
        <button className="audio-lesson-close" onClick={onClose}>
          ✕
        </button>

        <div className="audio-lesson-header">
          <span className="audio-lesson-icon">🎓</span>
          <h2 className="audio-lesson-title">{lesson.title}</h2>
        </div>

        <div className="audio-lesson-content">
          <p className="audio-lesson-explanation">{lesson.explanation}</p>

          <div className="audio-lesson-examples">
            <h3>Example words:</h3>
            <div className="audio-lesson-example-words">
              {lesson.examples.map((word, idx) => (
                <span key={idx} className="audio-lesson-example-word">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {lesson.audioFile && (
          <div className="audio-lesson-player">
            <button
              className={`audio-lesson-play-button ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayPause}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Listen to Explanation'}
            </button>
            <audio
              ref={audioRef}
              src={lesson.audioFile}
              onEnded={handleAudioEnded}
              onError={() => {
                console.warn(`Audio file not found: ${lesson.audioFile}`);
              }}
            />
          </div>
        )}

        <div className="audio-lesson-footer">
          <p className="audio-lesson-tip">
            💡 <strong>Tip:</strong> Practice these words until you can spell them without thinking!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioLesson;
