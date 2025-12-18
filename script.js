// Running Progress Tracker Logic

// Reference date: December 1st, 2025 - completed 7th run of 14km
const referenceDate = new Date('2025-12-01');
const referenceRuns = 7;
const referenceDistance = 14;
const runsInterval = 2; // days between runs

// Initialize with current progress
let state = {
    currentDistance: 14,
    currentRuns: 7,
    startDistance: 2,
    endDistance: 21,
    projectionDate: new Date() // Current date by default
};

// Calculate progress based on date
function calculateProgressForDate(targetDate) {
    const daysDiff = Math.floor((targetDate - referenceDate) / (1000 * 60 * 60 * 24));

    // Calculate how many additional runs should be completed
    const additionalRuns = Math.floor(daysDiff / runsInterval);

    // Start from reference point
    let currentDist = referenceDistance;
    let currentRun = referenceRuns + additionalRuns;

    // Calculate which distance level and run count
    while (currentRun > getRunsNeeded(currentDist)) {
        currentRun -= getRunsNeeded(currentDist);
        currentDist++;

        // Cap at end distance
        if (currentDist > state.endDistance) {
            currentDist = state.endDistance;
            currentRun = getRunsNeeded(currentDist);
            break;
        }
    }

    return {
        distance: currentDist,
        runs: currentRun
    };
}

// Load state from localStorage if available
function loadState() {
    // Don't load from localStorage - always calculate from date
    return;
}

// Save state to localStorage
function saveState() {
    // Don't save to localStorage - always calculate from date
    return;
}

// Calculate total runs needed for a distance level
function getRunsNeeded(distance) {
    return distance;
}

// Calculate all levels from start to end
function getAllLevels() {
    const levels = [];
    for (let dist = state.startDistance; dist <= state.endDistance; dist++) {
        levels.push({
            distance: dist,
            runsNeeded: getRunsNeeded(dist),
            totalDistance: dist * getRunsNeeded(dist)
        });
    }
    return levels;
}

// Calculate total distance run so far
function getTotalDistanceRun() {
    let total = 0;

    // Add all completed levels
    for (let dist = state.startDistance; dist < state.currentDistance; dist++) {
        total += dist * getRunsNeeded(dist);
    }

    // Add current level progress
    total += state.currentDistance * state.currentRuns;

    return total;
}

// Calculate overall progress percentage
function getOverallProgress() {
    const levels = getAllLevels();
    const totalDistanceGoal = levels.reduce((sum, level) => sum + level.totalDistance, 0);
    const distanceRun = getTotalDistanceRun();
    return (distanceRun / totalDistanceGoal * 100).toFixed(1);
}

// Calculate total runs completed
function getTotalRunsCompleted() {
    let total = 0;

    // Add all completed levels
    for (let dist = state.startDistance; dist < state.currentDistance; dist++) {
        total += getRunsNeeded(dist);
    }

    // Add current level progress
    total += state.currentRuns;

    return total;
}

// Calculate projected finish date
function calculateProjectedFinish() {
    // Calculate remaining runs from current position
    let remainingRuns = 0;

    // Runs left at current level
    remainingRuns += getRunsNeeded(state.currentDistance) - state.currentRuns;

    // All runs at future levels
    for (let dist = state.currentDistance + 1; dist <= state.endDistance; dist++) {
        remainingRuns += getRunsNeeded(dist);
    }

    // Calculate finish date: projection date + (remaining runs * 2 days)
    const finishDate = new Date(state.projectionDate.getTime() + (remainingRuns * runsInterval * 24 * 60 * 60 * 1000));

    return finishDate;
}

