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

const ActivityCalendar = ({ dailyMasteredWords, progress }: { 
  dailyMasteredWords: { [key: string]: string[] },
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

  // Get mastered words for a specific date
  const getMasteredWordsForDate = (dateStr: string) => {
    return dailyMasteredWords[dateStr] || [];
  };

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '1rem'
    }}>
      <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>Words Mastered Today</h3>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        {last7Days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const masteredWords = getMasteredWordsForDate(dateStr);
          const masteredCount = masteredWords.length;
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
                background: masteredCount > 0 ? '#059669' : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: masteredCount > 0 ? 'white' : '#6B7280',
                fontWeight: 'bold',
                border: isToday ? '2px solid #2563eb' : 'none',
                transition: 'transform 0.2s',
                transform: selectedDate === dateStr ? 'scale(1.1)' : 'scale(1)'
              }}>
                {masteredCount}
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
            Words Mastered on {new Date(selectedDate).toLocaleDateString()}
          </h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {getMasteredWordsForDate(selectedDate).length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {getMasteredWordsForDate(selectedDate).map((wordId, index) => (
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
            ) : (
              <div style={{ color: '#6B7280', fontStyle: 'italic' }}>
                No words mastered on this date
              </div>
            )}
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

  // Calculate daily mastered words
  const dailyMasteredWords: { [key: string]: string[] } = {};
  wordIds.forEach(wordId => {
    const attempts = progress[wordId] || [];
    if (attempts.length === 0) return;
    
    // Find when this word became mastered (3 consecutive correct answers)
    let consecutiveCorrect = 0;
    for (let i = 0; i < attempts.length; i++) {
      if (attempts[i].correct) {
        consecutiveCorrect++;
        if (consecutiveCorrect === 3) {
          // Word became mastered on this date
          const masteryDate = attempts[i].date.split('T')[0];
          if (!dailyMasteredWords[masteryDate]) {
            dailyMasteredWords[masteryDate] = [];
          }
          dailyMasteredWords[masteryDate].push(wordId);
          break; // Only count the first time it became mastered
        }
      } else {
        consecutiveCorrect = 0; // Reset if incorrect
      }
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

        <ActivityCalendar 
          dailyMasteredWords={dailyMasteredWords} 
          progress={progress}
        />
      </div>
    </div>
  );
} 