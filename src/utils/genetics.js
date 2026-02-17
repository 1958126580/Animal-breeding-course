/**
 * 家畜育种学 — 遗传学核心计算引擎
 * Genetics Core Computation Engine
 *
 * 功能：
 * - Henderson 递归法构建亲缘关系矩阵 (A矩阵)
 * - 近交系数计算 (F)
 * - 混合模型方程组 (MME) 构建与求解
 * - VanRaden 法构建基因组关系矩阵 (G矩阵)
 * - Monte Carlo 育种仿真引擎
 * - SM-2 间隔复习算法
 */

import { Matrix, inverse, solve } from 'ml-matrix';

// ══════════════════════════════════════════════
// 1. 亲缘关系矩阵 (A矩阵) — Henderson 递归法
// ══════════════════════════════════════════════

/**
 * 使用 Henderson 递归法 (tabular method) 构建亲缘关系矩阵
 *
 * @param {Array<{id: string, sire: string|null, dam: string|null}>} pedigree
 *   系谱数组，按世代排序（父母在前，后代在后）
 * @returns {{ A: number[][], ids: string[], F: number[], steps: Array }}
 *
 * 核心算法：
 *   a_ii = 1 + F_i = 1 + 0.5 * a_{sire,dam}
 *   a_ij = 0.5 * (a_{j,sire_i} + a_{j,dam_i})  当 i > j
 */
export function buildAMatrix(pedigree) {
  const n = pedigree.length;
  const ids = pedigree.map(p => p.id);
  const idxMap = {};
  ids.forEach((id, i) => { idxMap[id] = i; });

  const A = Array.from({ length: n }, () => Array(n).fill(0));
  const F = Array(n).fill(0);
  const steps = [];

  for (let i = 0; i < n; i++) {
    const sireIdx = pedigree[i].sire ? (idxMap[pedigree[i].sire] ?? -1) : -1;
    const damIdx = pedigree[i].dam ? (idxMap[pedigree[i].dam] ?? -1) : -1;

    // 对角元素: a_ii = 1 + F_i
    if (sireIdx >= 0 && damIdx >= 0) {
      F[i] = 0.5 * A[sireIdx][damIdx];
    }
    A[i][i] = 1 + F[i];

    steps.push({
      type: 'diagonal',
      animal: ids[i],
      sire: pedigree[i].sire,
      dam: pedigree[i].dam,
      F: F[i],
      value: A[i][i],
      formula: sireIdx >= 0 && damIdx >= 0
        ? `a(${ids[i]},${ids[i]}) = 1 + F_${ids[i]} = 1 + 0.5×a(${pedigree[i].sire},${pedigree[i].dam}) = 1 + 0.5×${A[sireIdx][damIdx].toFixed(4)} = ${A[i][i].toFixed(4)}`
        : `a(${ids[i]},${ids[i]}) = 1 + F_${ids[i]} = 1 + 0 = 1`
    });

    // 非对角元素: a_ij = 0.5 * (a_{j,sire_i} + a_{j,dam_i})
    for (let j = 0; j < i; j++) {
      const valSire = sireIdx >= 0 ? A[j][sireIdx] : 0;
      const valDam = damIdx >= 0 ? A[j][damIdx] : 0;
      A[i][j] = 0.5 * (valSire + valDam);
      A[j][i] = A[i][j]; // 对称矩阵

      if (A[i][j] !== 0) {
        steps.push({
          type: 'offdiag',
          i: ids[i],
          j: ids[j],
          value: A[i][j],
          formula: `a(${ids[i]},${ids[j]}) = 0.5×(a(${ids[j]},${pedigree[i].sire || '?'}) + a(${ids[j]},${pedigree[i].dam || '?'})) = 0.5×(${valSire.toFixed(4)} + ${valDam.toFixed(4)}) = ${A[i][j].toFixed(4)}`
        });
      }
    }
  }

  return { A, ids, F, steps };
}

/**
 * 计算 A 矩阵的逆（用于 MME）
 * 使用 Henderson 快速求逆规则
 */
export function invertAMatrix(A) {
  const mat = new Matrix(A);
  return inverse(mat).to2DArray();
}

// ══════════════════════════════════════════════
// 2. 混合模型方程组 (MME) — BLUP 动物模型
// ══════════════════════════════════════════════

