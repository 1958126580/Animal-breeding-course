import { useState, useMemo } from 'react';
import { quizBank } from '../data/quizBank';
import chapters from '../data/chapters';
import { addQuizAttempt } from '../utils/progress';

export default function Quiz() {
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [mode, setMode] = useState('practice'); // practice | exam
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);         // for choice: 'A','B','C','D'; for true_false: true/false
    const [numericAnswer, setNumericAnswer] = useState('');  // for numeric
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [showResults, setShowResults] = useState(false);

    const filteredQuizzes = useMemo(() => {
        let quizzes = [...quizBank];
        if (selectedChapter !== 'all') {
            quizzes = quizzes.filter(q => q.chapter === parseInt(selectedChapter));
        }
        if (selectedType !== 'all') {
            quizzes = quizzes.filter(q => q.type === selectedType);
        }
        if (mode === 'exam') {
            // Shuffle
            for (let i = quizzes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [quizzes[i], quizzes[j]] = [quizzes[j], quizzes[i]];
            }
        }
        return quizzes;
    }, [selectedChapter, selectedType, mode]);

    const quiz = filteredQuizzes[currentIndex];

    if (!quiz) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>✏️ 题库练习</h1>
                    <p>暂无符合条件的题目</p>
                </div>
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-10)' }}>
                    <button className="btn btn-primary" onClick={() => { setSelectedChapter('all'); setSelectedType('all'); setCurrentIndex(0); }}>
                        查看全部题目
                    </button>
                </div>
            </div>
        );
    }

    const chapter = chapters.find(c => c.id === quiz.chapter);
    const isChoice = quiz.type === 'choice';
    const isTrueFalse = quiz.type === 'true_false';
    const isNumeric = quiz.type === 'numeric';

    // Check correctness based on question type
    const checkCorrect = () => {
        if (isChoice) return selected === quiz.answer;
        if (isTrueFalse) return selected === quiz.answer;
        if (isNumeric) return Math.abs(parseFloat(numericAnswer || '0') - quiz.answer) <= (quiz.tolerance || 0.01);
        return false;
    };
    const isCorrect = checkCorrect();

    const handleSubmit = () => {
        setSubmitted(true);
        const correct = checkCorrect();
        setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
        addQuizAttempt({
            quizId: quiz.id,
            chapterId: quiz.chapter,
            answer: isChoice ? selected : isTrueFalse ? selected : parseFloat(numericAnswer),
            correct,
        });
    };

    const handleNext = () => {
        if (currentIndex >= filteredQuizzes.length - 1) {
            setShowResults(true);
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setNumericAnswer('');
        setSubmitted(false);
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setSelected(null);
        setNumericAnswer('');
        setSubmitted(false);
        setScore({ correct: 0, total: 0 });
        setShowResults(false);
    };

    // Determine if submit button should be enabled
    const canSubmit = isChoice ? selected !== null : isTrueFalse ? selected !== null : !!numericAnswer;

    // Difficulty display
    const difficultyStars = '★'.repeat(quiz.difficulty) + '☆'.repeat(Math.max(0, 5 - quiz.difficulty));
    const difficultyColor = quiz.difficulty >= 4 ? 'var(--color-accent-red)' : quiz.difficulty >= 3 ? 'var(--color-accent-orange)' : 'var(--color-accent-green)';
    const typeLabel = isChoice ? '选择题' : isTrueFalse ? '判断题' : '计算题';
    const typeIcon = isChoice ? '📝' : isTrueFalse ? '✅' : '🔢';

    if (showResults) {
        const rate = score.total > 0 ? (score.correct / score.total * 100) : 0;
        return (
            <div className="page-container">
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-16)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                        {rate >= 80 ? '🏆' : rate >= 60 ? '👍' : '💪'}
                    </div>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>练习完成！</h2>
                    <div style={{
                        fontSize: 'var(--font-size-4xl)', fontWeight: 900,
                        background: rate >= 80 ? 'var(--gradient-green)' : rate >= 60 ? 'var(--gradient-blue)' : 'var(--gradient-orange)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        marginBottom: 'var(--space-4)',
                    }}>
                        {score.correct} / {score.total}
                    </div>
                    <p className="text-muted mb-6">正确率 {rate.toFixed(1)}%</p>
                    <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={handleReset}>重新练习</button>
                        <button className="btn btn-secondary" onClick={() => {
                            setSelectedChapter('all');
                            setSelectedType('all');
                            handleReset();
                        }}>全部题目</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ 题库练习</h1>
                <p>覆盖全部11章 — 选择题、判断题、计算题 共{quizBank.length}题</p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 items-center" style={{ flexWrap: 'wrap' }}>
                <select
                    className="quiz-select"
                    value={selectedChapter}
                    onChange={e => { setSelectedChapter(e.target.value); setCurrentIndex(0); setSubmitted(false); setSelected(null); setNumericAnswer(''); }}
                >
                    <option value="all">全部章节</option>
                    {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.number} {ch.title}</option>
                    ))}
                </select>
                <select
                    className="quiz-select"
                    value={selectedType}
                    onChange={e => { setSelectedType(e.target.value); setCurrentIndex(0); setSubmitted(false); setSelected(null); setNumericAnswer(''); }}
                >
                    <option value="all">全部题型</option>
                    <option value="choice">📝 选择题</option>
                    <option value="true_false">✅ 判断题</option>
                    <option value="numeric">🔢 计算题</option>
                </select>
                <div className="flex gap-2">
                    <button className={`btn btn-sm ${mode === 'practice' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { setMode('practice'); handleReset(); }}>练习模式</button>
                    <button className={`btn btn-sm ${mode === 'exam' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { setMode('exam'); handleReset(); }}>考试模式</button>
                </div>
                <span className="text-sm text-muted">
                    共 {filteredQuizzes.length} 题 | 已答 {score.total} 题 | 正确 {score.correct}
                </span>
            </div>

            {/* Progress */}
            <div className="progress-bar mb-6">
                <div className="progress-fill" style={{ width: `${((currentIndex + 1) / filteredQuizzes.length) * 100}%` }} />
            </div>

            {/* Quiz Card */}
            <div className="glass-card-static mb-6">
                <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div className="flex items-center gap-3">
                        <span className="badge badge-blue">{currentIndex + 1}/{filteredQuizzes.length}</span>
                        {chapter && <span className="badge" style={{ background: `${chapter.color}20`, color: chapter.color }}>{chapter.number}</span>}
                        <span className="badge" style={{
                            background: isChoice ? 'rgba(99,179,237,0.12)' : isTrueFalse ? 'rgba(104,211,145,0.12)' : 'rgba(246,173,85,0.12)',
                            color: isChoice ? 'var(--color-accent-blue)' : isTrueFalse ? 'var(--color-accent-green)' : 'var(--color-accent-orange)',
                        }}>{typeIcon} {typeLabel}</span>
                        <span className="badge" style={{ color: difficultyColor, fontFamily: 'monospace' }}>{difficultyStars}</span>
                    </div>
                    <div className="flex gap-2">
                        {quiz.tags && quiz.tags.map(tag => (
                            <span key={tag} className="badge">{tag}</span>
                        ))}
                    </div>
                </div>

                <h3 style={{ fontSize: 'var(--font-size-lg)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                    {quiz.stem}
                </h3>

                {/* Choice questions */}
                {isChoice && (
                    <div>
                        {quiz.options.map((opt, i) => {
                            const letter = String.fromCharCode(65 + i); // A, B, C, D
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

                {/* True / False */}
                {isTrueFalse && (
                    <div className="flex gap-4">
                        {[
                            { value: true, label: '✅ 正确', icon: '✓' },
                            { value: false, label: '❌ 错误', icon: '✗' },
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

                {/* Numeric */}
                {isNumeric && (
                    <div className="flex items-center gap-4">
                        <input
                            type="number" step="any" value={numericAnswer}
                            onChange={e => setNumericAnswer(e.target.value)}
                            disabled={submitted}
                            placeholder="输入数值答案..."
                            style={{ width: '250px', fontSize: 'var(--font-size-lg)' }}
                        />
                        {quiz.unit && <span className="text-muted text-lg">{quiz.unit}</span>}
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
                <div className="glass-card-static mb-6 animate-fade-in" style={{
                    borderLeft: `3px solid ${isCorrect ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}`
                }}>
                    <div className="flex items-center gap-3 mb-3">
                        <span style={{ fontSize: '1.8rem' }}>{isCorrect ? '✅' : '❌'}</span>
                        <strong style={{
                            fontSize: 'var(--font-size-lg)',
                            color: isCorrect ? 'var(--color-accent-green)' : 'var(--color-accent-red)'
                        }}>
                            {isCorrect ? '回答正确！' : '回答错误'}
                        </strong>
                    </div>
                    <p style={{ lineHeight: 1.8 }}>{quiz.explanation}</p>

                    {quiz.steps && (
                        <div className="mt-4" style={{
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-glass)',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <h4 className="font-bold mb-3">📝 详细解题步骤：</h4>
                            {quiz.steps.map((step, i) => (
                                <div key={i} className="text-sm" style={{
                                    padding: 'var(--space-2) 0',
                                    borderBottom: i < quiz.steps.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    color: 'var(--color-text-secondary)',
                                }}>{step}</div>
                            ))}
                        </div>
                    )}

                    {quiz.misconceptions && (
                        <div className="mt-4">
                            <h4 className="text-sm font-bold mb-2">⚠️ 常见错因：</h4>
                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                {quiz.misconceptions.map((m, i) => (
                                    <span key={i} className="badge badge-orange">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                {!submitted ? (
                    <button className="btn btn-primary btn-lg"
                        onClick={handleSubmit}
                        disabled={!canSubmit}>
                        提交答案
                    </button>
                ) : (
                    <button className="btn btn-accent btn-lg" onClick={handleNext}>
                        {currentIndex < filteredQuizzes.length - 1 ? '下一题 →' : '查看结果 →'}
                    </button>
                )}
            </div>
        </div>
    );
}