// Format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update all statistics displays
function updateStats() {
    document.getElementById('currentDistance').textContent = `${state.currentDistance} km`;
    document.getElementById('runsCompleted').textContent =
        `${state.currentRuns} / ${getRunsNeeded(state.currentDistance)}`;
    document.getElementById('totalDistance').textContent = `${getTotalDistanceRun()} km`;
    document.getElementById('overallProgress').textContent = `${getOverallProgress()}%`;

    // Update projected finish date
    const finishDate = calculateProjectedFinish();
    document.getElementById('projectedFinish').textContent = formatDate(finishDate);

    // Update current level progress bar
    const progressPercent = (state.currentRuns / getRunsNeeded(state.currentDistance)) * 100;
    const progressBar = document.getElementById('currentLevelProgress');
    progressBar.style.width = `${progressPercent}%`;
    progressBar.textContent = progressPercent > 10 ? `${progressPercent.toFixed(0)}%` : '';

    // Update progress info
    const runsLeft = getRunsNeeded(state.currentDistance) - state.currentRuns;
    document.getElementById('progressInfo').textContent =
        runsLeft > 0
            ? `${runsLeft} more run${runsLeft !== 1 ? 's' : ''} of ${state.currentDistance}km to level up!`
            : 'Level complete! Click "Complete a Run" to move to the next level.';

    // Update summary stats
    const levels = getAllLevels();
    const totalRuns = levels.reduce((sum, level) => sum + level.runsNeeded, 0);
    const totalDistanceGoal = levels.reduce((sum, level) => sum + level.totalDistance, 0);
    const runsCompleted = getTotalRunsCompleted();
    const distanceRun = getTotalDistanceRun();

    document.getElementById('totalRuns').textContent = totalRuns;
    document.getElementById('totalDistanceGoal').textContent = `${totalDistanceGoal} km`;
    document.getElementById('runsRemaining').textContent = totalRuns - runsCompleted;
    document.getElementById('distanceRemaining').textContent = `${totalDistanceGoal - distanceRun} km`;

    // Update projection grid
    updateProjections();

    // Update charts
    updateCharts();
}

// Update projection grid showing all levels
function updateProjections() {
    const grid = document.getElementById('projectionGrid');
    const levels = getAllLevels();

    grid.innerHTML = '';

    levels.forEach(level => {
        const item = document.createElement('div');
        item.className = 'projection-item';

        // Mark completed levels
        if (level.distance < state.currentDistance) {
            item.classList.add('completed');
        }

        // Mark current level
        if (level.distance === state.currentDistance) {
            item.classList.add('current');

            // Add liquid element for current level
            const liquid = document.createElement('div');
            liquid.className = 'liquid';

            // Calculate fill percentage
            const fillPercent = (state.currentRuns / getRunsNeeded(state.currentDistance)) * 100;
            liquid.style.height = `${fillPercent}%`;

            item.appendChild(liquid);
        }

        item.innerHTML += `
            <div class="projection-distance">${level.distance}km</div>
            <div class="projection-runs">${level.runsNeeded} runs</div>
        `;

        grid.appendChild(item);
    });
}

// Create and update charts
function updateCharts() {
    updateProgressRiver();
    updateJourneyWidget();
    updateMountainWidget();
}

// Progress river showing journey as horizontal segments
function updateProgressRiver() {
    const river = document.getElementById('progressRiver');
    const levels = getAllLevels();

    // Create the river track with segments
    const track = document.createElement('div');
    track.className = 'river-track';

    levels.forEach(level => {
        const segment = document.createElement('div');
        segment.className = 'river-segment';

        const isCompleted = level.distance < state.currentDistance;
        const isCurrent = level.distance === state.currentDistance;

        if (isCompleted) segment.classList.add('completed');
        if (isCurrent) segment.classList.add('current');

        segment.innerHTML = `<div class="river-segment-label">${level.distance}</div>`;

        // Tooltip on hover
        segment.title = `${level.distance}km - ${level.runsNeeded} runs`;

        track.appendChild(segment);
    });

    // Create labels
    const labels = document.createElement('div');
    labels.className = 'river-labels';
    labels.innerHTML = `
        <div class="river-label">2km Start</div>
        <div class="river-label">21km Goal</div>
    `;

    // Create stats
    const totalKmCompleted = getTotalDistanceRun();
    const levels2 = getAllLevels();
    const totalKmGoal = levels2.reduce((sum, level) => sum + level.totalDistance, 0);
    const levelsCompleted = state.currentDistance - state.startDistance + (state.currentRuns > 0 ? 1 : 0);

    const stats = document.createElement('div');
    stats.className = 'river-stats';
    stats.innerHTML = `
        <div class="river-stat">
            <div class="river-stat-value">${levelsCompleted}</div>
            <div class="river-stat-label">Levels In Progress</div>
        </div>
        <div class="river-stat">
            <div class="river-stat-value">${totalKmCompleted}</div>
            <div class="river-stat-label">Total KM Run</div>
        </div>
        <div class="river-stat">
            <div class="river-stat-value">${Math.round((totalKmCompleted / totalKmGoal) * 100)}%</div>
            <div class="river-stat-label">Complete</div>
        </div>
    `;

    river.innerHTML = '';
    river.appendChild(track);
    river.appendChild(labels);
    river.appendChild(stats);
}

