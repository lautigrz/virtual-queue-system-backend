export const calculateProgress = (initialAhead, currentAhead) => {

    const initial = parseInt(initialAhead);
    const current = parseInt(currentAhead);
    if (initial === 0) return 100;

    const progressed = ((initial - current) / initial) * 100;

    return Math.max(0, Math.min(100, Math.round(progressed)));

}
