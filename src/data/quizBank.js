/**
 * 题库数据 — 覆盖全部11章，包含选择题、判断题、计算题
 * Quiz Bank — All 11 chapters, choice / true_false / numeric types
 */
export const quizBank = [
    // ═══════════════════════════════════════════════
    // 第一章 绪论（家畜育种学概述）
    // ═══════════════════════════════════════════════
    {
        id: 'q1_01', chapter: 0, type: 'choice', difficulty: 1,
        stem: '家畜育种学的核心任务是什么？',
        options: [
            'A. 提高饲料转化率',
            'B. 改良家畜群体的遗传素质，培育新品种',
            'C. 防治家畜疾病',
            'D. 改良畜舍设计'
        ],
        answer: 'B',
        explanation: '家畜育种学是研究如何改良家畜群体遗传素质、提高生产性能、培育新品种和品系以及保护利用动物遗传资源的科学。',
        misconceptions: ['容易与饲养管理或兽医学混淆'],
        tags: ['绪论', '基本概念'],
    },
    {
        id: 'q1_02', chapter: 0, type: 'true_false', difficulty: 1,
        stem: '品种是人工选择的产物，具有一定的经济价值和遗传稳定性。',
        answer: true,
        explanation: '品种（breed）是人工选择条件下形成的，具有特定的生物学和经济学特性，能够适应一定的自然环境和社会经济条件，并能稳定遗传的家畜类群。',
        tags: ['绪论', '品种'],
    },
    {
        id: 'q1_03', chapter: 0, type: 'choice', difficulty: 2,
        stem: '以下哪项不属于家畜育种的基本方法？',
        options: [
            'A. 选择育种',
            'B. 杂交育种',
            'C. 分子育种',
            'D. 气候驯化'
        ],
        answer: 'D',
        explanation: '家畜育种的基本方法包括选择育种、杂交育种和分子育种等。气候驯化是环境适应过程，不是育种方法。',
        tags: ['绪论', '育种方法'],
    },
    {
        id: 'q1_04', chapter: 0, type: 'choice', difficulty: 2,
        stem: '关于生物多样性的保护，以下说法正确的是：',
        options: [
            'A. 只需保护野生动物，家畜品种不存在灭绝风险',
            'B. 遗传多样性是物种适应环境变化的基础',
            'C. 高产品种已能满足所有需求，地方品种无保留价值',
            'D. 保种工作应仅在自然保护区开展'
        ],
        answer: 'B',
        explanation: '遗传多样性是生物进化和适应的基础。许多地方品种携带独特的适应性基因，对未来育种具有重要价值。',
        tags: ['绪论', '遗传资源'],
    },

    // ═══════════════════════════════════════════════
    // 第二章 家畜的起源与驯化
    // ═══════════════════════════════════════════════
    {
        id: 'q2_01', chapter: 1, type: 'choice', difficulty: 2,
        stem: '以下关于家畜驯化的描述，哪项是正确的？',
        options: [
            'A. 所有家畜都在同一时期被驯化',
            'B. 驯化过程中动物的遗传组成不会发生改变',
            'C. 驯化是人工选择和自然选择共同作用的结果',
            'D. 驯化只涉及行为改变，不涉及形态变化'
        ],
        answer: 'C',
        explanation: '驯化是一个复杂的过程，包含了人工选择（人类有意或无意选择温顺、易管理的个体）和自然选择（适应人工环境）的共同作用，涉及遗传组成、行为、形态等多方面变化。',
        tags: ['驯化', '进化'],
    },
    {
        id: 'q2_02', chapter: 1, type: 'true_false', difficulty: 1,
        stem: '牛的驯化历史大约可追溯到1万年前的新石器时代。',
        answer: true,
        explanation: '考古学证据表明，牛大约在10000年前的新石器时代被驯化，最早的驯化地点在西南亚的新月沃地。',
        tags: ['驯化', '起源'],
    },

    // ═══════════════════════════════════════════════
    // 第三章 遗传学基础
    // ═══════════════════════════════════════════════
    {
        id: 'q3_01', chapter: 2, type: 'choice', difficulty: 2,
        stem: '在Hardy-Weinberg平衡下，基因型频率AA=0.49, Aa=0.42, aa=0.09，等位基因A的频率为：',
        options: [
            'A. 0.49',
            'B. 0.70',
            'C. 0.60',
            'D. 0.80'
        ],
        answer: 'B',
        explanation: 'p(A) = f(AA) + ½f(Aa) = 0.49 + 0.5×0.42 = 0.49 + 0.21 = 0.70',
        misconceptions: ['将AA频率直接当作A频率', '忘记加上杂合子中的一半'],
        tags: ['群体遗传学', 'Hardy-Weinberg'],
    },
    {
        id: 'q3_02', chapter: 2, type: 'numeric', difficulty: 3,
        stem: '一个群体中，B等位基因频率q=0.3。在Hardy-Weinberg平衡下，杂合子Bb的频率是多少？（保留2位小数）',
        answer: 0.42,
        explanation: '杂合子频率 = 2pq = 2 × 0.7 × 0.3 = 0.42',
        tags: ['群体遗传学', 'Hardy-Weinberg'],
    },
    {
        id: 'q3_03', chapter: 2, type: 'true_false', difficulty: 2,
        stem: '遗传漂变对大群体的基因频率变化影响最大。',
        answer: false,
        explanation: '遗传漂变对小群体的基因频率变化影响最大。大群体中由于个体数量多，随机波动的影响被平均化，基因频率变化较小。',
        tags: ['群体遗传学', '遗传漂变'],
    },

    // ═══════════════════════════════════════════════
    // 第四章 数量性状遗传基础
    // ═══════════════════════════════════════════════
    {
        id: 'q4_01', chapter: 3, type: 'choice', difficulty: 2,
        stem: '表型方差VP的分解正确的是：',
        options: [
            'A. VP = VA + VE',
            'B. VP = VA + VD + VE',
            'C. VP = VG + VE，其中VG = VA + VD + VI',
            'D. VP = h² × VE'
        ],
        answer: 'C',
        explanation: '表型方差 VP = VG + VE。其中遗传方差 VG 可进一步分解为加性遗传方差 VA、显性方差 VD 和上位互作方差 VI。简化模型中忽略VI和VD时，VP = VA + VD + VE。',
        misconceptions: ['忽略上位互作方差', '将遗传力公式反推作方差分解公式'],
        tags: ['数量遗传学', '方差分解'],
    },
    {
        id: 'q4_02', chapter: 3, type: 'numeric', difficulty: 2,
        stem: '某性状的加性遗传方差VA=60，显性方差VD=10，环境方差VE=30。狭义遗传力h²是多少？（保留2位小数）',
        answer: 0.60,
        explanation: 'VP = VA + VD + VE = 60 + 10 + 30 = 100，h² = VA / VP = 60/100 = 0.60',
        tags: ['数量遗传学', '遗传力'],
    },
    {
        id: 'q4_03', chapter: 3, type: 'choice', difficulty: 3,
        stem: '以下哪个性状通常具有最高的遗传力？',
        options: [
            'A. 产仔数',
            'B. 体高',
            'C. 受胎率',
            'D. 产蛋率'
        ],
        answer: 'B',
        explanation: '体尺性状（如体高）通常具有较高的遗传力（0.4-0.7），而繁殖性状（如产仔数、受胎率）的遗传力通常较低（0.05-0.15）。',
        tags: ['数量遗传学', '遗传力'],
    },
    {
        id: 'q4_04', chapter: 3, type: 'true_false', difficulty: 2,
        stem: '遗传力的取值范围为0到1，遗传力越高说明该性状受遗传因素影响越大。',
        answer: true,
        explanation: '狭义遗传力 h² = VA/VP，取值在0-1之间。h²越接近1，说明表型变异中由加性遗传效应解释的比例越大，个体选择的效果越好。',
        tags: ['数量遗传学', '遗传力'],
    },

    // ═══════════════════════════════════════════════
    // 第五章 选择原理
    // ═══════════════════════════════════════════════
    {
        id: 'q5_01', chapter: 4, type: 'choice', difficulty: 2,
        stem: '育种者方程（ΔG = i × h² × σP）中，i代表：',
        options: [
            'A. 遗传力',
            'B. 选择强度',
            'C. 遗传进展',
            'D. 世代间隔'
        ],
        answer: 'B',
        explanation: '在育种者方程中：ΔG=遗传进展，i=选择强度（标准化选择差），h²=遗传力，σP=表型标准差。',
        tags: ['选择原理', '育种者方程'],
    },
    {
        id: 'q5_02', chapter: 4, type: 'numeric', difficulty: 3,
        stem: '某性状遗传力h²=0.30，选择强度i=1.76，表型标准差σP=10。预期每代遗传进展ΔG为多少？（保留1位小数）',
        answer: 5.3,
        explanation: 'ΔG = i × h² × σP = 1.76 × 0.30 × 10 = 5.28 ≈ 5.3',
        tags: ['选择原理', '遗传进展'],
    },
    {
        id: 'q5_03', chapter: 4, type: 'choice', difficulty: 3,
        stem: '以下哪种情况会导致年遗传进展（ΔG/L）最大？',
        options: [
            'A. h²=0.2, i=1.5, L=6年',
            'B. h²=0.4, i=1.76, L=5年',
            'C. h²=0.3, i=2.0, L=3年',
            'D. h²=0.5, i=1.0, L=4年'
        ],
        answer: 'C',
        explanation: 'A: 0.2×1.5/6=0.05σP, B: 0.4×1.76/5=0.141σP, C: 0.3×2.0/3=0.200σP, D: 0.5×1.0/4=0.125σP。C选项的年遗传进展最大。',
        misconceptions: ['只看遗传力而忽略世代间隔'],
        tags: ['选择原理', '年遗传进展'],
    },
    {
        id: 'q5_04', chapter: 4, type: 'true_false', difficulty: 2,
        stem: '缩短世代间隔是提高年遗传进展的有效途径之一。',
        answer: true,
        explanation: '年遗传进展 = ΔG/L，其中L为世代间隔。缩短L可以在每年内获得更多的遗传改良，例如基因组选择通过在年轻时选种来缩短世代间隔。',
        tags: ['选择原理', '世代间隔'],
    },

    // ═══════════════════════════════════════════════
    // 第六章 个体遗传评定
    // ═══════════════════════════════════════════════
    {
        id: 'q6_01', chapter: 5, type: 'choice', difficulty: 2,
        stem: 'BLUP方法的全称是什么？',
        options: [
            'A. Best Linear Unbiased Prediction',
            'B. Best Logarithmic Unbiased Prediction',
            'C. Basic Linear Unified Prediction',
            'D. Best Linear Universal Procedure'
        ],
        answer: 'A',
        explanation: 'BLUP = Best Linear Unbiased Prediction（最佳线性无偏预测），由C.R. Henderson于1950年代提出，是当前动物育种中估计育种值的标准方法。',
        tags: ['遗传评定', 'BLUP'],
    },
    {
        id: 'q6_02', chapter: 5, type: 'choice', difficulty: 3,
        stem: '在混合模型方程（MME）中，α = σ²e/σ²a 的值越大说明：',
        options: [
            'A. 遗传力越高',
            'B. 遗传力越低',
            'C. 环境方差为零',
            'D. 与遗传力无关'
        ],
        answer: 'B',
        explanation: 'α = σ²e/σ²a。当α增大，说明残差方差相对于加性遗传方差增大，即h² = σ²a/(σ²a + σ²e)减小，遗传力越低。在MME中，较大的α意味着对育种值的收缩（shrinkage）更强。',
        misconceptions: ['混淆α与h²的关系方向'],
        tags: ['遗传评定', 'MME'],
    },
    {
        id: 'q6_03', chapter: 5, type: 'numeric', difficulty: 2,
        stem: '若残差方差σ²e=60，加性遗传方差σ²a=20，方差比α等于多少？',
        answer: 3,
        explanation: 'α = σ²e / σ²a = 60 / 20 = 3',
        tags: ['遗传评定', '方差比'],
    },
    {
        id: 'q6_04', chapter: 5, type: 'true_false', difficulty: 2,
        stem: 'A矩阵（亲缘关系矩阵）的对角元素 a_ii = 1 + F_i，其中F_i为个体i的近交系数。',
        answer: true,
        explanation: '在A矩阵中，对角元素a_ii = 1 + F_i反映了个体与自身的"亲缘关系"，F_i为该个体的近交系数。非近交个体的F_i=0，对角元素为1。',
        tags: ['遗传评定', 'A矩阵'],
    },

    // ═══════════════════════════════════════════════
    // 第七章 选择方法
    // ═══════════════════════════════════════════════
    {
        id: 'q7_01', chapter: 6, type: 'choice', difficulty: 2,
        stem: '以下哪种选择方法对低遗传力性状最有效？',
        options: [
            'A. 个体选择（mass selection）',
            'B. 家系选择（family selection）',
            'C. 家系内选择（within-family selection）',
            'D. 独立淘汰法'
        ],
        answer: 'B',
        explanation: '对于低遗传力性状（h²<0.15），由于个体表型与育种值之间的相关性低，单独依据个体表型选择效果差。家系选择利用家系均值信息提高选择准确度，对低遗传力性状更有效。',
        tags: ['选择方法', '家系选择'],
    },
    {
        id: 'q7_02', chapter: 6, type: 'choice', difficulty: 2,
        stem: '综合选择指数法的优点是：',
        options: [
            'A. 操作简单，不需要遗传参数',
            'B. 能同时改良多个性状并使总遗传进展最大化',
            'C. 只适用于单性状选择',
            'D. 不需要经济价值信息'
        ],
        answer: 'B',
        explanation: '综合选择指数将各性状的遗传参数和经济权重纳入统一方程，使得总体遗传价值（aggregate genotype）的改良速度最大化。',
        tags: ['选择方法', '选择指数'],
    },
    {
        id: 'q7_03', chapter: 6, type: 'true_false', difficulty: 2,
        stem: '独立淘汰法要求每个性状都设定最低标准，只有全部达标的个体才能被选留。',
        answer: true,
        explanation: '独立淘汰法（Independent Culling Levels）为每个目标性状设定一个最低标准，个体必须在所有性状上都达到标准才能入选，任一性状不达标即被淘汰。',
        tags: ['选择方法', '独立淘汰法'],
    },

    // ═══════════════════════════════════════════════
    // 第八章 交配制度（近交与杂交）
    // ═══════════════════════════════════════════════
    {
        id: 'q8_01', chapter: 7, type: 'choice', difficulty: 2,
        stem: '以下关于近交系数F的描述，正确的是：',
        options: [
            'A. F值越高表示遗传多样性越高',
            'B. F = 0 表示该个体双亲完全不相关',
            'C. F值范围为-1到1',
            'D. 近交必然导致生产性能下降'
        ],
        answer: 'B',
        explanation: 'F=0表示个体双亲之间没有共同祖先（在已知系谱范围内）。F的取值范围通常为0到1，F越大说明纯合比例越高、遗传多样性越低。近交退化的程度与性状的遗传机制有关。',
        tags: ['近交', '近交系数'],
    },
    {
        id: 'q8_02', chapter: 7, type: 'numeric', difficulty: 3,
        stem: '半同胞（同父异母或同母异父）交配所生后代的近交系数F为多少？（精确分数形式，保留4位小数）',
        answer: 0.0625,
        explanation: '半同胞间只有一个共同祖先（共同的父或母），通过系谱路径计算：F = Σ[(1/2)^(n1+n2+1)] = (1/2)^3 = 0.0625',
        tags: ['近交', '近交系数'],
    },
    {
        id: 'q8_03', chapter: 7, type: 'choice', difficulty: 2,
        stem: '杂种优势（heterosis）的遗传学基础主要包括：',
        options: [
            'A. 显性假说和超显性假说',
            'B. 连锁不平衡和基因重组',
            'C. 突变和遗传漂变',
            'D. 基因组印记和表观遗传'
        ],
        answer: 'A',
        explanation: '杂种优势的经典遗传学解释包括显性假说（有利显性等位基因互补）和超显性假说（杂合子本身具有优势）。现代研究还涉及上位互作等，但经典理论仍是核心。',
        tags: ['杂交', '杂种优势'],
    },

    // ═══════════════════════════════════════════════
    // 第九章 品种与品系
    // ═══════════════════════════════════════════════
    {
        id: 'q9_01', chapter: 8, type: 'choice', difficulty: 2,
        stem: '品系（line/strain）与品种（breed）的关系是：',
        options: [
            'A. 品系是品种的下级分类单位',
            'B. 品系等同于品种',
            'C. 品种是品系的下级分类单位',
            'D. 两者没有任何关系'
        ],
        answer: 'A',
        explanation: '品系是品种内的一个遗传分化群体，具有更高的遗传一致性和特定的特点。品系是品种的下级分化单位，品种可以包含多个品系。',
        tags: ['品系', '分类'],
    },
    {
        id: 'q9_02', chapter: 8, type: 'true_false', difficulty: 2,
        stem: '近交系的培育需要多代连续近交（F≥0.375），使群体在目标性状上达到较高的纯合度。',
        answer: true,
        explanation: '近交系通常要求近交系数达到0.375以上，甚至在实验动物中要求F接近1.0（如小鼠近交系经20代以上兄妹交配）。高纯合度确保了群体的遗传一致性。',
        tags: ['品系', '近交系'],
    },
    {
        id: 'q9_03', chapter: 8, type: 'choice', difficulty: 2,
        stem: '以下哪种杂交方式最常用于商品生产中利用杂种优势？',
        options: [
            'A. 级进杂交',
            'B. 三元杂交 / 终端杂交',
            'C. 回交',
            'D. 纯繁'
        ],
        answer: 'B',
        explanation: '三元杂交（也称终端杂交）常用于商品生产，利用三个品种的互补优势最大化杂种优势。典型例子如猪的杜洛克×长白×大白三元杂交。',
        tags: ['杂交', '杂交体系'],
    },

    // ═══════════════════════════════════════════════
    // 第十章 基因组选择
    // ═══════════════════════════════════════════════
    {
        id: 'q10_01', chapter: 9, type: 'choice', difficulty: 2,
        stem: 'G矩阵（基因组关系矩阵）与A矩阵的核心区别是：',
        options: [
            'A. G矩阵基于系谱，A矩阵基于标记',
            'B. G矩阵反映实际遗传关系，A矩阵反映期望遗传关系',
            'C. G矩阵只适用于植物，A矩阵适用于动物',
            'D. 两者完全相同'
        ],
        answer: 'B',
        explanation: 'A矩阵基于系谱推导期望的亲缘关系（如全同胞间期望关系系数为0.5），而G矩阵基于SNP标记计算实际的遗传关系，能捕捉Mendelian采样带来的个体间差异。',
        tags: ['基因组选择', 'G矩阵'],
    },
    {
        id: 'q10_02', chapter: 9, type: 'choice', difficulty: 3,
        stem: 'VanRaden方法1构建G矩阵的公式是：',
        options: [
            'A. G = ZZ\' / n',
            'B. G = ZZ\' / 2Σp(1-p)',
            'C. G = XX\' / σ²',
            'D. G = A + ZZ\''
        ],
        answer: 'B',
        explanation: 'VanRaden (2008) 方法1: G = ZZ\' / 2Σpj(1-pj)，其中Z = M - 2P（中心化基因型矩阵），pj为第j个位点的等位基因频率。分母2Σp(1-p)是缩放因子，使G与A在同一尺度上。',
        tags: ['基因组选择', 'VanRaden'],
    },
    {
        id: 'q10_03', chapter: 9, type: 'true_false', difficulty: 2,
        stem: '基因组选择最大的优势之一是可以在动物出生时就获得估计育种值（GEBV），无需等待后裔测验结果。',
        answer: true,
        explanation: '基因组选择（GS）通过高密度SNP芯片的基因型信息就可以预测GEBV，实现了在个体出生或很年轻时即可获得准确度较高的育种值估计，大大缩短了世代间隔。',
        tags: ['基因组选择', 'GEBV'],
    },
    {
        id: 'q10_04', chapter: 9, type: 'choice', difficulty: 3,
        stem: '单步GBLUP (ssGBLUP) 的核心创新是：',
        options: [
            'A. 用G矩阵完全替代A矩阵',
            'B. 通过H矩阵将基因组信息与系谱信息统一，同时利用有、无基因组信息的个体',
            'C. 不需要系谱和表型信息',
            'D. 只使用基因组数据进行预测'
        ],
        answer: 'B',
        explanation: 'ssGBLUP通过构建H矩阵，将G矩阵（有基因组信息的个体）和A矩阵（无基因组信息的个体）统一到一个方程组中，实现一步法遗传评定，无需分步骤处理。',
        tags: ['基因组选择', 'ssGBLUP'],
    },

    // ═══════════════════════════════════════════════
    // 第十一章 育种规划
    // ═══════════════════════════════════════════════
    {
        id: 'q11_01', chapter: 10, type: 'choice', difficulty: 2,
        stem: '育种规划（breeding program design）需要考虑的核心因素不包括：',
        options: [
            'A. 育种目标与选择性状',
            'B. 遗传参数（遗传力、遗传相关）',
            'C. 动物毛色审美偏好',
            'D. 繁殖技术和数据记录系统'
        ],
        answer: 'C',
        explanation: '育种规划需要综合考虑育种目标、选择性状、遗传参数、群体结构、繁殖技术和数据记录系统等因素。毛色审美通常不是影响经济效益的核心因素，不属于育种规划的核心考量。',
        tags: ['育种规划', '基本要素'],
    },
    {
        id: 'q11_02', chapter: 10, type: 'choice', difficulty: 2,
        stem: '开放核心群育种体系（ONBS）与封闭核心群相比的优势是：',
        options: [
            'A. 管理更简单',
            'B. 能从商品群中引入优良基因，扩大选择范围',
            'C. 不需要进行性能测定',
            'D. 遗传进展更慢但更稳定'
        ],
        answer: 'B',
        explanation: '开放核心群育种体系允许商品群中优秀个体"上流"进入核心群，增加了选择群体规模、扩大了遗传变异基础，从而可以获得更大的遗传进展。',
        tags: ['育种规划', 'ONBS'],
    },
    {
        id: 'q11_03', chapter: 10, type: 'true_false', difficulty: 2,
        stem: '在制定育种目标时，应将所有可以测量的性状都纳入选择指标。',
        answer: false,
        explanation: '育种目标应聚焦于对经济效益影响最大的性状。纳入过多性状会分散选择强度，降低各性状的选择准确度和遗传进展。应根据遗传参数和经济权重合理确定选择性状组合。',
        tags: ['育种规划', '育种目标'],
    },
    {
        id: 'q11_04', chapter: 10, type: 'numeric', difficulty: 3,
        stem: '在一个核心群育种方案中，选择4条遗传通路：父→子(ΔG₁=3.2, L₁=6), 父→女(ΔG₂=3.2, L₂=6), 母→子(ΔG₃=1.5, L₃=5), 母→女(ΔG₄=1.5, L₄=5)。平均年遗传进展为多少？（保留2位小数）',
        answer: 0.43,
        explanation: 'ΔG/年 = (ΔG₁+ΔG₂+ΔG₃+ΔG₄)/(L₁+L₂+L₃+L₄) = (3.2+3.2+1.5+1.5)/(6+6+5+5) = 9.4/22 = 0.427 ≈ 0.43',
        tags: ['育种规划', '遗传通路'],
    },
];
