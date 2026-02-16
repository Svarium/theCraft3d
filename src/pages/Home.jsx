import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import './Home.css';

const Home = () => {
    const [activeDrop, setActiveDrop] = useState(null);
    const [stats, setStats] = useState({ sold: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // 1. Get most recently created active drop
                const q = query(
                    collection(db, "drops"),
                    where("isActive", "==", true),
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const dropData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                    setActiveDrop(dropData);

                    // 2. Get real stats for this drop
                    const pq = query(collection(db, "products"), where("dropId", "==", dropData.id));
                    const pSnapshot = await getDocs(pq);

                    let totalStock = 0;
                    pSnapshot.forEach(doc => {
                        totalStock += (doc.data().stock || 0);
                    });

                    // For now, sold pieces is simulated as % of total or hardcoded until orders are implemented
                    // Setting a realistic baseline based on total stock
                    setStats({ sold: Math.floor(totalStock * 0.4), total: totalStock });
                }
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    useEffect(() => {
        if (!activeDrop?.endDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(activeDrop.endDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeDrop]);

    if (loading) return <Loader fullScreen />;

    if (!activeDrop) {
        return (
            <PageWrapper>
                <Container>
                    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
                        <h1>No Active Drops</h1>
                        <p>Stay tuned for the next release.</p>
                    </div>
                </Container>
            </PageWrapper>
        );
    }

    const progressPercentage = stats.total > 0 ? (stats.sold / stats.total) * 100 : 0;

    return (
        <PageWrapper className="home-page">
            <section className="hero" style={{
                backgroundImage: activeDrop.coverImage ? `linear-gradient(rgba(28, 15, 38, 0.8), rgba(28, 15, 38, 0.95)), url(${activeDrop.coverImage.url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <Container>
                    <div className="hero-content">
                        <span className="hero-subtitle">Active Drop</span>
                        <h1 className="hero-title">{activeDrop.name}</h1>
                        <p className="hero-description">
                            {activeDrop.description}
                        </p>
                        <div className="hero-actions">
                            <Button onClick={() => window.location.href = `/drop/${activeDrop.id}`}>View Drop</Button>
                            <Button variant="outline" onClick={() => window.location.href = '/drop'}>All Collections</Button>
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
                                    <span className="pieces-sold">{stats.sold} / {stats.total} pieces available</span>
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
