import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
    {
        section: '学习中心', items: [
            { path: '/', icon: '🏠', label: '首页概览' },
            { path: '/chapters', icon: '📚', label: '章节学习' },
            { path: '/quiz', icon: '✏️', label: '题库练习' },
            { path: '/analytics', icon: '📊', label: '学习分析' },
            { path: '/docs', icon: '📖', label: '系统文档' },
        ]
    },
    {
        section: '虚拟实验室', items: [
            { path: '/lab/genetic-params', icon: '🧬', label: '数量遗传沙盒' },
            { path: '/lab/pedigree-mme', icon: '🔬', label: 'A矩阵/MME解算' },
            { path: '/lab/breeding-sim', icon: '🎯', label: '育种仿真沙盘' },
            { path: '/lab/genomic-selection', icon: '🧪', label: '基因组选择' },
        ]
    },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="app-layout">
            {/* Mobile menu button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="菜单"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar overlay (mobile) */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">🐄</div>
                    <div>
                        <h1>家畜育种学</h1>
                        <span>第二版 · 张沅 主编</span>
                    </div>
                </div>

                <div className="sidebar-nav">
                    {navItems.map((section) => (
                        <div className="sidebar-section" key={section.section}>
                            <div className="sidebar-section-title">{section.section}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{
                    padding: 'var(--space-4) var(--space-6)',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-tertiary)',
                }}>
                    <div style={{ marginBottom: '4px' }}>中国农业出版社 · 2018</div>
                    <div>ISBN: 9787109247895</div>
                    <div style={{ marginTop: '4px', color: 'var(--color-accent-blue)', fontWeight: 600 }}>v2.0.0</div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Scroll to Top */}
            <button
                className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="回到顶部"
            >
                ↑
            </button>
        </div>
    );
}

