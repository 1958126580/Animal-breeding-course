import { useState, useMemo, useCallback } from 'react';
import { buildAMatrix, solveMME, invertAMatrix } from '../../utils/genetics';
import { pedigreeDatasets } from '../../data/chapters';
import { Formula } from '../../utils/katex';

export default function PedigreeMME() {
    const [datasetIdx, setDatasetIdx] = useState(0);
    const [sigmaE2, setSigmaE2] = useState(40);
    const [sigmaA2, setSigmaA2] = useState(20);
    const [currentStep, setCurrentStep] = useState(0);
    const [showFullSolution, setShowFullSolution] = useState(false);

    const dataset = pedigreeDatasets[datasetIdx];
    const pedigree = dataset.pedigree;

    // Build A matrix
    const aResult = useMemo(() => buildAMatrix(pedigree), [pedigree]);

    // Build and solve MME
    const mmeResult = useMemo(() => {
        const phenoAnimals = dataset.phenotypes.filter(p => p.value !== null);
        if (phenoAnimals.length === 0) return null;

        const n = phenoAnimals.length;
        const allIds = aResult.ids;
        const q = allIds.length;

        // Determine fixed effects (herds)
        const herds = [...new Set(phenoAnimals.map(p => p.herd))].sort();
        const p = herds.length;

        const y = phenoAnimals.map(r => r.value);
        const X = phenoAnimals.map(r => herds.map(h => h === r.herd ? 1 : 0));
        const Z = phenoAnimals.map(r => allIds.map(aid => aid === r.animal ? 1 : 0));

        try {
            return solveMME(y, X, Z, aResult.A, sigmaE2, sigmaA2);
        } catch (e) {
            console.error('MME求解错误:', e);
            return null;
        }
    }, [aResult, dataset, sigmaE2, sigmaA2]);

    const totalSteps = aResult.steps.length + (mmeResult ? mmeResult.steps.length : 0);

    const handleStepForward = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handleStepBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🔬 A矩阵与MME解算室</h1>
                <p>★ 第五章核心难点 — 从系谱到育种值的完整推演过程</p>
            </div>

            {/* Dataset Selector */}
            <div className="flex gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
                {pedigreeDatasets.map((ds, i) => (
                    <button
                        key={i}
                        className={`btn ${datasetIdx === i ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { setDatasetIdx(i); setCurrentStep(0); setShowFullSolution(false); }}
                    >
                        {ds.name}
                    </button>
                ))}
            </div>

            <div className="grid-2">
                {/* Left: Pedigree & A Matrix */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Pedigree Visualization */}
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📋 系谱结构</h3>
                        <div style={{
                            display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
                            alignItems: 'center', padding: 'var(--space-4)',
                        }}>
                            {/* Group by generation */}
                            {[...new Set(pedigree.map(p => p.generation))].sort().map(gen => (
                                <div key={gen}>
                                    <div className="text-xs text-muted text-center mb-2">第{gen}世代</div>
                                    <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                                        {pedigree.filter(p => p.generation === gen).map(animal => (
                                            <div key={animal.id} style={{ textAlign: 'center' }}>
                                                <div className={`pedigree-node ${animal.sex === 'M' ? 'male' : 'female'} ${aResult.F[aResult.ids.indexOf(animal.id)] > 0 ? 'inbred' : ''}`}>
                                                    {animal.id}
                                                </div>
                                                <div className="text-xs text-muted mt-1">
                                                    {animal.sex === 'M' ? '♂' : '♀'}
                                                    {aResult.F[aResult.ids.indexOf(animal.id)] > 0 && (
                                                        <span style={{ color: 'var(--color-accent-orange)' }}>
                                                            {' '}F={aResult.F[aResult.ids.indexOf(animal.id)].toFixed(3)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted">
                                                    {animal.sire && `${animal.sire}×${animal.dam}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* A Matrix Display */}
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>A矩阵（亲缘关系矩阵）</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="matrix-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {aResult.ids.map(id => <th key={id}>{id}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {aResult.ids.map((rowId, i) => (
                                        <tr key={rowId}>
                                            <th>{rowId}</th>
                                            {aResult.A[i].map((val, j) => (
                                                <td
                                                    key={j}
                                                    className={i === j && val > 1 ? 'inbreeding' : val > 0 && i !== j ? 'highlight' : ''}
                                                >
                                                    {val.toFixed(4)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <div className="formula-block" style={{ fontSize: '0.85em' }}>
                                <Formula latex="a_{ii} = 1 + F_i, \\quad a_{ij} = \\frac{1}{2}(a_{j,s_i} + a_{j,d_i})" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: MME & BLUP */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Variance params */}
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>⚙️ 方差参数设置</h3>
                        <div className="slider-container">
                            <div className="slider-label">
                                <span>σ²<sub>e</sub> (残差方差)</span>
                                <span className="slider-value">{sigmaE2}</span>
                            </div>
                            <input type="range" min="5" max="100" step="5" value={sigmaE2}
                                onChange={e => setSigmaE2(+e.target.value)} />
                        </div>
                        <div className="slider-container">
                            <div className="slider-label">
                                <span>σ²<sub>a</sub> (加性遗传方差)</span>
                                <span className="slider-value">{sigmaA2}</span>
                            </div>
                            <input type="range" min="5" max="100" step="5" value={sigmaA2}
                                onChange={e => setSigmaA2(+e.target.value)} />
                        </div>
                        <div className="flex justify-between items-center" style={{
                            padding: 'var(--space-3)',
                            background: 'rgba(99,179,237,0.08)',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <span className="text-sm">α = σ²<sub>e</sub> / σ²<sub>a</sub></span>
                            <span className="font-mono font-bold text-accent">{(sigmaE2 / sigmaA2).toFixed(4)}</span>
                        </div>
                    </div>

                    {/* Step-by-step A matrix derivation */}
                    <div className="glass-card-static">
                        <div className="flex justify-between items-center mb-4">
                            <h3 style={{ fontWeight: 700 }}>🔄 逐步推导</h3>
                            <div className="flex gap-2">
                                <button className="btn btn-ghost btn-sm" onClick={handleStepBack} disabled={currentStep === 0}>
                                    ← 上一步
                                </button>
                                <span className="badge badge-blue">{currentStep}/{totalSteps}</span>
                                <button className="btn btn-ghost btn-sm" onClick={handleStepForward} disabled={currentStep >= totalSteps}>
                                    下一步 →
                                </button>
                            </div>
                        </div>

                        <div style={{
                            maxHeight: '300px', overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'
                        }}>
                            {aResult.steps.slice(0, currentStep).map((step, i) => (
                                <div key={i} style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    background: step.type === 'diagonal' ? 'rgba(104,211,145,0.08)' : 'rgba(99,179,237,0.05)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${step.type === 'diagonal' ? 'rgba(104,211,145,0.15)' : 'rgba(99,179,237,0.1)'}`,
                                    fontSize: 'var(--font-size-xs)',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--color-text-secondary)',
                                }} className="animate-fade-in">
                                    {step.formula}
                                </div>
                            ))}
                            {currentStep > aResult.steps.length && mmeResult && (
                                mmeResult.steps.slice(0, currentStep - aResult.steps.length).map((step, i) => (
                                    <div key={`mme-${i}`} style={{
                                        padding: 'var(--space-3)',
                                        background: 'rgba(183,148,246,0.08)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(183,148,246,0.15)',
                                    }} className="animate-fade-in">
                                        <div className="text-sm font-bold" style={{ color: 'var(--color-accent-purple)' }}>
                                            Step {step.step}: {step.title}
                                        </div>
                                        <div className="text-xs text-muted mt-1">{step.detail || ''}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* MME Solution */}
                    {mmeResult && (
                        <div className="glass-card-static">
                            <div className="flex justify-between items-center mb-4">
                                <h3 style={{ fontWeight: 700 }}>📊 MME 求解结果</h3>
                                <button className="btn btn-accent btn-sm"
                                    onClick={() => setShowFullSolution(!showFullSolution)}>
                                    {showFullSolution ? '隐藏详情' : '查看完整解'}
                                </button>
                            </div>

                            <div className="formula-block mb-4" style={{ fontSize: '0.8em' }}>
                                <Formula latex={"\\begin{bmatrix} \\mathbf{X'X} & \\mathbf{X'Z} \\\\ \\mathbf{Z'X} & \\mathbf{Z'Z}+\\mathbf{A}^{-1}\\alpha \\end{bmatrix} \\begin{bmatrix} \\hat{\\mathbf{b}} \\\\ \\hat{\\mathbf{a}} \\end{bmatrix} = \\begin{bmatrix} \\mathbf{X'y} \\\\ \\mathbf{Z'y} \\end{bmatrix}"} />
                            </div>

                            {/* BLUE */}
                            <div className="mb-4">
                                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent-cyan)' }}>
                                    BLUE (固定效应估计)
                                </h4>
                                <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                                    {mmeResult.blue.map((val, i) => (
                                        <div key={i} style={{
                                            padding: 'var(--space-2) var(--space-4)',
                                            background: 'rgba(79,209,197,0.1)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(79,209,197,0.2)',
                                        }}>
                                            <div className="text-xs text-muted">群{i + 1}</div>
                                            <div className="font-mono font-bold">{val.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BLUP */}
                            <div>
                                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent-blue)' }}>
                                    BLUP (育种值预测)
                                </h4>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: 'var(--space-2)',
                                }}>
                                    {aResult.ids.map((id, i) => (
                                        <div key={id} style={{
                                            padding: 'var(--space-2) var(--space-3)',
                                            background: mmeResult.blup[i] > 0 ? 'rgba(104,211,145,0.08)' : 'rgba(252,129,129,0.08)',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${mmeResult.blup[i] > 0 ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)'}`,
                                            textAlign: 'center',
                                        }}>
                                            <div className="text-xs text-muted">{id}</div>
                                            <div className="font-mono font-bold" style={{
                                                color: mmeResult.blup[i] > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'
                                            }}>
                                                {mmeResult.blup[i] >= 0 ? '+' : ''}{mmeResult.blup[i].toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Full LHS/RHS matrices */}
                            {showFullSolution && (
                                <div className="mt-4 animate-fade-in">
                                    <h4 className="text-sm font-bold mb-2">LHS 矩阵：</h4>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="matrix-table" style={{ fontSize: 'var(--font-size-xs)' }}>
                                            <tbody>
                                                {mmeResult.lhs.map((row, i) => (
                                                    <tr key={i}>
                                                        {row.map((val, j) => (
                                                            <td key={j} className={i === j ? 'highlight' : ''}>{(+val).toFixed(2)}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4 className="text-sm font-bold mb-2 mt-4">RHS 向量：</h4>
                                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                        {mmeResult.rhs.map((val, i) => (
                                            <span key={i} className="badge badge-blue font-mono">{(+val).toFixed(2)}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
