import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Home.css';

const Home = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 32,
        seconds: 45
    });

    // Simple countdown simulation logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const dropProgress = 23;
    const totalPieces = 50;
    const progressPercentage = (dropProgress / totalPieces) * 100;

    return (
        <PageWrapper className="home-page">
            <section className="hero">
                <Container>
                    <div className="hero-content">
                        <span className="hero-subtitle">Limited Drop 001</span>
                        <h1 className="hero-title">NOCTURNA <span className="accent-text">CRAFT</span></h1>
                        <p className="hero-description">
                            Exquisite gothic 3D printing. Each piece is a testament to the shadows,
                            crafted for those who dwell in the elegance of the night.
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => window.location.href = '/drop'}>View Drop</Button>
                            <Button variant="outline">Learn More</Button>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="drop-preview">
                <Container>
                    <Card className="drop-status-card">
                        <div className="drop-info">
                            <div className="countdown-container">
                                <span className="info-label">Closing In</span>
                                <div className="countdown">
                                    <div className="time-block">
                                        <span className="time-val">{String(timeLeft.days).padStart(2, '0')}</span>
                                        <span className="time-label">D</span>
                                    </div>
                                    <span className="time-sep">:</span>
                                    <div className="time-block">
                                        <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="time-label">H</span>
                                    </div>
                                    <span className="time-sep">:</span>
                                    <div className="time-block">
                                        <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="time-label">M</span>
                                    </div>
                                    <span className="time-sep">:</span>
                                    <div className="time-block">
                                        <span className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="time-label">S</span>
                                    </div>
                                </div>
                            </div>

                            <div className="progress-container">
                                <div className="progress-header">
                                    <span className="info-label">Availability</span>
                                    <span className="pieces-sold">{dropProgress} / {totalPieces} pieces sold</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Container>
            </section>
        </PageWrapper>
    );
};

export default Home;
