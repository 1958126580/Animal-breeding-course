import { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { HeatmapChart, BarChart } from 'echarts/charts';
import {
    GridComponent, TooltipComponent, LegendComponent, VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { buildAMatrix, buildGMatrix } from '../../utils/genetics';
import { miniSNPData, pedigreeDatasets } from '../../data/chapters';
import { Formula } from '../../utils/katex';

echarts.use([HeatmapChart, BarChart, GridComponent, TooltipComponent, LegendComponent, VisualMapComponent, CanvasRenderer]);

export default function GenomicSelection() {
    const [showG, setShowG] = useState(false);
    const [activeTab, setActiveTab] = useState('comparison');

    // Build A matrix from pedigree
    const pedigree = pedigreeDatasets[0].pedigree;
    const aResult = useMemo(() => buildAMatrix(pedigree), []);

    // Build G matrix from SNP data
    const gResult = useMemo(() => buildGMatrix(miniSNPData.genotypes), []);

    // Heatmap data builder
    const buildHeatmapData = (matrix, ids) => {
        const data = [];
        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                data.push([j, i, +(matrix[i][j]).toFixed(4)]);
            }
        }
        return data;
    };

    const aHeatmapOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: {
            formatter: (p) => `${aResult.ids[p.value[1]]} × ${aResult.ids[p.value[0]]}: ${p.value[2]}`
        },
        grid: { left: 60, right: 80, top: 30, bottom: 50 },
        xAxis: {
            type: 'category',
            data: aResult.ids,
            axisLabel: { color: '#a0aec0' },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        yAxis: {
            type: 'category',
            data: aResult.ids,
            axisLabel: { color: '#a0aec0' },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        visualMap: {
            min: 0, max: 1.5,
            calculable: true,
            orient: 'vertical',
            right: 0, top: 'center',
            inRange: { color: ['#0a0e1a', '#2b6cb0', '#63b3ed', '#68d391', '#f6ad55'] },
            textStyle: { color: '#a0aec0' },
        },
        series: [{
            type: 'heatmap',
            data: buildHeatmapData(aResult.A, aResult.ids),
            label: {
                show: aResult.ids.length <= 6,
                color: '#fff',
                fontSize: 10,
                formatter: (p) => p.value[2].toFixed(2),
            },
            emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 1 } },
        }],
    }), []);

    const gHeatmapOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: {
            formatter: (p) => `${miniSNPData.animals[p.value[1]]} × ${miniSNPData.animals[p.value[0]]}: ${p.value[2]}`
        },
        grid: { left: 60, right: 80, top: 30, bottom: 50 },
        xAxis: {
            type: 'category',
            data: miniSNPData.animals,
            axisLabel: { color: '#a0aec0' },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        yAxis: {
            type: 'category',
            data: miniSNPData.animals,
            axisLabel: { color: '#a0aec0' },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        visualMap: {
            min: -0.5, max: 2,
            calculable: true,
            orient: 'vertical',
            right: 0, top: 'center',
            inRange: { color: ['#fc8181', '#0a0e1a', '#2b6cb0', '#63b3ed', '#b794f6'] },
            textStyle: { color: '#a0aec0' },
        },
        series: [{
            type: 'heatmap',
            data: buildHeatmapData(gResult.G, miniSNPData.animals),
            label: {
                show: true,
                color: '#fff',
                fontSize: 10,
                formatter: (p) => p.value[2].toFixed(2),
            },
            emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 1 } },
        }],
    }), []);

    const freqOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 60, right: 30, top: 30, bottom: 50 },
        xAxis: {
            type: 'category',
            data: miniSNPData.markers,
            axisLabel: { color: '#a0aec0', rotate: 45 },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        yAxis: {
            type: 'value',
            name: '等位基因频率 p',
            min: 0, max: 1,
            axisLine: { lineStyle: { color: '#4a5568' } },
            axisLabel: { color: '#a0aec0' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        },
        series: [{
            type: 'bar',
            data: gResult.freqs.map(f => +f.toFixed(3)),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#b794f6' },
                    { offset: 1, color: '#6b46c1' }
                ]),
            },
            barWidth: '50%',
        }],
    }), []);

    const tabs = [
        { key: 'comparison', label: 'A矩阵 vs G矩阵', icon: '⚡' },
        { key: 'snpdata', label: 'SNP数据与频率', icon: '📊' },
        { key: 'theory', label: '理论基础', icon: '📖' },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🧪 基因组选择展厅</h1>
                <p>对比传统系谱A矩阵与基因组G矩阵 — 对应教材第十章</p>
            </div>

            <div className="tabs">
                {tabs.map(t => (
                    <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'comparison' && (
                <div className="animate-fade-in">
                    <div className="grid-2">
                        {/* A Matrix Heatmap */}
                        <div className="glass-card-static">
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                📋 A矩阵（系谱关系）
                            </h3>
                            <p className="text-sm text-muted mb-4">基于系谱（父-母-后代）关系推导</p>
                            <ReactEChartsCore echarts={echarts} option={aHeatmapOption} style={{ height: 350 }} />
                        </div>

                        {/* G Matrix Heatmap */}
                        <div className="glass-card-static">
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                🧬 G矩阵（基因组关系）
                            </h3>
                            <p className="text-sm text-muted mb-4">基于 {miniSNPData.markers.length} 个 SNP 标记构建</p>
                            <ReactEChartsCore echarts={echarts} option={gHeatmapOption} style={{ height: 350 }} />
                        </div>
                    </div>

                    {/* Key differences */}
                    <div className="glass-card-static mt-6">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>🔑 核心差异</h3>
                        <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'rgba(99,179,237,0.08)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--color-accent-blue)',
                            }}>
                                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent-blue)' }}>A矩阵</h4>
                                <ul className="text-sm text-muted" style={{ paddingLeft: 'var(--space-4)', listStyle: 'disc' }}>
                                    <li>基于系谱记录</li>
                                    <li>反映期望关系</li>
                                    <li>全/半同胞关系相同</li>
                                    <li>无法区分带与不带QTL的个体</li>
                                </ul>
                            </div>
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'rgba(183,148,246,0.08)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--color-accent-purple)',
                            }}>
                                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent-purple)' }}>G矩阵</h4>
                                <ul className="text-sm text-muted" style={{ paddingLeft: 'var(--space-4)', listStyle: 'disc' }}>
                                    <li>基于SNP标记</li>
                                    <li>反映实际关系</li>
                                    <li>全同胞间关系不同</li>
                                    <li>捕获Mendelian采样差异</li>
                                </ul>
                            </div>
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'rgba(104,211,145,0.08)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--color-accent-green)',
                            }}>
                                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-accent-green)' }}>优势</h4>
                                <ul className="text-sm text-muted" style={{ paddingLeft: 'var(--space-4)', listStyle: 'disc' }}>
                                    <li>出生即可获得GEBV</li>
                                    <li>⬇ 世代间隔</li>
                                    <li>⬆ 评定准确度</li>
                                    <li>⬆ 年遗传进展</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'snpdata' && (
                <div className="animate-fade-in">
                    {/* SNP genotype table */}
                    <div className="glass-card-static mb-6">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>🧬 微型SNP基因型数据（0/1/2编码）</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="matrix-table">
                                <thead>
                                    <tr>
                                        <th>个体</th>
                                        {miniSNPData.markers.map(m => <th key={m}>{m}</th>)}
                                        <th>表型值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {miniSNPData.animals.map((a, i) => (
                                        <tr key={a}>
                                            <th>{a}</th>
                                            {miniSNPData.genotypes[i].map((g, j) => (
                                                <td key={j} style={{
                                                    color: g === 2 ? 'var(--color-accent-green)' : g === 0 ? 'var(--color-accent-red)' : 'var(--color-text-secondary)'
                                                }}>
                                                    {g}
                                                </td>
                                            ))}
                                            <td className="highlight">{miniSNPData.phenotypes[i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-2">0=纯合参考, 1=杂合, 2=纯合替代</p>
                    </div>

                    {/* Allele frequencies */}
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>📊 等位基因频率</h3>
                        <ReactEChartsCore echarts={echarts} option={freqOption} style={{ height: 300 }} />
                        <div className="text-sm text-muted mt-2">
                            缩放因子 2Σp(1-p) = {gResult.scale.toFixed(4)}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'theory' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📐 G矩阵构建（VanRaden 2008 方法1）</h3>
                        <div className="formula-block">
                            <Formula latex="\mathbf{G} = \frac{\mathbf{Z}\mathbf{Z}'}{2\sum_{j=1}^{m} p_j(1-p_j)}" />
                        </div>
                        <p className="text-sm text-muted mt-3">
                            其中 Z 为中心化基因型矩阵：Z<sub>ij</sub> = M<sub>ij</sub> - 2p<sub>j</sub>
                        </p>
                        <div className="formula-block mt-4">
                            <Formula latex="Z_{ij} = M_{ij} - 2p_j" />
                        </div>
                    </div>

                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📐 GBLUP模型</h3>
                        <div className="formula-block">
                            <Formula latex="\mathbf{y} = \mathbf{X}\mathbf{b} + \mathbf{Z}\mathbf{g} + \mathbf{e}, \quad \mathbf{g} \sim N(0, \mathbf{G}\sigma_g^2)" />
                        </div>
                        <p className="text-sm text-muted mt-3">
                            GBLUP 直接用 G 矩阵替代 A 矩阵，使得即使没有表型记录的基因型个体也能获得 GEBV。
                        </p>
                    </div>

                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📐 单步法 H矩阵</h3>
                        <div className="formula-block">
                            <Formula latex="\mathbf{H}^{-1} = \mathbf{A}^{-1} + \begin{bmatrix} 0 & 0 \\ 0 & \mathbf{G}^{-1} - \mathbf{A}_{22}^{-1} \end{bmatrix}" />
                        </div>
                        <p className="text-sm text-muted mt-3">
                            ssGBLUP（单步GBLUP）将有基因组和无基因组个体的信息统一到 H 矩阵中，实现一步法遗传评定。
                        </p>
                    </div>

                    <div className="glass-card-static">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>🏆 基因组选择的革命性意义</h3>
                        <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                            <div style={{ padding: 'var(--space-4)', background: 'rgba(99,179,237,0.05)', borderRadius: 'var(--radius-md)' }}>
                                <h4 className="font-bold mb-2">传统BLUP选择</h4>
                                <div className="text-sm text-muted">
                                    <div>世代间隔：🐄 奶牛 ~6.5年</div>
                                    <div>需要后裔测验</div>
                                    <div>公牛5-6岁获得准确EBV</div>
                                </div>
                            </div>
                            <div style={{ padding: 'var(--space-4)', background: 'rgba(104,211,145,0.05)', borderRadius: 'var(--radius-md)' }}>
                                <h4 className="font-bold mb-2">基因组选择 (GS)</h4>
                                <div className="text-sm text-muted">
                                    <div>世代间隔：🐄 ~2-3年</div>
                                    <div>出生即可获得GEBV</div>
                                    <div>年遗传进展翻倍！</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
