import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import chapters from '../data/chapters';
import { quizBank } from '../data/quizBank';
import { Formula } from '../utils/katex';
import { updateChapterProgress } from '../utils/progress';

export default function ChapterDetail() {
    const { id } = useParams();
    const chapterId = parseInt(id);
    const chapter = chapters.find(c => c.id === chapterId);
    const [activeTab, setActiveTab] = useState('concepts');

    useEffect(() => {
        if (chapter) {
            updateChapterProgress(chapterId, { visited: true });
        }
    }, [chapterId]);

    if (!chapter) {
        return (
            <div className="page-container">
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-16)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📭</div>
                    <h2>章节未找到</h2>
                    <Link to="/chapters" className="btn btn-primary mt-4">返回章节列表</Link>
                </div>
            </div>
        );
    }

    const chapterQuizzes = quizBank.filter(q => q.chapter === chapterId);
    const tabs = [
        { key: 'concepts', label: '核心概念', icon: '💡' },
        { key: 'objectives', label: '学习目标', icon: '🎯' },
        { key: 'formulas', label: '关键公式', icon: '📐' },
        { key: 'casestudy', label: '案例研究', icon: '📋' },
        { key: 'quiz', label: `章节测验 (${chapterQuizzes.length})`, icon: '✏️' },
        { key: 'prereq', label: '先修知识', icon: '🔗' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <Link to="/chapters" className="btn btn-ghost mb-4" style={{ display: 'inline-flex' }}>
                    ← 返回章节列表
                </Link>
                <div className="flex items-center gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: 'var(--radius-lg)',
                        background: `${chapter.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', flexShrink: 0,
                    }}>{chapter.icon}</div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge" style={{
                                background: `${chapter.color}20`, color: chapter.color, borderColor: `${chapter.color}40`
                            }}>{chapter.number}</span>
                            <span className="badge badge-blue">⏱ {chapter.studyHours}学时</span>
                            <span className="badge" style={{
                                background: chapter.difficulty >= 4 ? 'rgba(252,129,129,0.12)' : chapter.difficulty >= 3 ? 'rgba(246,173,85,0.12)' : 'rgba(104,211,145,0.12)',
                                color: chapter.difficulty >= 4 ? 'var(--color-accent-red)' : chapter.difficulty >= 3 ? 'var(--color-accent-orange)' : 'var(--color-accent-green)',
                            }}>{'★'.repeat(chapter.difficulty)}{'☆'.repeat(5 - chapter.difficulty)}</span>
                        </div>
                        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                            {chapter.title}
                        </h1>
                    </div>
                </div>
                <p className="text-muted">{chapter.summary}</p>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in" key={activeTab}>
                {activeTab === 'concepts' && <ConceptsTab chapter={chapter} />}
                {activeTab === 'objectives' && <ObjectivesTab chapter={chapter} />}
                {activeTab === 'formulas' && <FormulasTab chapter={chapter} />}
                {activeTab === 'casestudy' && <CaseStudyTab chapter={chapter} />}
                {activeTab === 'quiz' && <QuizTab quizzes={chapterQuizzes} chapterId={chapterId} />}
                {activeTab === 'prereq' && <PrereqTab chapter={chapter} />}
            </div>
        </div>
    );
}

function ConceptsTab({ chapter }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {chapter.concepts.map((concept, i) => (
                <div
                    key={i}
                    className="glass-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div style={{
                                width: '36px', height: '36px',
                                borderRadius: 'var(--radius-md)',
                                background: `${chapter.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 'var(--font-size-sm)', color: chapter.color,
                            }}>{i + 1}</div>
                            <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{concept.name}</h3>
                        </div>
                        <span style={{
                            transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)', fontSize: '1.2rem', color: 'var(--color-text-tertiary)'
                        }}>▼</span>
                    </div>
                    {expanded === i && (
                        <div style={{
                            marginTop: 'var(--space-4)',
                            paddingTop: 'var(--space-4)',
                            borderTop: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.8,
                        }}>
                            {concept.desc}
                        </div>
                    )}
                </div>
            ))}
            {chapter.concepts.length === 0 && (
                <div className="glass-card-static text-center text-muted" style={{ padding: 'var(--space-10)' }}>
                    本章概念正在整理中...
                </div>
            )}
        </div>
    );
}