/**
 * 构建并求解混合模型方程组
 *
 * 模型: y = Xb + Za + e
 * MME: [X'X   X'Z        ] [b̂] = [X'y    ]
 *      [Z'X   Z'Z + A⁻¹α ] [â]   [Z'y    ]
 *
 * @param {number[]} y - 表型观测值向量
 * @param {number[][]} X - 固定效应设计矩阵
 * @param {number[][]} Z - 随机效应设计矩阵
 * @param {number[][]} A - 亲缘关系矩阵
 * @param {number} sigmaE2 - 残差方差 σ²_e
 * @param {number} sigmaA2 - 加性遗传方差 σ²_a
 * @returns {{ blue: number[], blup: number[], lhs: number[][], rhs: number[], steps: Array }}
 */
export function solveMME(y, X, Z, A, sigmaE2, sigmaA2) {
  const alpha = sigmaE2 / sigmaA2;
  const n = y.length;
  const p = X[0].length; // 固定效应参数个数
  const q = Z[0].length; // 随机效应参数个数（动物数）

  const steps = [];

  // 转为 Matrix 对象
  const yMat = Matrix.columnVector(y);
  const XMat = new Matrix(X);
  const ZMat = new Matrix(Z);

  // 计算各子矩阵
  const XtX = XMat.transpose().mmul(XMat);
  const XtZ = XMat.transpose().mmul(ZMat);
  const ZtX = ZMat.transpose().mmul(XMat);
  const ZtZ = ZMat.transpose().mmul(ZMat);
  const Xty = XMat.transpose().mmul(yMat);
  const Zty = ZMat.transpose().mmul(yMat);

  steps.push({
    step: 1,
    title: '计算方差比 α = σ²_e / σ²_a',
    detail: `α = ${sigmaE2} / ${sigmaA2} = ${alpha.toFixed(4)}`
  });

  steps.push({
    step: 2,
    title: "构建 X'X, X'Z, Z'X, Z'Z",
    XtX: XtX.to2DArray(),
    XtZ: XtZ.to2DArray(),
    ZtZ: ZtZ.to2DArray()
  });

  // A‾¹
  const Ainv = inverse(new Matrix(A));
  const AinvAlpha = Ainv.mul(alpha);

  steps.push({
    step: 3,
    title: "计算 A⁻¹ × α",
    Ainv: Ainv.to2DArray().map(r => r.map(v => +v.toFixed(4))),
    alpha: alpha
  });

  // 构建 LHS (p+q) × (p+q) 左端矩阵
  const dim = p + q;
  const lhs = Array.from({ length: dim }, () => Array(dim).fill(0));
  const rhs = Array(dim).fill(0);

  // 填充 LHS
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) lhs[i][j] = XtX.get(i, j);
    for (let j = 0; j < q; j++) lhs[i][p + j] = XtZ.get(i, j);
  }
  for (let i = 0; i < q; i++) {
    for (let j = 0; j < p; j++) lhs[p + i][j] = ZtX.get(i, j);
    for (let j = 0; j < q; j++) lhs[p + i][p + j] = ZtZ.get(i, j) + AinvAlpha.get(i, j);
  }

  // 填充 RHS
  for (let i = 0; i < p; i++) rhs[i] = Xty.get(i, 0);
  for (let i = 0; i < q; i++) rhs[p + i] = Zty.get(i, 0);

  steps.push({
    step: 4,
    title: '组装 MME 左端矩阵 (LHS) 和右端向量 (RHS)',
    lhs: lhs.map(r => r.map(v => +v.toFixed(4))),
    rhs: rhs.map(v => +v.toFixed(4))
  });

  // 求解
  const lhsMat = new Matrix(lhs);
  const rhsMat = Matrix.columnVector(rhs);
  const solution = solve(lhsMat, rhsMat);
  const sol = solution.getColumn(0);

  const blue = sol.slice(0, p);
  const blup = sol.slice(p);

  steps.push({
    step: 5,
    title: '求解 MME：获得 BLUE (固定效应) + BLUP (育种值)',
    blue: blue.map(v => +v.toFixed(4)),
    blup: blup.map(v => +v.toFixed(4))
  });

  return {
    blue,
    blup,
    lhs: lhs.map(r => r.map(v => +v.toFixed(6))),
    rhs: rhs.map(v => +v.toFixed(6)),
    alpha,
    steps
  };
}

// ══════════════════════════════════════════════
// 3. 基因组关系矩阵 (G矩阵) — VanRaden 方法1
// ══════════════════════════════════════════════

/**
 * VanRaden (2008) 方法1 构建基因组关系矩阵
 *
 * G = ZZ' / (2 Σ p_j(1-p_j))
 * Z_{ij} = M_{ij} - 2p_j  (中心化)
 *
 * @param {number[][]} genotypes - n×m 基因型矩阵（0/1/2编码）
 * @returns {{ G: number[][], Z: number[][], freqs: number[] }}
 */
