import { Link } from 'react-router-dom';
import chapters from '../data/chapters';
import { loadProgress } from '../utils/progress';

export default function Chapters() {
    const progress = loadProgress();

    const difficultyLabel = (d) => {
        if (d <= 1) return { text: '入门', color: 'var(--color-accent-green)' };
        if (d <= 2) return { text: '基础', color: 'var(--color-accent-cyan)' };
        if (d <= 3) return { text: '中等', color: 'var(--color-accent-blue)' };
        if (d <= 4) return { text: '较难', color: 'var(--color-accent-orange)' };
        return { text: '核心难点', color: 'var(--color-accent-red)' };
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📚 章节学习空间</h1>
                <p>《家畜育种学（第二版）》全部章节内容 — 概念、公式、例题与测验</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} className="stagger-children">
                {chapters.map((ch) => {
                    const chProgress = progress.chapterProgress[ch.id];
                    const diff = difficultyLabel(ch.difficulty);
                    return (
                        <Link to={`/chapters/${ch.id}`} key={ch.id} style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr auto',
                                gap: 'var(--space-6)',
                                alignItems: 'center',
                            }}>
                                {/* Icon */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: `${ch.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    flexShrink: 0,
                                }}>
                                    {ch.icon}
                                </div>

                                {/* Content */}
                                <div style={{ minWidth: 0 }}>
                                    <div className="flex items-center gap-3 mb-2" style={{ flexWrap: 'wrap' }}>
                                        <span className="badge" style={{
                                            background: `${ch.color}20`,
                                            color: ch.color,
                                            borderColor: `${ch.color}40`,
                                        }}>{ch.number}</span>
                                        <span className="badge" style={{
                                            background: `${diff.color}15`,
                                            color: diff.color,
                                            borderColor: `${diff.color}30`,
                                        }}>{diff.text}</span>
                                        <span className="text-xs text-muted">⏱ {ch.studyHours}学时</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 700,
                                        marginBottom: 'var(--space-2)',
                                        color: 'var(--color-text-primary)',
                                    }}>{ch.title}</h3>
                                    <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                                        {ch.summary}
                                    </p>
                                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                        {ch.concepts.slice(0, 4).map(c => (
                                            <span key={c.name} className="badge">{c.name}</span>
                                        ))}
                                        {ch.concepts.length > 4 && (
                                            <span className="badge">+{ch.concepts.length - 4}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Progress */}
                                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                    {chProgress?.completed ? (
                                        <div style={{ color: 'var(--color-accent-green)', fontSize: '2rem' }}>✓</div>
                                    ) : chProgress?.visited ? (
                                        <div style={{ color: ch.color }}>
                                            <div style={{ fontSize: '1.5rem' }}>📖</div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>学习中</div>
                                        </div>
                                    ) : (
                                        <div style={{ color: 'var(--color-text-muted)' }}>
                                            <div style={{ fontSize: '1.5rem' }}>○</div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>未开始</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