function ObjectivesTab({ chapter }) {
    const objectives = chapter.learningObjectives || [];
    if (objectives.length === 0) {
        return (
            <div className="glass-card-static text-center text-muted" style={{ padding: 'var(--space-10)' }}>
                本章学习目标正在整理中...
            </div>
        );
    }
    return (
        <div className="glass-card-static">
            <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 700, fontSize: 'var(--font-size-xl)' }}>
                🎯 学完本章后，你应当能够：
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3" style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--color-bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                    }}>
                        <span style={{
                            width: '28px', height: '28px', flexShrink: 0,
                            borderRadius: '50%',
                            background: `${chapter.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 'var(--font-size-xs)', fontWeight: 700, color: chapter.color,
                        }}>{i + 1}</span>
                        <span style={{ lineHeight: 1.8, paddingTop: '2px' }}>{obj}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CaseStudyTab({ chapter }) {
    const cs = chapter.caseStudy;
    if (!cs) {
        return (
            <div className="glass-card-static text-center text-muted" style={{ padding: 'var(--space-10)' }}>
                本章案例正在整理中...
            </div>
        );
    }
    return (
        <div className="glass-card-static">
            <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)',
            }}>
                <div style={{
                    width: '48px', height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: `${chapter.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                }}>📋</div>
                <h3 style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)' }}>{cs.title}</h3>
            </div>
            <div style={{
                padding: 'var(--space-6)',
                background: 'var(--color-bg-glass)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--space-4)',
            }}>
                <p style={{ lineHeight: 1.9, color: 'var(--color-text-secondary)' }}>
                    {cs.description}
                </p>
            </div>
            <div style={{
                padding: 'var(--space-4) var(--space-6)',
                background: `${chapter.color}08`,
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${chapter.color}`,
            }}>
                <strong style={{ color: chapter.color }}>💡 核心启示：</strong>
                <span style={{ lineHeight: 1.8, marginLeft: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
                    {cs.insight}
                </span>
            </div>
        </div>
    );
}

function FormulasTab({ chapter }) {
    if (chapter.formulas.length === 0) {
        return (
            <div className="glass-card-static text-center text-muted" style={{ padding: 'var(--space-10)' }}>
                本章暂无核心公式（概念性章节）
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {chapter.formulas.map((f, i) => (
                <div key={i} className="glass-card-static">
                    <div className="formula-name">{f.name}</div>
                    <div className="formula-block">
                        <Formula latex={f.latex} display={true} />
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: 'var(--space-3)' }}>{f.desc}</p>
                </div>
            ))}
        </div>
    );
}

function QuizTab({ quizzes, chapterId }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [numericAnswer, setNumericAnswer] = useState('');

    if (quizzes.length === 0) {
        return (
            <div className="glass-card-static text-center" style={{ padding: 'var(--space-10)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📝</div>
                <p className="text-muted">本章测验题目正在建设中</p>
                <Link to="/quiz" className="btn btn-primary mt-4">前往综合题库</Link>
            </div>
        );
    }

    const quiz = quizzes[current];
    const isChoice = quiz.type === 'choice';
    const isTrueFalse = quiz.type === 'true_false';
    const isNumeric = quiz.type === 'numeric';

    const checkCorrect = () => {
        if (isChoice) return selected === quiz.answer;
        if (isTrueFalse) return selected === quiz.answer;
        if (isNumeric) return Math.abs(parseFloat(numericAnswer || '0') - quiz.answer) <= (quiz.tolerance || 0.01);
        return false;
    };
    const isCorrect = checkCorrect();
    const canSubmit = isChoice ? selected !== null : isTrueFalse ? selected !== null : !!numericAnswer;

    const difficultyStars = '★'.repeat(quiz.difficulty) + '☆'.repeat(Math.max(0, 5 - quiz.difficulty));
    const typeLabel = isChoice ? '选择题' : isTrueFalse ? '判断题' : '计算题';

    const handleSubmit = () => setSubmitted(true);

    const handleNext = () => {
        setCurrent((current + 1) % quizzes.length);
        setSelected(null);
        setSubmitted(false);
        setNumericAnswer('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted">题目 {current + 1} / {quizzes.length}</span>
                <div className="flex gap-2">
                    <span className="badge">{typeLabel}</span>
                    <span className="badge" style={{ fontFamily: 'monospace' }}>{difficultyStars}</span>
                </div>
            </div>

            <div className="glass-card-static mb-4">
                <h3 style={{ marginBottom: 'var(--space-4)', lineHeight: 1.8 }}>{quiz.stem}</h3>

                {isChoice && (
                    <div>
                        {quiz.options.map((opt, i) => {
                            const letter = String.fromCharCode(65 + i);
                            return (
                                <div
                                    key={i}
                                    className={`quiz-option ${selected === letter ? 'selected' : ''} ${submitted && letter === quiz.answer ? 'correct' : ''} ${submitted && selected === letter && letter !== quiz.answer ? 'incorrect' : ''}`}
                                    onClick={() => !submitted && setSelected(letter)}
                                >
                                    <div className="quiz-radio" />
                                    <span>{opt}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isTrueFalse && (
                    <div className="flex gap-4">
                        {[
                            { value: true, label: '✅ 正确' },
                            { value: false, label: '❌ 错误' },
                        ].map(opt => (
                            <div
                                key={String(opt.value)}
                                className={`quiz-option quiz-tf-option ${selected === opt.value ? 'selected' : ''} ${submitted && opt.value === quiz.answer ? 'correct' : ''} ${submitted && selected === opt.value && opt.value !== quiz.answer ? 'incorrect' : ''}`}
                                onClick={() => !submitted && setSelected(opt.value)}
                                style={{ flex: 1, textAlign: 'center', justifyContent: 'center', fontSize: 'var(--font-size-lg)', fontWeight: 700 }}
                            >
                                <span>{opt.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {isNumeric && (
                    <div className="flex items-center gap-3">
                        <input
                            type="number" step="any" value={numericAnswer}
                            onChange={e => setNumericAnswer(e.target.value)}
                            disabled={submitted}
                            placeholder="输入数值..."
                            style={{ width: '200px' }}
                        />
                        {quiz.unit && <span className="text-muted">{quiz.unit}</span>}
                        {submitted && (
                            <span className="text-sm text-muted">
                                正确答案: <strong style={{ color: 'var(--color-accent-green)' }}>{quiz.answer}</strong>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Feedback */}
            {submitted && (
                <div className="glass-card-static mb-4 animate-fade-in" style={{
                    borderLeft: `3px solid ${isCorrect ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}`
                }}>
                    <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: '1.5rem' }}>{isCorrect ? '✅' : '❌'}</span>
                        <strong style={{ color: isCorrect ? 'var(--color-accent-green)' : 'var(--color-accent-red)' }}>
                            {isCorrect ? '回答正确！' : '回答错误'}
                        </strong>
                    </div>
                    <p className="text-sm" style={{ lineHeight: 1.8 }}>{quiz.explanation}</p>
                    {quiz.misconceptions && !isCorrect && (
                        <div className="mt-4">
                            <div className="text-xs font-bold text-muted mb-1">⚠️ 常见错因：</div>
                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                {quiz.misconceptions.map((m, i) => (
                                    <span key={i} className="badge badge-orange">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-3">
                {!submitted ? (
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >提交答案</button>
                ) : (
                    <button className="btn btn-accent" onClick={handleNext}>
                        {current < quizzes.length - 1 ? '下一题 →' : '重新开始'}
                    </button>
                )}
            </div>
        </div>
    );
}

function PrereqTab({ chapter }) {
    return (
        <div className="glass-card-static">
            <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 700 }}>📋 先修知识要求</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {chapter.prerequisites.map((prereq, i) => (
                    <div key={i} className="flex items-center gap-3" style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--color-bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                    }}>
                        <span style={{
                            width: '28px', height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(99,179,237,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-accent-blue)',
                        }}>{i + 1}</span>
                        <span>{prereq}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