export function buildGMatrix(genotypes) {
  const n = genotypes.length;
  const m = genotypes[0].length;

  // 计算等位基因频率
  const freqs = Array(m).fill(0);
  for (let j = 0; j < m; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += genotypes[i][j];
    freqs[j] = sum / (2 * n);
  }

  // 中心化 Z = M - 2p
  const Z = genotypes.map(row =>
    row.map((val, j) => val - 2 * freqs[j])
  );

  // 缩放因子 2 * Σ p_j(1-p_j)
  let scale = 0;
  for (let j = 0; j < m; j++) {
    scale += 2 * freqs[j] * (1 - freqs[j]);
  }

  // G = ZZ' / scale
  const ZMat = new Matrix(Z);
  const G = ZMat.mmul(ZMat.transpose()).div(scale).to2DArray();

  return { G, Z, freqs, scale };
}

// ══════════════════════════════════════════════
// 4. Monte Carlo 育种仿真引擎
// ══════════════════════════════════════════════

/**
 * 运行育种仿真——基于无限位点模型 (infinitesimal model)
 *
 * @param {Object} params
 * @param {number} params.h2 - 遗传力
 * @param {number} params.intensity - 选择强度 i
 * @param {number} params.genInterval - 世代间隔 L (年)
 * @param {number} params.popSize - 群体大小 N
 * @param {number} params.nGenerations - 模拟世代数
 * @param {number} params.initMean - 初始群体均值
 * @param {number} params.phenoVar - 表型方差 VP
 * @param {'random'|'avoidance'|'optimal'} params.matingStrategy - 交配策略
 * @param {number} [params.seed] - 随机种子（for reproducibility）
 * @returns {{ generations: Array, summary: Object }}
 */
