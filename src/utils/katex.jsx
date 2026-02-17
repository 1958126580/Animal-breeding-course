import katex from 'katex';

/**
 * 将 LaTeX 字符串渲染为 HTML
 * @param {string} latex - LaTeX 表达式
 * @param {boolean} displayMode - 是否以 display 模式渲染
 * @returns {string} HTML 字符串
 */
export function renderLatex(latex, displayMode = true) {
    try {
        return katex.renderToString(latex, {
            displayMode,
            throwOnError: false,
            trust: false,
            strict: false,
            macros: {
                "\\bm": "\\boldsymbol",
            },
        });
    } catch (e) {
        console.warn('KaTeX 渲染错误:', e);
        return `<code>${latex}</code>`;
    }
}

/**
 * KaTeX 公式渲染 React 组件
 */
export function Formula({ latex, display = true, className = '' }) {
    const html = renderLatex(latex, display);
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
