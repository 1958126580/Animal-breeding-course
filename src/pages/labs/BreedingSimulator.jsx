import { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { runBreedingSimulation } from '../../utils/genetics';
import { Formula } from '../../utils/katex';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default function BreedingSimulator() {
    const [h2, setH2] = useState(0.35);
    const [intensity, setIntensity] = useState(1.76);
    const [genInterval, setGenInterval] = useState(5);
    const [popSize, setPopSize] = useState(200);
    const [nGenerations, setNGenerations] = useState(15);
    const [matingStrategy, setMatingStrategy] = useState('random');
    const [result, setResult] = useState(null);
    const [comparing, setComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState(null);

    const runSim = () => {
        const r = runBreedingSimulation({
            h2, intensity, genInterval, popSize, nGenerations,
            matingStrategy, seed: 42,
        });
        setResult(r);
        setComparing(false);
        setComparisonResults(null);
    };

    const runComparison = () => {
        const strategies = ['random', 'avoidance', 'optimal'];
        const results = {};
        strategies.forEach(s => {
            results[s] = runBreedingSimulation({
                h2, intensity, genInterval, popSize, nGenerations,
                matingStrategy: s, seed: 42,
            });
        });
        setComparisonResults(results);
        setComparing(true);
    };

    const strategyLabels = {
        random: '随机交配',
        avoidance: '避免近交',
        optimal: '最优贡献选择',
    };

    const strategyColors = {
        random: '#63b3ed',
        avoidance: '#68d391',
        optimal: '#b794f6',
    };

    const chartOption = useMemo(() => {
        if (!comparing && !result) return null;

        const datasets = comparing
            ? Object.entries(comparisonResults || {}).map(([key, r]) => ({
                name: strategyLabels[key],
                color: strategyColors[key],
                data: r.generations,
            }))
            : [{
                name: strategyLabels[matingStrategy],
                color: '#63b3ed',
                data: result.generations,
            }];

        return {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: {
                data: datasets.map(d => d.name),
                textStyle: { color: '#a0aec0' },
                top: 10,
            },
            grid: { left: 70, right: 30, top: 50, bottom: 40 },
            xAxis: {
                type: 'value',
                name: '世代',
                min: 0,
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            yAxis: {
                type: 'value',
                name: '群体育种值均值',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            series: datasets.map(d => ({
                name: d.name,
                type: 'line',
                data: d.data.map(g => [g.gen, +g.meanBV.toFixed(2)]),
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: { color: d.color, width: 2 },
                itemStyle: { color: d.color },
            })),
        };
    }, [result, comparing, comparisonResults]);

    const inbreedingOption = useMemo(() => {
        if (!comparing && !result) return null;

        const datasets = comparing
            ? Object.entries(comparisonResults || {}).map(([key, r]) => ({
                name: strategyLabels[key],
                color: strategyColors[key],
                data: r.generations,
            }))
            : [{
                name: strategyLabels[matingStrategy],
                color: '#fc8181',
                data: result.generations,
            }];

        return {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: {
                data: datasets.map(d => d.name + ' (F)'),
                textStyle: { color: '#a0aec0' },
                top: 10,
            },
            grid: { left: 70, right: 30, top: 50, bottom: 40 },
            xAxis: {
                type: 'value',
                name: '世代',
                min: 0,
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            yAxis: {
                type: 'value',
                name: '平均近交系数',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0', formatter: '{value}' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            series: datasets.map(d => ({
                name: d.name + ' (F)',
                type: 'line',
                data: d.data.map(g => [g.gen, +(g.meanF || 0).toFixed(4)]),
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: { color: d.color, width: 2, type: 'dashed' },
                itemStyle: { color: d.color },
                areaStyle: { color: `${d.color}15` },
            })),
        };
    }, [result, comparing, comparisonResults]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 育种总监世代沙盘</h1>
                <p>Monte Carlo 仿真育种方案 — 观察不同参数下的遗传进展与近交风险</p>
            </div>

            <div className="sim-panel">
                {/* Controls */}
                <div className="glass-card-static sim-controls">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>育种参数</h3>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>遗传力 h²</span>
                            <span className="slider-value">{h2.toFixed(2)}</span>
                        </div>
                        <input type="range" min="0.05" max="0.80" step="0.05" value={h2}
                            onChange={e => setH2(+e.target.value)} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>选择强度 i</span>
                            <span className="slider-value">{intensity.toFixed(2)}</span>
                        </div>
                        <input type="range" min="0.5" max="2.67" step="0.01" value={intensity}
                            onChange={e => setIntensity(+e.target.value)} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>世代间隔 L (年)</span>
                            <span className="slider-value">{genInterval}</span>
                        </div>
                        <input type="range" min="1" max="10" step="1" value={genInterval}
                            onChange={e => setGenInterval(+e.target.value)} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>群体大小 N</span>
                            <span className="slider-value">{popSize}</span>
                        </div>
                        <input type="range" min="50" max="1000" step="50" value={popSize}
                            onChange={e => setPopSize(+e.target.value)} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>仿真世代数</span>
                            <span className="slider-value">{nGenerations}</span>
                        </div>
                        <input type="range" min="5" max="30" step="1" value={nGenerations}
                            onChange={e => setNGenerations(+e.target.value)} />
                    </div>

                    <div>
                        <div className="text-sm text-muted mb-2">交配策略</div>
                        <select value={matingStrategy} onChange={e => setMatingStrategy(e.target.value)}
                            style={{ width: '100%' }}>
                            <option value="random">随机交配</option>
                            <option value="avoidance">避免近交</option>
                            <option value="optimal">最优贡献选择</option>
                        </select>
                    </div>

                    <div className="formula-block mt-4" style={{ fontSize: '0.85em' }}>
                        <Formula latex={`\\Delta G = ${intensity.toFixed(2)} \\times ${h2.toFixed(2)} \\times \\sigma_P`} />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <button className="btn btn-primary w-full" onClick={runSim}>
                            ▶ 运行仿真
                        </button>
                        <button className="btn btn-accent w-full" onClick={runComparison}>
                            ⚡ 三策略对比
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="sim-results">
                    {(result || comparing) ? (
                        <>
                            <div className="glass-card-static">
                                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                    📈 遗传进展曲线
                                </h3>
                                {chartOption && <ReactEChartsCore echarts={echarts} option={chartOption} style={{ height: 350 }} />}
                            </div>

                            <div className="glass-card-static">
                                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                    ⚠️ 近交系数变化
                                </h3>
                                {inbreedingOption && <ReactEChartsCore echarts={echarts} option={inbreedingOption} style={{ height: 280 }} />}
                            </div>

                            {/* Summary stats */}
                            <div className="glass-card-static">
                                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📊 仿真摘要</h3>
                                {comparing ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="matrix-table" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>策略</th>
                                                    <th>总遗传进展</th>
                                                    <th>平均 ΔG/代</th>
                                                    <th>最终 F</th>
                                                    <th>效率</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(comparisonResults || {}).map(([key, r]) => (
                                                    <tr key={key}>
                                                        <td>{strategyLabels[key]}</td>
                                                        <td className="highlight">{r.summary.totalGain.toFixed(2)}</td>
                                                        <td>{r.summary.actualDeltaG.toFixed(2)}</td>
                                                        <td className={r.summary.finalF > 0.1 ? 'inbreeding' : ''}>{r.summary.finalF.toFixed(4)}</td>
                                                        <td>{r.summary.efficiency.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : result && (
                                    <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                                        <div style={{ padding: 'var(--space-3)', background: 'rgba(104,211,145,0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">总遗传进展</div>
                                            <div className="font-mono font-bold text-lg" style={{ color: 'var(--color-accent-green)' }}>
                                                {result.summary.totalGain.toFixed(2)}
                                            </div>
                                        </div>
                                        <div style={{ padding: 'var(--space-3)', background: 'rgba(99,179,237,0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">预期 ΔG/代</div>
                                            <div className="font-mono font-bold text-lg" style={{ color: 'var(--color-accent-blue)' }}>
                                                {result.summary.expectedDeltaG.toFixed(2)}
                                            </div>
                                        </div>
                                        <div style={{ padding: 'var(--space-3)', background: 'rgba(246,173,85,0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">最终近交系数</div>
                                            <div className="font-mono font-bold text-lg" style={{
                                                color: result.summary.finalF > 0.1 ? 'var(--color-accent-red)' : 'var(--color-accent-orange)'
                                            }}>
                                                {result.summary.finalF.toFixed(4)}
                                            </div>
                                        </div>
                                        <div style={{ padding: 'var(--space-3)', background: 'rgba(183,148,246,0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">实际 ΔG/代</div>
                                            <div className="font-mono font-bold text-lg" style={{ color: 'var(--color-accent-purple)' }}>
                                                {result.summary.actualDeltaG.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="glass-card-static text-center" style={{ padding: 'var(--space-16)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>🎯</div>
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>调整参数后点击"运行仿真"</h3>
                            <p className="text-muted text-sm">
                                尝试不同的遗传力、选择强度和交配策略组合，<br />
                                观察遗传进展与近交风险的权衡关系
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
