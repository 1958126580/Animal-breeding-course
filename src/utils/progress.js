/**
 * 学习进度管理 — localStorage持久化
 */

const STORAGE_KEY = 'livestock-breeding-progress';

function getProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : getDefaultProgress();
    } catch {
        return getDefaultProgress();
    }
}

function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.warn('无法保存进度:', e);
    }
}

function getDefaultProgress() {
    return {
        chapterProgress: {},   // { [chapterId]: { visited: bool, completed: bool, score: number } }
        quizAttempts: [],       // [{ quizId, answer, correct, timestamp }]
        labRuns: [],            // [{ labType, params, result, timestamp }]
        reviewQueue: [],        // [{ quizId, easeFactor, interval, repetitions, nextReview }]
        studyTime: {},          // { [date]: minutes }
        lastVisit: null,
    };
}

export function loadProgress() {
    return getProgress();
}

export function updateChapterProgress(chapterId, update) {
    const progress = getProgress();
    progress.chapterProgress[chapterId] = {
        ...progress.chapterProgress[chapterId],
        ...update,
        lastVisit: new Date().toISOString(),
    };
    saveProgress(progress);
    return progress;
}

export function addQuizAttempt(attempt) {
    const progress = getProgress();
    progress.quizAttempts.push({
        ...attempt,
        timestamp: new Date().toISOString(),
    });
    saveProgress(progress);
    return progress;
}

export function addLabRun(run) {
    const progress = getProgress();
    progress.labRuns.push({
        ...run,
        timestamp: new Date().toISOString(),
    });
    saveProgress(progress);
    return progress;
}

export function updateReviewQueue(items) {
    const progress = getProgress();
    progress.reviewQueue = items;
    saveProgress(progress);
    return progress;
}

export function addStudyTime(minutes) {
    const progress = getProgress();
    const today = new Date().toISOString().split('T')[0];
    progress.studyTime[today] = (progress.studyTime[today] || 0) + minutes;
    progress.lastVisit = new Date().toISOString();
    saveProgress(progress);
    return progress;
}

export function getQuizStats() {
    const progress = getProgress();
    const attempts = progress.quizAttempts;
    if (attempts.length === 0) return { total: 0, correct: 0, rate: 0, byChapter: {} };

    const correct = attempts.filter(a => a.correct).length;
    const byChapter = {};
    attempts.forEach(a => {
        if (!byChapter[a.chapterId]) byChapter[a.chapterId] = { total: 0, correct: 0 };
        byChapter[a.chapterId].total++;
        if (a.correct) byChapter[a.chapterId].correct++;
    });

    return {
        total: attempts.length,
        correct,
        rate: correct / attempts.length,
        byChapter,
    };
}

export function getStudyTimeHistory(days = 7) {
    const progress = getProgress();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        result.push({
            date: key,
            label: `${date.getMonth() + 1}/${date.getDate()}`,
            minutes: progress.studyTime[key] || 0,
        });
    }
    return result;
}

export function resetProgress() {
    saveProgress(getDefaultProgress());
}
