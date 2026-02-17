import { Link } from 'react-router-dom';
import { loadProgress, getQuizStats } from '../utils/progress';
import chapters from '../data/chapters';

const labCards = [
    {
        icon: '🧬', title: '数量遗传可视化沙盒', path: '/lab/genetic-params',
        gradient: 'linear-gradient(135deg, #2b6cb0 0%, #63b3ed 100%)',
        desc: '拖动滑块控制VA/VD/VE，实时观察遗传力与方差组成的变化，直觉理解数量遗传基础参数。',
        tags: ['第3-4章', 'h²可视化', '互动'],
    },
    {
        icon: '🔬', title: 'A矩阵与MME解算室', path: '/lab/pedigree-mme',
        gradient: 'linear-gradient(135deg, #6b46c1 0%, #b794f6 100%)',
        desc: '从微型系谱构建亲缘关系矩阵，逐步推演混合模型方程组(MME)，求解BLUP育种值。',
        tags: ['第5章', '核心难点', 'BLUP'],
    },
    {
        icon: '🎯', title: '育种总监世代沙盘', path: '/lab/breeding-sim',
        gradient: 'linear-gradient(135deg, #276749 0%, #68d391 100%)',
        desc: 'Monte Carlo仿真育种方案：调控选择强度、世代间隔与交配策略，观察遗传进展与近交风险。',
        tags: ['第6-9章', '仿真', '决策'],
    },
    {
        icon: '🧪', title: '基因组选择展厅', path: '/lab/genomic-selection',
        gradient: 'linear-gradient(135deg, #c05621 0%, #f6ad55 100%)',
        desc: '对比传统BLUP与GBLUP，理解G矩阵替代A矩阵的直觉意义，探索基因组时代育种革命。',
        tags: ['第10章', '前沿', 'GBLUP'],
    },
];

export default function Home() {
    const progress = loadProgress();
    const stats = getQuizStats();
    const visitedChapters = Object.keys(progress.chapterProgress).length;

    return (
        <div>
            {/* Hero Section */}
            <section className="hero" style={{ position: 'relative' }}>
                {/* Particle Orbs */}
                <div className="hero-particles">
                    <div className="hero-orb" />
                    <div className="hero-orb" />
                    <div className="hero-orb" />
                    <div className="hero-orb" />
                </div>
                <div className="hero-content animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="hero-badge">
                        <span>🎓</span>
                        <span>国际顶级教辅资源 · 河套学院</span>
                    </div>
                    <h1>家畜育种学</h1>
                    <p>
                        张沅教授主编《家畜育种学（第二版）》配套智能教辅系统<br />
                        四大虚拟实验室 · BLUP/MME交互推演 · 智能题库与间隔复习
                    </p>
                    <div className="hero-actions">
                        <Link to="/chapters" className="btn btn-primary btn-lg">
                            📚 开始学习
                        </Link>
                        <Link to="/lab/pedigree-mme" className="btn btn-accent btn-lg">
                            🔬 进入实验室
                        </Link>
                    </div>
                </div>
            </section>

            <div className="page-container">
                {/* Stats */}
                <section className="stats-grid mb-8 stagger-children" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
                    <div className="glass-card-static stat-card">
                        <div className="stat-number">11</div>
                        <div className="stat-label">章节内容</div>
                    </div>
                    <div className="glass-card-static stat-card">
                        <div className="stat-number">4</div>
                        <div className="stat-label">虚拟实验室</div>
                    </div>
                    <div className="glass-card-static stat-card">
                        <div className="stat-number" style={{ background: 'var(--gradient-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {stats.total || '∞'}
                        </div>
                        <div className="stat-label">{stats.total > 0 ? `答题 (${(stats.rate * 100).toFixed(0)}%正确)` : '精选题库'}</div>
                    </div>
                    <div className="glass-card-static stat-card">
                        <div className="stat-number" style={{ background: 'var(--gradient-green)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {visitedChapters}
                        </div>
                        <div className="stat-label">已学章节</div>
                    </div>
                </section>

                {/* Virtual Labs */}
                <section className="mb-8">
                    <div className="page-header">
                        <h1>🧪 四大虚拟实验室</h1>
                        <p>交互式计算实验，将抽象理论转化为可操作、可验证的学习体验</p>
                    </div>
                    <div className="feature-grid stagger-children">
                        {labCards.map((lab) => (
                            <Link to={lab.path} key={lab.path} style={{ textDecoration: 'none' }}>
                                <div className="glass-card feature-card" style={{ height: '100%' }}>
                                    <div className="feature-card-icon" style={{ background: lab.gradient }}>
                                        {lab.icon}
                                    </div>
                                    <h3>{lab.title}</h3>
                                    <p>{lab.desc}</p>
                                    <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                                        {lab.tags.map(tag => (
                                            <span key={tag} className="badge badge-blue">{tag}</span>
                                        ))}
                                    </div>
                                    <span className="feature-arrow">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Chapter Overview */}
                <section className="mb-8">
                    <div className="page-header">
                        <h1>📖 课程章节</h1>
                        <p>覆盖绪论至第十章全部内容，从起源驯化到基因组选择</p>
                    </div>
                    <div className="grid-3 stagger-children">
                        {chapters.map((ch) => {
                            const chProgress = progress.chapterProgress[ch.id];
                            return (
                                <Link to={`/chapters/${ch.id}`} key={ch.id} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card chapter-card" style={{ height: '100%' }}>
                                        <span className="chapter-number" style={{ color: ch.color }}>{ch.number}</span>
                                        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{ch.icon}</div>
                                        <h3>{ch.title}</h3>
                                        <div className="chapter-concepts">
                                            {ch.concepts.slice(0, 3).map(c => (
                                                <span key={c.name} className="badge">{c.name}</span>
                                            ))}
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{
                                                width: chProgress?.completed ? '100%' : chProgress?.visited ? '40%' : '0%',
                                                background: ch.color
                                            }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mb-8">
                    <div className="glass-card-static" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚀</div>
                        <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                            准备好开始学习了吗？
                        </h2>
                        <p className="text-muted mb-6">
                            建议学习路径：先阅读章节概念卡 → 在实验室动手操作 → 通过题库检验掌握程度
                        </p>
                        <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                            <Link to="/chapters/4" className="btn btn-primary">第四章：选择原理</Link>
                            <Link to="/chapters/5" className="btn btn-accent">★ 第五章：遗传评定</Link>
                            <Link to="/quiz" className="btn btn-secondary">📝 题库练习</Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="global-footer">
                    <div className="footer-links">
                        <Link to="/chapters">📚 章节学习</Link>
                        <Link to="/quiz">✏️ 题库练习</Link>
                        <Link to="/analytics">📊 学习分析</Link>
                        <Link to="/docs">📖 系统文档</Link>
                    </div>
                    <p>《家畜育种学（第二版）》配套智能教辅系统 v2.0.0</p>
                    <p style={{ marginTop: '4px' }}>
                        主编：张沅 · 中国农业出版社 · ISBN 9787109247895
                    </p>
                </footer>
            </div>
        </div>
    );
}
