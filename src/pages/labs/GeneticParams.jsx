import { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
    GridComponent, TooltipComponent, LegendComponent, TitleComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { calcGeneticParams, normalPDF } from '../../utils/genetics';
import { Formula } from '../../utils/katex';
import { geneticScenarios } from '../../data/chapters';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

export default function GeneticParams() {
    const [VA, setVA] = useState(40);
    const [VD, setVD] = useState(5);
    const [VE, setVE] = useState(55);

    const params = useMemo(() => calcGeneticParams(VA, VD, VE), [VA, VD, VE]);

    const distOption = useMemo(() => {
        const totalData = normalPDF(100, params.VP || 1);
        const aData = normalPDF(100, VA || 0.1);
        return {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: {
                data: ['表型分布 VP', '加性遗传 VA'],
                textStyle: { color: '#a0aec0' },
                top: 10,
            },
            grid: { left: 60, right: 30, top: 50, bottom: 40 },
            xAxis: {
                type: 'value',
                name: '表型值',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            yAxis: {
                type: 'value',
                name: '概率密度',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            series: [
                {
                    name: '表型分布 VP',
                    type: 'line',
                    data: totalData,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: { color: '#63b3ed', width: 2 },
                    areaStyle: { color: 'rgba(99,179,237,0.1)' },
                },
                {
                    name: '加性遗传 VA',
                    type: 'line',
                    data: aData,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: { color: '#68d391', width: 2, type: 'dashed' },
                    areaStyle: { color: 'rgba(104,211,145,0.08)' },
                },
            ],
        };
    }, [VA, params.VP]);

    const pieOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
        series: [{
            type: 'bar',
            data: [
                { value: params.ratioVA, name: 'VA (加性)', itemStyle: { color: '#68d391' } },
                { value: params.ratioVD, name: 'VD (显性)', itemStyle: { color: '#b794f6' } },
                { value: params.ratioVE, name: 'VE (环境)', itemStyle: { color: '#fc8181' } },
            ],
            barWidth: '60%',
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                color: '#a0aec0',
            },
        }],
        xAxis: {
            type: 'category',
            data: ['VA (加性)', 'VD (显性)', 'VE (环境)'],
            axisLine: { lineStyle: { color: '#4a5568' } },
            axisLabel: { color: '#a0aec0' },
        },
        yAxis: {
            type: 'value',
            max: 100,
            name: '占 VP 比例 (%)',
            axisLine: { lineStyle: { color: '#4a5568' } },
            axisLabel: { color: '#a0aec0' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        },
        grid: { left: 60, right: 30, top: 30, bottom: 40 },
    }), [params]);

    const loadScenario = (scenario) => {
        setVA(scenario.VA);
        setVD(scenario.VD);
        setVE(scenario.VE);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🧬 数量遗传可视化沙盒</h1>
                <p>拖动滑块控制方差组分，实时观察遗传力变化 — 对应教材第3-4章</p>
            </div>

            {/* Scenario Presets */}
            <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
                {geneticScenarios.map((s) => (
                    <button
                        key={s.name}
                        className="btn btn-secondary btn-sm"
                        onClick={() => loadScenario(s)}
                        title={s.desc}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            <div className="sim-panel">
                {/* Controls */}
                <div className="glass-card-static sim-controls">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>方差组分控制</h3>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>V<sub>A</sub> (加性遗传方差)</span>
                            <span className="slider-value" style={{ color: '#68d391' }}>{VA}</span>
                        </div>
                        <input type="range" min="0" max="100" step="1" value={VA}
                            onChange={e => setVA(+e.target.value)}
                            style={{ accentColor: '#68d391' }} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>V<sub>D</sub> (显性方差)</span>
                            <span className="slider-value" style={{ color: '#b794f6' }}>{VD}</span>
                        </div>
                        <input type="range" min="0" max="50" step="1" value={VD}
                            onChange={e => setVD(+e.target.value)}
                            style={{ accentColor: '#b794f6' }} />
                    </div>

                    <div className="slider-container">
                        <div className="slider-label">
                            <span>V<sub>E</sub> (环境方差)</span>
                            <span className="slider-value" style={{ color: '#fc8181' }}>{VE}</span>
                        </div>
                        <input type="range" min="0" max="100" step="1" value={VE}
                            onChange={e => setVE(+e.target.value)}
                            style={{ accentColor: '#fc8181' }} />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

                    {/* Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted">V<sub>P</sub> (表型方差)</span>
                            <span className="font-mono font-bold text-accent">{params.VP.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted">h² (狭义遗传力)</span>
                            <span className="font-mono font-bold" style={{
                                fontSize: 'var(--font-size-xl)',
                                color: params.h2_narrow > 0.4 ? '#68d391' : params.h2_narrow > 0.2 ? '#f6ad55' : '#fc8181'
                            }}>{params.h2_narrow.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted">H² (广义遗传力)</span>
                            <span className="font-mono font-bold">{params.h2_broad.toFixed(4)}</span>
                        </div>
                    </div>

                    {/* Formula */}
                    <div className="formula-block mt-4" style={{ fontSize: '0.9em' }}>
                        <Formula latex={`h^2 = \frac{V_A}{V_P} = \frac{${VA}}{${params.VP.toFixed(1)}} = ${params.h2_narrow.toFixed(4)}`} />
                    </div>

                    {/* Insight */}
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'rgba(99,179,237,0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(99,179,237,0.15)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        marginTop: 'var(--space-2)',
                    }}>
                        💡 {params.h2_narrow >= 0.4
                            ? '高遗传力：个体选择效果好，可通过自身性能直接选种'
                            : params.h2_narrow >= 0.2
                                ? '中等遗传力：宜结合后裔测验等方法提高选择准确度'
                                : '低遗传力：个体选择效果差，需借助家系信息或BLUP评定'}
                    </div>
                </div>

                {/* Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>表型分布 vs 加性遗传分布</h3>
                        <ReactEChartsCore echarts={echarts} option={distOption} style={{ height: 320 }} />
                    </div>
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>方差组分比例</h3>
                        <ReactEChartsCore echarts={echarts} option={pieOption} style={{ height: 280 }} />
                    </div>
                </div>
            </div>

            {/* Knowledge Card */}
            <div className="glass-card-static mt-8">
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📖 知识要点</h3>
                <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                    <div>
                        <div className="formula-block">
                            <Formula latex="V_P = V_A + V_D + V_E" />
                        </div>
                        <p className="text-sm text-muted">表型方差由加性遗传方差、显性方差和环境方差组成（忽略上位互作）</p>
                    </div>
                    <div>
                        <div className="formula-block">
                            <Formula latex="\Delta G = i \times h^2 \times \sigma_P" />
                        </div>
                        <p className="text-sm text-muted">遗传进展与遗传力成正比——h²越大，选择反应越强</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
