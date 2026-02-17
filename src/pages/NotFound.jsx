import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center animate-fade-in-up" style={{ maxWidth: 520 }}>
                {/* Animated 404 */}
                <div className="not-found-code">404</div>
                <div className="not-found-icon">
                    <span className="not-found-dna">🧬</span>
                </div>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                    页面未找到
                </h2>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)', lineHeight: 1.8, marginBottom: 'var(--space-8)' }}>
                    该页面可能已被移除、重命名，或暂时不可用。<br />
                    请检查链接地址是否正确。
                </p>
                <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary btn-lg">🏠 返回首页</Link>
                    <Link to="/chapters" className="btn btn-secondary btn-lg">📚 开始学习</Link>
                    <Link to="/docs" className="btn btn-ghost btn-lg">📖 查看文档</Link>
                </div>
            </div>
        </div>
    );
}
