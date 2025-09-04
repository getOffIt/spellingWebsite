import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useProgress } from '../contexts/ProgressProvider';

const signOutRedirect = (auth: ReturnType<typeof useAuth>) => {
  const clientId = "3ua09or8n2k4cqldeu3u8bv585";
  const logoutUri = `${window.location.origin}/`;
  const cognitoDomain = "https://eu-west-2xeqbqosjj.auth.eu-west-2.amazoncognito.com";
  auth.removeUser().then(() => {
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  });
};

const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: 1,
    minWidth: '200px',
    margin: '0.5rem'
  }}>
    <h3 style={{ color: '#4B5563', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</h3>
    <div style={{ color, fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

const DailyActivityCalendar = ({ dailyActivity, progress }: { 
  dailyActivity: { [key: string]: number },
  progress: Record<string, any[]>
}) => {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Get the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  // Get attempts for a specific date
  const getAttemptsForDate = (dateStr: string) => {
    const attempts: { wordId: string; attempts: any[] }[] = [];
    Object.entries(progress).forEach(([wordId, wordAttempts]) => {
      const dateAttempts = wordAttempts.filter(attempt => 
        attempt.date.split('T')[0] === dateStr
      );
      if (dateAttempts.length > 0) {
        attempts.push({ wordId, attempts: dateAttempts });
      }
    });
    return attempts;
  };

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '1rem'
    }}>
      <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>Daily Activity</h3>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        {last7Days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const activity = dailyActivity[dateStr] || 0;
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div 
              key={dateStr} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDate(selectedDate === dateStr ? null : dateStr)}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: activity > 0 ? '#059669' : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activity > 0 ? 'white' : '#6B7280',
                fontWeight: 'bold',
                border: isToday ? '2px solid #2563eb' : 'none',
                transition: 'transform 0.2s',
                transform: selectedDate === dateStr ? 'scale(1.1)' : 'scale(1)'
              }}>
                {activity}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                {days[date.getDay()]}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#F9FAFB',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#4B5563', marginBottom: '1rem' }}>
            Attempts for {new Date(selectedDate).toLocaleDateString()}
          </h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {getAttemptsForDate(selectedDate).map(({ wordId, attempts }) => (
              <div key={wordId} style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: '#2563eb',
                  marginBottom: '0.5rem'
                }}>
                  Word: {wordId}
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  {attempts.map((attempt, index) => (
                    <div key={index} style={{ 
                      marginBottom: '0.25rem',
                      color: attempt.correct ? '#059669' : '#DC2626'
                    }}>
                      Attempt: {attempt.attempt} - {attempt.correct ? 'Correct' : 'Incorrect'}
                      <span style={{ color: '#6B7280', marginLeft: '0.5rem' }}>
                        ({new Date(attempt.date).toLocaleTimeString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityCalendar = ({ dailyMasteredWords, progress }: { 
  dailyMasteredWords: { [key: string]: { mastered: string[], unmastered: string[], remastered: string[] } },
  progress: Record<string, any[]>
}) => {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Get the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  // Get mastered, unmastered, and remastered words for a specific date
  const getWordsForDate = (dateStr: string) => {
    return dailyMasteredWords[dateStr] || { mastered: [], unmastered: [], remastered: [] };
  };

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '1rem'
    }}>
      <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>Daily Word Status Changes</h3>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        {last7Days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const wordsData = getWordsForDate(dateStr);
          // Note: remastered words are processed separately and excluded from both mastered and unmastered arrays, so they do not contribute to the net change calculation.
          const hasChanges = wordsData.mastered.length > 0 || wordsData.unmastered.length > 0 || wordsData.remastered.length > 0;
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div 
              key={dateStr} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDate(selectedDate === dateStr ? null : dateStr)}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: !hasChanges ? '#E5E7EB' : (netChange > 0 ? '#059669' : (netChange < 0 ? '#DC2626' : '#6B7280')),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hasChanges ? 'white' : '#6B7280',
                fontWeight: 'bold',
                border: isToday ? '2px solid #2563eb' : 'none',
                transition: 'transform 0.2s',
                transform: selectedDate === dateStr ? 'scale(1.1)' : 'scale(1)'
              }}>
                {hasChanges ? (netChange > 0 ? `+${netChange}` : netChange) : 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                {days[date.getDay()]}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem',
          background: '#F9FAFB',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#4B5563', marginBottom: '1rem' }}>
            Word Changes on {new Date(selectedDate).toLocaleDateString()}
          </h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {(() => {
              const wordsData = getWordsForDate(selectedDate);
              const hasMastered = wordsData.mastered.length > 0;
              const hasUnmastered = wordsData.unmastered.length > 0;
              const hasRemastered = wordsData.remastered.length > 0;
              
              if (!hasMastered && !hasUnmastered && !hasRemastered) {
                return (
                  <div style={{ color: '#6B7280', fontStyle: 'italic' }}>
                    No word status changes on this date
                  </div>
                );
              }
              
              return (
                <div>
                  {hasMastered && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ color: '#059669', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        ✓ Words Mastered ({wordsData.mastered.length})
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {wordsData.mastered.map((wordId, index) => (
                          <div key={index} style={{ 
                            background: '#059669',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}>
                            {wordId}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {hasRemastered && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ color: '#7C2D12', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        🔄 Words Re-mastered ({wordsData.remastered.length})
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {wordsData.remastered.map((wordId, index) => (
                          <div key={index} style={{ 
                            background: 'linear-gradient(45deg, #DC2626 0%, #059669 100%)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            border: '2px solid #F59E0B'
                          }}>
                            {wordId}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        These words were unmastered and re-mastered on the same day
                      </div>
                    </div>
                  )}
                  
                  {hasUnmastered && (
                    <div>
                      <h5 style={{ color: '#DC2626', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        ✗ Words Unmastered ({wordsData.unmastered.length})
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {wordsData.unmastered.map((wordId, index) => (
                          <div key={index} style={{ 
                            background: '#DC2626',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}>
                            {wordId}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const auth = useAuth();
  const { progress, getWordStats } = useProgress();
  
  if (!auth.isAuthenticated || !auth.user) return null;
  
  const profile = auth.user.profile;
  const username = profile['cognito:username'] || profile.email || profile.sub;

  // Calculate KPIs
  const wordIds = Object.keys(progress);
  const stats = wordIds.map(wordId => getWordStats(wordId));
  
  // Get the start of the current week (Sunday)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate words mastered this week
  const wordsMasteredThisWeek = stats.filter(stat => {
    if (stat.status !== 'mastered') return false;
    const lastSeen = stat.lastSeen ? new Date(stat.lastSeen) : null;
    return lastSeen && lastSeen >= startOfWeek;
  }).length;

  // Calculate daily activity
  const dailyActivity: { [key: string]: number } = {};
  wordIds.forEach(wordId => {
    const attempts = progress[wordId] || [];
    attempts.forEach(attempt => {
      const date = attempt.date.split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });
  });

  // Calculate daily mastered and unmastered words
  const dailyMasteredWords: { [key: string]: { mastered: string[], unmastered: string[], remastered: string[] } } = {};
  
  wordIds.forEach(wordId => {
    const attempts = progress[wordId] || [];
    if (attempts.length === 0) return;
    
    // Track mastery and unmastery events chronologically
    let consecutiveCorrect = 0;
    let wasMastered = false;
    
    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      const attemptDate = attempt.date.split('T')[0];
      
      if (attempt.correct) {
        consecutiveCorrect++;
        
        // Check if this attempt achieves mastery (3rd consecutive correct)
        if (consecutiveCorrect === 3 && !wasMastered) {
          if (!dailyMasteredWords[attemptDate]) {
            dailyMasteredWords[attemptDate] = { mastered: [], unmastered: [], remastered: [] };
          }
          dailyMasteredWords[attemptDate].mastered.push(wordId);
          wasMastered = true;
        }
      } else {
        // Incorrect attempt - check if this breaks mastery
        if (wasMastered && consecutiveCorrect >= 3) {
          if (!dailyMasteredWords[attemptDate]) {
            dailyMasteredWords[attemptDate] = { mastered: [], unmastered: [], remastered: [] };
          }
          // Only add if not already in the unmastered list for this date
          if (!dailyMasteredWords[attemptDate].unmastered.includes(wordId)) {
            dailyMasteredWords[attemptDate].unmastered.push(wordId);
          }
          wasMastered = false;
        }
        consecutiveCorrect = 0;
      }
    }
  });

  // Post-process to handle same-day re-masteries
  Object.keys(dailyMasteredWords).forEach(date => {
    const dayData = dailyMasteredWords[date];
    
    // Find words that appear in both mastered and unmastered lists for the same day
    const remastered = dayData.mastered.filter(wordId => 
      dayData.unmastered.includes(wordId)
    );
    
    if (remastered.length > 0) {
      // Move these words to the remastered list
      dayData.remastered = remastered;
      
      // Remove them from both mastered and unmastered lists to avoid double counting
      dayData.mastered = dayData.mastered.filter(wordId => !remastered.includes(wordId));
      dayData.unmastered = dayData.unmastered.filter(wordId => !remastered.includes(wordId));
    }
  });

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);
  while (dailyActivity[checkDate.toISOString().split('T')[0]]) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2563eb', margin: 0 }}>Learning Progress Dashboard</h2>
          <button
            onClick={() => signOutRedirect(auth)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Log out
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>Welcome, {String(username || '')}</h3>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            title="Words Mastered This Week" 
            value={wordsMasteredThisWeek} 
            color="#059669"
          />
          <StatCard 
            title="Current Streak" 
            value={`${currentStreak} days`} 
            color="#7C3AED"
          />
          <StatCard 
            title="Total Words Mastered" 
            value={stats.filter(s => s.status === 'mastered').length} 
            color="#2563eb"
          />
        </div>

        <DailyActivityCalendar 
          dailyActivity={dailyActivity}
          progress={progress}
        />
        
        <ActivityCalendar 
          dailyMasteredWords={dailyMasteredWords} 
          progress={progress}
        />
      </div>
    </div>
  );
} 