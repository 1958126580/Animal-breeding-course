import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
    GridComponent, TooltipComponent, LegendComponent, TitleComponent, RadarComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { loadProgress, getQuizStats, getStudyTimeHistory } from '../utils/progress';
import chapters from '../data/chapters';

echarts.use([BarChart, LineChart, PieChart, RadarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, RadarComponent, CanvasRenderer]);

export default function Analytics() {
    const progress = loadProgress();
    const stats = getQuizStats();
    const studyTime = getStudyTimeHistory(14);

    const visitedChapters = Object.keys(progress.chapterProgress).length;
    const totalChapters = chapters.length;
    const completionRate = totalChapters > 0 ? (visitedChapters / totalChapters * 100) : 0;

    // Chapter progress chart
    const chapterProgressOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 80, right: 30, top: 30, bottom: 80 },
        xAxis: {
            type: 'category',
            data: chapters.map(ch => ch.number || '绪论'),
            axisLabel: { color: '#a0aec0', rotate: 30 },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        yAxis: {
            type: 'value',
            max: 100,
            name: '完成度 (%)',
            axisLine: { lineStyle: { color: '#4a5568' } },
            axisLabel: { color: '#a0aec0' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        },
        series: [{
            type: 'bar',
            data: chapters.map(ch => {
                const cp = progress.chapterProgress[ch.id];
                return {
                    value: cp?.completed ? 100 : cp?.visited ? 40 : 0,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: ch.color || '#63b3ed' },
                            { offset: 1, color: `${ch.color || '#63b3ed'}80` },
                        ]),
                    },
                };
            }),
            barWidth: '60%',
        }],
    }), [progress]);

    // Study time chart
    const studyTimeOption = useMemo(() => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 60, right: 30, top: 30, bottom: 40 },
        xAxis: {
            type: 'category',
            data: studyTime.map(s => s.label),
            axisLabel: { color: '#a0aec0' },
            axisLine: { lineStyle: { color: '#4a5568' } },
        },
        yAxis: {
            type: 'value',
            name: '学习时间 (分钟)',
            axisLine: { lineStyle: { color: '#4a5568' } },
            axisLabel: { color: '#a0aec0' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        },
        series: [{
            type: 'bar',
            data: studyTime.map(s => s.minutes),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#b794f6' },
                    { offset: 1, color: '#6b46c180' },
                ]),
                borderRadius: [4, 4, 0, 0],
            },
            barWidth: '40%',
        }],
    }), [studyTime]);

    // Knowledge radar
    const knowledgeRadarOption = useMemo(() => {
        const dimensions = [
            { name: '遗传学基础', max: 100 },
            { name: '性能测定', max: 100 },
            { name: '选择理论', max: 100 },
            { name: 'BLUP评定', max: 100 },
            { name: '育种规划', max: 100 },
            { name: '基因组选择', max: 100 },
        ];

        const chapterMapping = [
            [0, 1, 2],  // 遗传学基础
            [3],         // 性能测定
            [4],         // 选择理论
            [5],         // BLUP评定
            [6, 7, 8, 9], // 育种规划
            [10],        // 基因组选择
        ];

        const values = chapterMapping.map(chapterIds => {
            const byChapter = stats.byChapter;
            let total = 0, correct = 0;
            chapterIds.forEach(id => {
                if (byChapter[id]) {
                    total += byChapter[id].total;
                    correct += byChapter[id].correct;
                }
            });
            // Also factor in chapter visits
            const visited = chapterIds.filter(id => progress.chapterProgress[id]?.visited).length;
            const visitScore = chapterIds.length > 0 ? (visited / chapterIds.length * 30) : 0;
            const quizScore = total > 0 ? (correct / total * 70) : 0;
            return Math.round(visitScore + quizScore);
        });

        return {
            backgroundColor: 'transparent',
            tooltip: {},
            radar: {
                indicator: dimensions,
                axisName: { color: '#a0aec0', fontSize: 12 },
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
                splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
            },
            series: [{
                type: 'radar',
                data: [{
                    value: values,
                    name: '知识掌握度',
                    areaStyle: { color: 'rgba(99,179,237,0.15)' },
                    lineStyle: { color: '#63b3ed', width: 2 },
                    itemStyle: { color: '#63b3ed' },
                }],
            }],
        };
    }, [stats, progress]);

    // Quiz accuracy trend
    const quizTrendOption = useMemo(() => {
        const attempts = progress.quizAttempts || [];
        if (attempts.length === 0) return null;

        // Group by batches of 5
        const batchSize = Math.max(2, Math.floor(attempts.length / 8));
        const batches = [];
        for (let i = 0; i < attempts.length; i += batchSize) {
            const batch = attempts.slice(i, i + batchSize);
            const correct = batch.filter(a => a.correct).length;
            batches.push({
                label: `${i + 1}-${Math.min(i + batchSize, attempts.length)}`,
                rate: (correct / batch.length * 100),
            });
        }

        return {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            grid: { left: 60, right: 30, top: 30, bottom: 40 },
            xAxis: {
                type: 'category',
                data: batches.map(b => b.label),
                axisLabel: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#4a5568' } },
            },
            yAxis: {
                type: 'value',
                max: 100,
                name: '正确率 (%)',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            },
            series: [{
                type: 'line',
                data: batches.map(b => +b.rate.toFixed(1)),
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { color: '#68d391', width: 2 },
                itemStyle: { color: '#68d391' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(104,211,145,0.2)' },
                        { offset: 1, color: 'rgba(104,211,145,0)' },
                    ]),
                },
            }],
        };
    }, [progress.quizAttempts]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 学习分析仪表盘</h1>
                <p>追踪学习进度，发现薄弱环节，优化学习路径</p>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid mb-8 stagger-children">
                <div className="glass-card-static stat-card">
                    <div className="stat-number">{visitedChapters}/{totalChapters}</div>
                    <div className="stat-label">已学章节</div>
                </div>
                <div className="glass-card-static stat-card">
                    <div className="stat-number" style={{ background: 'var(--gradient-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {stats.total}
                    </div>
                    <div className="stat-label">答题总数</div>
                </div>
                <div className="glass-card-static stat-card">
                    <div className="stat-number" style={{
                        background: stats.rate >= 0.8 ? 'var(--gradient-green)' : stats.rate >= 0.6 ? 'var(--gradient-blue)' : 'var(--gradient-orange)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        {stats.total > 0 ? `${(stats.rate * 100).toFixed(0)}%` : '--'}
                    </div>
                    <div className="stat-label">正确率</div>
                </div>
                <div className="glass-card-static stat-card">
                    <div className="stat-number" style={{ background: 'var(--gradient-green)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {(progress.labRuns || []).length}
                    </div>
                    <div className="stat-label">实验运行次数</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid-2 mb-8">
                <div className="glass-card-static">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>📚 章节学习进度</h3>
                    <ReactEChartsCore echarts={echarts} option={chapterProgressOption} style={{ height: 300 }} />
                </div>
                <div className="glass-card-static">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>🕐 近14天学习时间</h3>
                    <ReactEChartsCore echarts={echarts} option={studyTimeOption} style={{ height: 300 }} />
                </div>
            </div>

            <div className="grid-2 mb-8">
                <div className="glass-card-static">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>🎯 知识掌握雷达图</h3>
                    <ReactEChartsCore echarts={echarts} option={knowledgeRadarOption} style={{ height: 350 }} />
                </div>
                <div className="glass-card-static">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>📈 答题正确率趋势</h3>
                    {quizTrendOption ? (
                        <ReactEChartsCore echarts={echarts} option={quizTrendOption} style={{ height: 350 }} />
                    ) : (
                        <div className="text-center text-muted" style={{ padding: 'var(--space-16)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)', opacity: 0.3 }}>📈</div>
                            <p>完成更多练习后将显示趋势图</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Completion progress */}
            <div className="glass-card-static mb-8">
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>📋 学习概览</h3>
                <div className="progress-bar mb-2" style={{ height: '10px' }}>
                    <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
                <div className="flex justify-between text-sm text-muted">
                    <span>整体完成度 {completionRate.toFixed(0)}%</span>
                    <span>{visitedChapters} / {totalChapters} 章节</span>
                </div>
            </div>

            {/* Learning Tips */}
            <div className="glass-card-static">
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>💡 学习建议</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {visitedChapters === 0 && (
                        <div style={{
                            padding: 'var(--space-4)', background: 'rgba(99,179,237,0.08)',
                            borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent-blue)',
                        }}>
                            <p className="text-sm">🚀 <strong>开始学习：</strong>建议从绪论开始，了解课程框架后再进入具体章节。</p>
                        </div>
                    )}
                    {visitedChapters > 0 && visitedChapters < 5 && (
                        <div style={{
                            padding: 'var(--space-4)', background: 'rgba(104,211,145,0.08)',
                            borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent-green)',
                        }}>
                            <p className="text-sm">📖 <strong>继续前进：</strong>你已开始学习，建议按照教材顺序推进，打好基础后进入核心难点章节（第5章）。</p>
                        </div>
                    )}
                    {stats.total > 0 && stats.rate < 0.6 && (
                        <div style={{
                            padding: 'var(--space-4)', background: 'rgba(246,173,85,0.08)',
                            borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent-orange)',
                        }}>
                            <p className="text-sm">⚠️ <strong>重点复习：</strong>答题正确率较低，建议回顾相关章节概念和公式后再做练习。</p>
                        </div>
                    )}
                    <div style={{
                        padding: 'var(--space-4)', background: 'rgba(183,148,246,0.08)',
                        borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent-purple)',
                    }}>
                        <p className="text-sm">🔬 <strong>实验室练习：</strong>完成理论学习后，进入虚拟实验室动手操作，将抽象概念转化为直觉理解。</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
