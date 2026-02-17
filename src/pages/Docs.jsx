import { Link } from 'react-router-dom';
import chapters from '../data/chapters';

export default function Docs() {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📖 系统文档</h1>
                <p>家畜育种学（第二版）配套智能教辅系统 — 使用指南与参考资料</p>
            </div>

            {/* Quick Start */}
            <div className="glass-card-static mb-8 animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    🚀 快速入门
                </h2>
                <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
                    <div className="docs-step-card">
                        <div className="docs-step-number">1</div>
                        <h4>章节学习</h4>
                        <p className="text-sm text-muted">
                            从<Link to="/chapters">课程章节</Link>开始，按顺序学习11章核心内容。
                            每章包含概念解析、公式推导、学习目标和真实案例。
                        </p>
                    </div>
                    <div className="docs-step-card">
                        <div className="docs-step-number">2</div>
                        <h4>测验巩固</h4>
                        <p className="text-sm text-muted">
                            通过<Link to="/quiz">测验练习</Link>检验理解。
                            题库涵盖选择题、判断题、计算题共40+题，覆盖全部11章。
                        </p>
                    </div>
                    <div className="docs-step-card">
                        <div className="docs-step-number">3</div>
                        <h4>虚拟实验</h4>
                        <p className="text-sm text-muted">
                            进入4个<Link to="/labs/genetic-params">虚拟实验室</Link>，
                            通过交互式仿真加深对遗传参数、BLUP、育种模拟和基因组选择的理解。
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Overview */}
            <div className="glass-card-static mb-8 animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    ✨ 功能概览
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="docs-feature-row">
                        <div className="docs-feature-icon" style={{ background: 'rgba(99,179,237,0.1)' }}>📚</div>
                        <div>
                            <h4>章节学习中心</h4>
                            <p className="text-sm text-muted">
                                覆盖《家畜育种学（第二版）》全部11章内容，包括绪论、起源与品种、遗传规律、
                                性能测定、选择原理、遗传评定（BLUP）、选配、品种培育、杂种优势、遗传资源保护和生物技术应用。
                                每章提供核心概念解析、数学公式推导、学习目标清单和实际案例研究。
                            </p>
                        </div>
                    </div>
                    <div className="docs-feature-row">
                        <div className="docs-feature-icon" style={{ background: 'rgba(183,148,246,0.1)' }}>🧪</div>
                        <div>
                            <h4>虚拟实验室</h4>
                            <p className="text-sm text-muted">
                                四个交互式实验室提供动手实践体验：
                            </p>
                            <ul className="text-sm text-muted" style={{ paddingLeft: 'var(--space-6)', marginTop: 'var(--space-2)', listStyle: 'disc' }}>
                                <li><strong>数量遗传可视化沙盒</strong> — 实时调节方差组分，观察遗传力变化</li>
                                <li><strong>A矩阵与MME解算室</strong> — 从系谱构建A矩阵，分步求解BLUP</li>
                                <li><strong>育种总监世代沙盘</strong> — Monte Carlo仿真比较交配策略</li>
                                <li><strong>基因组选择展厅</strong> — 比较A矩阵与G矩阵，探索VanRaden方法</li>
                            </ul>
                        </div>
                    </div>
                    <div className="docs-feature-row">
                        <div className="docs-feature-icon" style={{ background: 'rgba(104,211,145,0.1)' }}>📝</div>
                        <div>
                            <h4>测验与评估</h4>
                            <p className="text-sm text-muted">
                                题库含40+道精选题目：选择题、判断题、计算题三种类型，覆盖全部11章内容。
                                支持按章节筛选、练习模式与考试模式；每题附有详细解析和常见误区提示。
                            </p>
                        </div>
                    </div>
                    <div className="docs-feature-row">
                        <div className="docs-feature-icon" style={{ background: 'rgba(246,173,85,0.1)' }}>📊</div>
                        <div>
                            <h4>学习分析</h4>
                            <p className="text-sm text-muted">
                                数据驱动的学习分析仪表盘：跟踪章节完成度、测验准确率趋势、
                                各章知识雷达图和学习时间统计。所有数据本地存储，保护隐私。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Textbook Info */}
            <div className="glass-card-static mb-8 animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    📕 教材简介
                </h2>
                <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
                    <div>
                        <div style={{
                            padding: 'var(--space-6)',
                            background: 'rgba(99,179,237,0.05)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(99,179,237,0.1)',
                        }}>
                            <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 700 }}>
                                《家畜育种学》（第二版）
                            </h3>
                            <div className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                <div className="flex justify-between">
                                    <span className="text-muted">主编</span>
                                    <span>张沅</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">出版社</span>
                                    <span>中国农业出版社</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">适用范围</span>
                                    <span>高等院校动物科学专业</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">总章节</span>
                                    <span>{chapters.length}章（含绪论）</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">建议学时</span>
                                    <span>{chapters.reduce((sum, c) => sum + c.studyHours, 0)}学时</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted" style={{ lineHeight: 1.8 }}>
                            本书是国内最权威的动物育种学教材之一，系统介绍了家畜育种的遗传学基础、
                            性状遗传分析、多种选择方法、遗传评定原理（BLUP）、交配制度设计、
                            品种培育与杂种优势利用、遗传资源保护以及基因组选择等前沿生物技术在育种中的应用。
                        </p>
                        <p className="text-muted mt-4" style={{ lineHeight: 1.8 }}>
                            第二版在保持经典理论体系的基础上，增加了大量分子育种和基因组选择的新进展内容，
                            是动物科学及相关专业本科生和研究生的核心参考书。
                        </p>
                    </div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="glass-card-static mb-8 animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    🛠️ 技术架构
                </h2>
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <div>
                        <h4 style={{ marginBottom: 'var(--space-3)', fontWeight: 700 }}>前端技术栈</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {[
                                { name: 'React 18', desc: '声明式组件化UI框架' },
                                { name: 'React Router v6', desc: '客户端路由与导航' },
                                { name: 'Vite 6', desc: '次世代构建工具，极速热更新' },
                                { name: 'ECharts', desc: '强大的数据可视化引擎' },
                                { name: 'KaTeX', desc: '数学公式渲染引擎' },
                                { name: 'ml-matrix', desc: '矩阵运算库（A/G矩阵计算）' },
                            ].map(t => (
                                <div key={t.name} className="flex justify-between items-center" style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    background: 'var(--color-bg-glass)',
                                    borderRadius: 'var(--radius-sm)',
                                }}>
                                    <span className="font-mono text-sm" style={{ color: 'var(--color-accent-cyan)' }}>{t.name}</span>
                                    <span className="text-xs text-muted">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: 'var(--space-3)', fontWeight: 700 }}>核心算法</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {[
                                { name: 'Henderson法', desc: 'A矩阵递推构建' },
                                { name: 'MME求解器', desc: 'BLUP动物模型方程组求解' },
                                { name: 'VanRaden法1', desc: 'G矩阵（基因组关系矩阵）构建' },
                                { name: 'Monte Carlo', desc: '育种方案蒙特卡洛仿真' },
                                { name: 'SM-2算法', desc: '间隔重复学习算法' },
                            ].map(t => (
                                <div key={t.name} className="flex justify-between items-center" style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    background: 'var(--color-bg-glass)',
                                    borderRadius: 'var(--radius-sm)',
                                }}>
                                    <span className="font-mono text-sm" style={{ color: 'var(--color-accent-purple)' }}>{t.name}</span>
                                    <span className="text-xs text-muted">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* References */}
            <div className="glass-card-static mb-8 animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    📚 参考文献
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                        { authors: '张沅 主编', title: '《家畜育种学》（第二版）', publisher: '中国农业出版社' },
                        { authors: 'Henderson, C.R.', title: 'Best Linear Unbiased Estimation and Prediction under a Selection Model', publisher: 'Biometrics, 1975' },
                        { authors: 'VanRaden, P.M.', title: 'Efficient Methods to Compute Genomic Predictions', publisher: 'Journal of Dairy Science, 2008' },
                        { authors: 'Meuwissen, T.H.E. et al.', title: 'Prediction of Total Genetic Value Using Genome-Wide Dense Marker Maps', publisher: 'Genetics, 2001' },
                        { authors: 'Falconer, D.S. & Mackay, T.F.C.', title: 'Introduction to Quantitative Genetics (4th ed.)', publisher: 'Longman, 1996' },
                        { authors: 'Lynch, M. & Walsh, B.', title: 'Genetics and Analysis of Quantitative Traits', publisher: 'Sinauer Associates, 1998' },
                        { authors: 'Mrode, R.A.', title: 'Linear Models for the Prediction of Animal Breeding Values (3rd ed.)', publisher: 'CABI, 2014' },
                    ].map((ref, i) => (
                        <div key={i} style={{
                            padding: 'var(--space-3) var(--space-4)',
                            borderLeft: '3px solid var(--color-accent-blue)',
                            background: 'var(--color-bg-glass)',
                            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                        }}>
                            <div className="text-sm">
                                <strong>{ref.authors}</strong>{' '}
                                <em>{ref.title}</em>.{' '}
                                <span className="text-muted">{ref.publisher}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact / About */}
            <div className="glass-card-static animate-fade-in-up">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    ℹ️ 关于系统
                </h2>
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <div>
                        <p className="text-muted" style={{ lineHeight: 1.8 }}>
                            本系统为《家畜育种学》（第二版）配套智能教辅系统，旨在通过交互式可视化和虚拟实验，
                            帮助学生深入理解动物育种的核心原理。系统集成了遗传数据分析、矩阵运算和蒙特卡洛仿真等算法，
                            提供沉浸式的学习体验。
                        </p>
                    </div>
                    <div style={{
                        padding: 'var(--space-6)',
                        background: 'rgba(104,211,145,0.05)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(104,211,145,0.1)',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">系统版本</span>
                                <span className="font-mono">v2.0.0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">适配院校</span>
                                <span>河套学院</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">技术支持</span>
                                <span>动物科学系</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">更新日期</span>
                                <span className="font-mono">2026-02</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