// Journey widget showing milestone progress
function updateJourneyWidget() {
    const widget = document.getElementById('journeyWidget');
    const levels = getAllLevels();
    const totalDistanceGoal = levels.reduce((sum, level) => sum + level.totalDistance, 0);

    // Define journey phases
    const phases = [
        { name: 'Starting Out', range: [2, 5], icon: '🎯' },
        { name: 'Building Base', range: [6, 10], icon: '💪' },
        { name: 'Mid Journey', range: [11, 15], icon: '🔥' },
        { name: 'Advanced', range: [16, 19], icon: '⚡' },
        { name: 'Final Push', range: [20, 21], icon: '🏆' }
    ];

    widget.innerHTML = '';

    phases.forEach(phase => {
        const phaseStart = phase.range[0];
        const phaseEnd = phase.range[1];

        // Calculate phase stats
        let phaseCompleted = 0;
        let phaseTotal = 0;

        for (let dist = phaseStart; dist <= phaseEnd; dist++) {
            const runsNeeded = getRunsNeeded(dist);
            phaseTotal += runsNeeded;

            if (dist < state.currentDistance) {
                phaseCompleted += runsNeeded;
            } else if (dist === state.currentDistance) {
                phaseCompleted += state.currentRuns;
            }
        }

        const percentage = (phaseCompleted / phaseTotal) * 100;
        const isCurrent = state.currentDistance >= phaseStart && state.currentDistance <= phaseEnd;
        const isCompleted = state.currentDistance > phaseEnd;

        // Create milestone element
        const milestone = document.createElement('div');
        milestone.className = 'journey-milestone';
        if (isCompleted) milestone.classList.add('completed');
        if (isCurrent) milestone.classList.add('current');

        milestone.innerHTML = `
            <div class="milestone-icon">${phase.icon}</div>
            <div class="milestone-bar">
                <div class="milestone-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="milestone-info">
                <div class="milestone-label">${phase.name}</div>
                <div class="milestone-sublabel">${phaseStart}-${phaseEnd}km · ${Math.round(percentage)}%</div>
            </div>
        `;

        widget.appendChild(milestone);
    });
}

// Mountain progress widget showing overall progress along the silhouette
function updateMountainWidget() {
    const marker = document.getElementById('mountainMarker');
    if (!marker) return;

    const levels = getAllLevels();
    const totalDistanceGoal = levels.reduce((sum, level) => sum + level.totalDistance, 0);
    const distanceRun = getTotalDistanceRun();
    const progress = totalDistanceGoal === 0 ? 0 : (distanceRun / totalDistanceGoal) * 100;
    const clamped = Math.max(0, Math.min(100, progress));
    const markerLeft = Math.max(2, Math.min(98, clamped));

    marker.style.left = `${markerLeft}%`;

    const label = document.getElementById('mountainMarkerLabel');
    if (label) {
        label.textContent = `${clamped.toFixed(1)}%`;
    }

    const caption = document.getElementById('mountainCaption');
    if (caption) {
        caption.textContent = `${distanceRun} km of ${totalDistanceGoal} km completed`;
    }
}

// Add a completed run (manual override - adds one run from projection date)
function addRun() {
    // Move projection date forward by 2 days
    state.projectionDate = new Date(state.projectionDate.getTime() + (runsInterval * 24 * 60 * 60 * 1000));

    // Update date picker
    document.getElementById('projectionDate').valueAsDate = state.projectionDate;

    // Recalculate and update
    updateProgressFromDate();
}

// Update progress based on selected date
function updateProgressFromDate() {
    const progress = calculateProgressForDate(state.projectionDate);
    state.currentDistance = progress.distance;
    state.currentRuns = progress.runs;
    updateStats();
}

// Handle date picker change
function onDateChange() {
    const datePicker = document.getElementById('projectionDate');
    state.projectionDate = datePicker.valueAsDate || new Date();
    updateProgressFromDate();
}

// Reset to today
function resetToToday() {
    state.projectionDate = new Date();
    document.getElementById('projectionDate').valueAsDate = state.projectionDate;
    updateProgressFromDate();
}

// Reset progress (not used with date-based system, but keeping for button)
function resetProgress() {
    if (confirm('Reset to today\'s date?')) {
        resetToToday();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker to today
    const datePicker = document.getElementById('projectionDate');
    datePicker.valueAsDate = state.projectionDate;

    // Add event listener for date changes
    datePicker.addEventListener('change', onDateChange);

    // Calculate initial progress based on today's date
    updateProgressFromDate();
});