export function runBreedingSimulation(params) {
  const {
    h2, intensity, genInterval, popSize, nGenerations,
    initMean = 100, phenoVar = 100, matingStrategy = 'random'
  } = params;

  const sigmaA = Math.sqrt(h2 * phenoVar);
  const sigmaE = Math.sqrt((1 - h2) * phenoVar);
  const sigmaP = Math.sqrt(phenoVar);

  // 选择反应 ΔG = i × h² × σP
  const deltaGExpected = intensity * h2 * sigmaP;

  // Simple pseudo-random with seed
  let _seed = params.seed || Date.now();
  function random() {
    _seed = (_seed * 16807 + 0) % 2147483647;
    return (_seed & 0x7fffffff) / 0x7fffffff;
  }

  // Box-Muller 变换生成正态分布
  function randn() {
    let u, v, s;
    do {
      u = 2 * random() - 1;
      v = 2 * random() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    return u * Math.sqrt(-2 * Math.log(s) / s);
  }

  // 初始化群体
  let population = [];
  for (let i = 0; i < popSize; i++) {
    const bv = initMean + sigmaA * randn();
    const pheno = bv + sigmaE * randn();
    population.push({
      id: i,
      bv,
      pheno,
      sire: null,
      dam: null,
      inbreeding: 0
    });
  }

  const generations = [{
    gen: 0,
    meanBV: mean(population.map(p => p.bv)),
    meanPheno: mean(population.map(p => p.pheno)),
    varBV: variance(population.map(p => p.bv)),
    deltaG: 0,
    meanF: 0,
    popSize: popSize
  }];

  for (let gen = 1; gen <= nGenerations; gen++) {
    // 按表型排序（选择）
    population.sort((a, b) => b.pheno - a.pheno);

    // 选择前 proportion 个体作为亲本
    const nSelected = Math.max(4, Math.floor(popSize * getSelectionProportion(intensity)));
    const nSires = Math.max(2, Math.floor(nSelected * 0.4));
    const nDams = Math.max(2, nSelected - nSires);
    const sires = population.slice(0, nSires);
    const dams = population.slice(nSires, nSires + nDams);

    // 配种与生成后代
    const offspring = [];
    for (let i = 0; i < popSize; i++) {
      let sire, dam;

      if (matingStrategy === 'avoidance') {
        // 避免近交——选择亲缘关系最远的父母
        sire = sires[i % nSires];
        dam = dams[(i + Math.floor(nSires / 2)) % nDams];
      } else if (matingStrategy === 'optimal') {
        // 最优贡献选择：限制每头公畜的后代数
        const maxPerSire = Math.ceil(popSize / nSires);
        const sireIdx = Math.min(Math.floor(i / maxPerSire), nSires - 1);
        sire = sires[sireIdx];
        dam = dams[i % nDams];
      } else {
        // 随机配种
        sire = sires[Math.floor(random() * nSires)];
        dam = dams[Math.floor(random() * nDams)];
      }

      const midParentBV = 0.5 * (sire.bv + dam.bv);
      const mendelianSampling = 0.5 * sigmaA * Math.sqrt(1 - 0.5 * (sire.inbreeding + dam.inbreeding)) * randn();
      const bv = midParentBV + mendelianSampling;
      const pheno = bv + sigmaE * randn();

      // 简化近交系数估计
      const F = (sire.id === dam.id) ? 0.25 :
        (sire.sire === dam.sire && sire.sire !== null) ? 0.125 :
        0.01 * gen;

      offspring.push({ id: gen * popSize + i, bv, pheno, sire: sire.id, dam: dam.id, inbreeding: Math.min(F, 0.5) });
    }

    population = offspring;

    const genMeanBV = mean(population.map(p => p.bv));
    const genMeanF = mean(population.map(p => p.inbreeding));

    generations.push({
      gen,
      meanBV: genMeanBV,
      meanPheno: mean(population.map(p => p.pheno)),
      varBV: variance(population.map(p => p.bv)),
      deltaG: genMeanBV - generations[gen - 1].meanBV,
      meanF: genMeanF,
      cumulativeDeltaG: genMeanBV - generations[0].meanBV,
      popSize
    });
  }

  return {
    generations,
    summary: {
      expectedDeltaG: deltaGExpected,
      actualDeltaG: mean(generations.slice(1).map(g => g.deltaG)),
      totalGain: generations[nGenerations].meanBV - generations[0].meanBV,
      finalF: generations[nGenerations].meanF,
      efficiency: (generations[nGenerations].meanBV - generations[0].meanBV) / nGenerations
    }
  };
}

function getSelectionProportion(i) {
  // 近似：选择强度 i 对应的选留比例 p
  if (i >= 2.4) return 0.02;
  if (i >= 2.0) return 0.05;
  if (i >= 1.76) return 0.10;
  if (i >= 1.4) return 0.20;
  if (i >= 1.0) return 0.35;
  if (i >= 0.8) return 0.45;
  return 0.50;
}

// ══════════════════════════════════════════════
// 5. 间隔复习 SM-2 算法
// ══════════════════════════════════════════════

/**
 * SM-2 间隔复习算法
 *
 * @param {Object} item
 * @param {number} item.easeFactor - 难度系数 (初始 2.5)
 * @param {number} item.interval - 当前间隔天数
 * @param {number} item.repetitions - 连续正确次数
 * @param {number} quality - 回答质量 (0-5, 5=完美)
 * @returns {{ easeFactor: number, interval: number, repetitions: number, nextReview: Date }}
 */
export function sm2Algorithm(item, quality) {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = item;

  if (quality >= 3) {
    // 正确
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  } else {
    // 错误：重置
    repetitions = 0;
    interval = 1;
  }

  // 更新 EF
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReview };
}

// ══════════════════════════════════════════════
// 6. 数量遗传参数计算
// ══════════════════════════════════════════════

/**
 * 计算遗传参数
 */
export function calcGeneticParams(VA, VD, VE) {
  const VP = VA + VD + VE;
  const h2_broad = VP > 0 ? (VA + VD) / VP : 0;
  const h2_narrow = VP > 0 ? VA / VP : 0;
  return {
    VP,
    h2_broad,
    h2_narrow,
    VA, VD, VE,
    ratioVA: VP > 0 ? VA / VP * 100 : 0,
    ratioVD: VP > 0 ? VD / VP * 100 : 0,
    ratioVE: VP > 0 ? VE / VP * 100 : 0
  };
}

/**
 * 计算选择反应
 * ΔG = i × h² × σP = i × σA² / σP
 */
export function calcSelectionResponse(i, h2, sigmaP) {
  return i * h2 * sigmaP;
}

/**
 * 生成正态分布概率密度数据
 */
export function normalPDF(mean, variance, nPoints = 200) {
  const sigma = Math.sqrt(variance);
  const xMin = mean - 4 * sigma;
  const xMax = mean + 4 * sigma;
  const step = (xMax - xMin) / nPoints;
  const data = [];

  for (let x = xMin; x <= xMax; x += step) {
    const z = (x - mean) / sigma;
    const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    data.push([+x.toFixed(3), +pdf.toFixed(6)]);
  }

  return data;
}

// ══════════════════════════════════════════════
// 辅助工具函数
// ══════════════════════════════════════════════

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
}

export { mean, variance };
