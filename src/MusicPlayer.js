import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mainBg from './assets/images/main_background.png';

const STORAGE_KEY = 'mindbloom_spotify_link';
const DEFAULT_LINK = 'https://open.spotify.com/playlist/5Qvz8wZIRYbEUUFoPueKI5?si=ZgEJAX0gQLOaW5SyL_l4aQ';

const MusicPlayer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const audioRef = useRef(null);

    const autoplay = location?.state?.autoplay;

    const [spotifyLink, setSpotifyLink] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_LINK;
        } catch {
            return DEFAULT_LINK;
        }
    });
    const [embedUrl, setEmbedUrl] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const parsed = parseSpotifyLink(spotifyLink);
        setEmbedUrl(parsed);
        try {
            localStorage.setItem(STORAGE_KEY, spotifyLink);
        } catch {}
    }, [spotifyLink]);

    useEffect(() => {
        if (autoplay && audioRef.current) {
            const p = audioRef.current.play();
            if (p && p.then) p.catch(() => {});
            setIsPlaying(true);
        }
    }, [autoplay]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const handler = (e) => {
            if (e.code === 'Space') {
                const active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
                if (!embedUrl && audioRef.current) {
                    e.preventDefault();
                    togglePlayPause();
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [embedUrl, isPlaying, volume]);

    function togglePlayPause() {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            const p = audio.play();
            if (p && p.then) p.catch(() => {});
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }

    function parseSpotifyLink(link) {
        if (!link || typeof link !== 'string') return null;

        // spotify: URI (spotify:playlist:ID)
        const uriMatch = link.match(/^spotify:(playlist|track|album):([^/?#&]+)/i);
        if (uriMatch) {
            return `https://open.spotify.com/embed/${uriMatch[1].toLowerCase()}/${uriMatch[2]}`;
        }

        // try URL parsing
        try {
            const url = new URL(link.trim());
            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length >= 2) {
                const type = parts[0].toLowerCase();
                const id = parts[1].split('?')[0].split('#')[0];
                if (['playlist', 'track', 'album'].includes(type) && id) {
                    return `https://open.spotify.com/embed/${type}/${id}`;
                }
            }
            const fallback = url.href.match(/(?:playlist|track|album)[/:]([^/?#&]+)/i);
            if (fallback) {
                const typeMatch = url.href.match(/(playlist|track|album)/i);
                const type = typeMatch ? typeMatch[1].toLowerCase() : 'playlist';
                return `https://open.spotify.com/embed/${type}/${fallback[1]}`;
            }
        } catch (e) {
            const m = link.match(/(playlist|track|album)[/:]([^/?#&\s]+)/i);
            if (m) return `https://open.spotify.com/embed/${m[1].toLowerCase()}/${m[2]}`;
        }
        return null;
    }

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '430px',
            height: '932px',
            maxWidth: '100vw',
            maxHeight: '100vh',
            overflow: 'hidden'
        }}>
            <img 
                src={mainBg} 
                alt="background" 
                style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                }} 
            />

            <div style={{ 
                position: 'relative', 
                zIndex: 10, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    padding: '20px',
                    borderRadius: '12px',
                    width: '85%',
                    maxWidth: '340px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginTop: '0', marginBottom: '16px', fontSize: '20px' }}>Music Player</h2>

                    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <label style={{ fontSize: '12px', color: '#333', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                            Spotify Link:
                        </label>
                        <input
                            value={spotifyLink}
                            onChange={(e) => setSpotifyLink(e.target.value)}
                            placeholder="Paste spotify link"
                            style={{
                                width: '100%',
                                padding: '10px',
                                boxSizing: 'border-box',
                                border: '2px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '11px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        {embedUrl ? (
                            <iframe
                                title="Spotify Player"
                                src={embedUrl}
                                width="100%"
                                height={embedUrl.includes('/track/') ? '152px' : '380px'}
                                frameBorder="0"
                                allowTransparency="true"
                                allow="autoplay; encrypted-media; clipboard-write"
                                style={{ borderRadius: '8px' }}
                            />
                        ) : (
                            <div style={{ padding: '16px', background: '#f0f0f0', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666' }}>No valid Spotify link</p>
                                <audio ref={audioRef} controls style={{ width: '100%', height: '32px' }}>
                                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                                </audio>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                                    <button
                                        onClick={togglePlayPause}
                                        style={{ 
                                            padding: '10px', 
                                            cursor: 'pointer', 
                                            borderRadius: '6px', 
                                            border: 'none', 
                                            background: '#1DB954', 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            fontSize: '13px' 
                                        }}
                                    >
                                        {isPlaying ? 'Pause' : 'Play'}
                                    </button>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', color: '#333', textAlign: 'left' }}>Volume</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div style={{ fontSize: '10px', color: '#999', textAlign: 'center' }}>
                                        Press Space to toggle
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        style={{ 
                            padding: '12px', 
                            cursor: 'pointer', 
                            fontSize: '13px', 
                            background: '#1DB954', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontWeight: 'bold', 
                            width: '100%' 
                        }} 
                        onClick={() => navigate('/self-care')}
                    >
                        Back to Self Care
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;