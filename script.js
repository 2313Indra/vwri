// Navigation Toggle
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    });
})();

// Helper function to map rating to score 1..5
function getRatingValue(rating) {
    switch(rating) {
        case 'Very Low': return 1;
        case 'Low': return 2;
        case 'Moderate': return 3;
        case 'High': return 4;
        case 'Very High': return 5;
        default: return null;
    }
}

// Helper to set score and rating in DOM
function updateIndicatorResult(scoreElemId, ratingElemId, displayValue, rating) {
    const scoreElem = document.getElementById(scoreElemId);
    const ratingElem = document.getElementById(ratingElemId);
    if (scoreElem) {
        scoreElem.textContent = (displayValue !== null && displayValue !== undefined && displayValue !== '') ? displayValue : '-';
    }
    if (ratingElem) {
        ratingElem.textContent = rating || '-';
        if (rating) {
            ratingElem.setAttribute('data-rating', rating);
            ratingElem.setAttribute('data-score', getRatingValue(rating));
        } else {
            ratingElem.removeAttribute('data-rating');
            ratingElem.removeAttribute('data-score');
        }
    }
}

// Helper to sync realm score to mini pills, tab badges, and sticky bar
function syncRealmScoreUI(key, scoreText) {
    const mini = document.getElementById(`mini-score-${key}`);
    const tab = document.getElementById(`tab-score-${key}`);
    const sticky = document.getElementById(`sticky-${key}`);
    const hasScore = scoreText && scoreText !== '-';
    const displayVal = hasScore ? scoreText : '';

    if (mini) {
        mini.textContent = displayVal;
        mini.style.display = hasScore ? 'inline-block' : 'none';
    }
    if (tab) {
        tab.textContent = displayVal;
        tab.style.display = hasScore ? 'inline-block' : 'none';
    }
    if (sticky) {
        sticky.textContent = scoreText || '-';
    }
}


//  1: Hydrological Resilience (Weight: 0.30)


// 1.1 Groundwater Depth (DTW) - Negative: lower is better
function calculateGroundWaterDepth() {
    const dtw = parseFloat(document.getElementById('groundWater-depth').value);
    if (isNaN(dtw)) {
        updateIndicatorResult('groundWaterDepth-score', 'groundWaterDepth-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    let rating;
    if (dtw > 40) rating = 'Very Low';
    else if (dtw > 20) rating = 'Low';
    else if (dtw > 10) rating = 'Moderate';
    else if (dtw > 5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('groundWaterDepth-score', 'groundWaterDepth-rating', dtw.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.2 Groundwater Level Trend (GTS) - Negative: negative slope (rising water table) is favourable
function calculateGroundWaterLevel() {
    const gts = parseFloat(document.getElementById('groundWater-Level').value);
    if (isNaN(gts)) {
        updateIndicatorResult('groundWaterLevel-score', 'groundWaterLevel-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    let rating;
    if (gts > 0.20) rating = 'Very Low';
    else if (gts > 0.05) rating = 'Low';
    else if (gts >= -0.05) rating = 'Moderate';
    else if (gts >= -0.20) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('groundWaterLevel-score', 'groundWaterLevel-rating', gts.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.3 Recharge Potential (RP) - Positive: higher better
function calculateRechargePotential() {
    const agr = parseFloat(document.getElementById('AGR').value);
    const vga = parseFloat(document.getElementById('VGA').value);
    if (isNaN(agr) || isNaN(vga) || vga <= 0) {
        updateIndicatorResult('RechargePotential-score', 'RechargePotential-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const rp = (agr / vga) * 1000;
    let rating;
    if (rp <= 50) rating = 'Very Low';
    else if (rp <= 100) rating = 'Low';
    else if (rp <= 200) rating = 'Moderate';
    else if (rp <= 350) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('RechargePotential-score', 'RechargePotential-rating', rp.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.4 Water Source Density (WSD) - Positive: higher better
function calculateWaterSourceDensity() {
    const sources = parseFloat(document.getElementById('drinkingwater-sources').value);
    const area = parseFloat(document.getElementById('village-area').value);
    if (isNaN(sources) || isNaN(area) || area <= 0) {
        updateIndicatorResult('WaterSource-index', 'WaterSource-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const wsd = sources / area;
    let rating;
    if (wsd <= 0.5) rating = 'Very Low';
    else if (wsd <= 1.5) rating = 'Low';
    else if (wsd <= 3) rating = 'Moderate';
    else if (wsd <= 5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('WaterSource-index', 'WaterSource-rating', wsd.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.5 Restoration of Water Bodies (AHI) - Positive: higher better
function calculateAquaHealthIndex() {
    const weightsInput = document.getElementById('water-body-weights').value.trim();
    const areasInput = document.getElementById('water-body-areas').value.trim();
    if (!weightsInput || !areasInput) {
        updateIndicatorResult('aqua-health-index', 'aqua-health-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const weights = weightsInput.split(',').map(s => parseFloat(s.trim()));
    const areas = areasInput.split(',').map(s => parseFloat(s.trim()));

    if (weights.length !== areas.length || weights.some(isNaN) || areas.some(isNaN)) {
        updateIndicatorResult('aqua-health-index', 'aqua-health-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const totalArea = areas.reduce((sum, a) => sum + a, 0);
    if (totalArea <= 0) {
        updateIndicatorResult('aqua-health-index', 'aqua-health-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const weightedSum = weights.reduce((sum, w, i) => sum + (w * areas[i]), 0);
    const ahi = weightedSum / totalArea;

    let rating;
    if (ahi <= 0.2) rating = 'Very Low';
    else if (ahi <= 0.4) rating = 'Low';
    else if (ahi <= 0.6) rating = 'Moderate';
    else if (ahi <= 0.8) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('aqua-health-index', 'aqua-health-rating', ahi.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.6 Source Reliability (SR) - Positive: higher better
function calculateSourceReliability() {
    const days = parseFloat(document.getElementById('source-supplied-water').value);
    if (isNaN(days)) {
        updateIndicatorResult('SourceReliability-index', 'SourceReliability-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const sr = (days / 365) * 100;
    let rating;
    if (sr <= 40) rating = 'Very Low';
    else if (sr <= 60) rating = 'Low';
    else if (sr <= 75) rating = 'Moderate';
    else if (sr <= 90) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('SourceReliability-index', 'SourceReliability-rating', sr.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.7 Water Availability per Capita (PCA) - Positive: higher better
function calculateWaterAvailability() {
    const water = parseFloat(document.getElementById('Annual-available-water').value);
    const pop = parseFloat(document.getElementById('total-population').value);
    if (isNaN(water) || isNaN(pop) || pop <= 0) {
        updateIndicatorResult('Water-Availability-index', 'Water-Availability-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const pca = water / pop;
    let rating;
    if (pca <= 500) rating = 'Very Low';
    else if (pca <= 1000) rating = 'Low';
    else if (pca <= 1700) rating = 'Moderate';
    else if (pca <= 2500) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Water-Availability-index', 'Water-Availability-rating', pca.toFixed(2), rating);
    calculateHydrologicalRealm();
}

// 1.8 Surface Water Availability (SWSI) - Positive: higher better
function calculateSurfaceWaterAvailability() {
    const retained = parseFloat(document.getElementById('surface-water-available').value);
    const capacity = parseFloat(document.getElementById('storage-capacity').value);
    if (isNaN(retained) || isNaN(capacity) || capacity <= 0) {
        updateIndicatorResult('SurfaceWater-Availability-index', 'SurfaceWater-Availability-rating', null, null);
        calculateHydrologicalRealm();
        return;
    }
    const swsi = (retained / capacity) * 100;
    let rating;
    if (swsi <= 20) rating = 'Very Low';
    else if (swsi <= 40) rating = 'Low';
    else if (swsi <= 60) rating = 'Moderate';
    else if (swsi <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('SurfaceWater-Availability-index', 'SurfaceWater-Availability-rating', swsi.toFixed(2), rating);
    calculateHydrologicalRealm();
}

function calculateHydrologicalRealm() {
    const ratingIds = [
        'groundWaterDepth-rating', 'groundWaterLevel-rating', 'RechargePotential-rating', 'WaterSource-rating',
        'aqua-health-rating', 'SourceReliability-rating', 'Water-Availability-rating', 'SurfaceWater-Availability-rating'
    ];
    const scores = ratingIds
        .map(id => parseFloat(document.getElementById(id)?.getAttribute('data-score')))
        .filter(score => !isNaN(score) && score !== null);

    const val = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2) : '-';
    const elem = document.getElementById('Hydrological-realm-score');
    if (elem) elem.textContent = val;
    syncRealmScoreUI('h', val);
    calculateWaterSensitivityLevel();
}


//  2: Infrastructure Resilience (Weight: 0.20)


// 2.1 Household Water Supply Coverage (CR) - Positive
function calculateSupplyCoverage() {
    const taps = parseFloat(document.getElementById('households-tapconnection').value);
    const totalHh = parseFloat(document.getElementById('households').value);
    if (isNaN(taps) || isNaN(totalHh) || totalHh <= 0) {
        updateIndicatorResult('SupplyCoverage-index', 'SupplyCoverage-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const cr = (taps / totalHh) * 100;
    let rating;
    if (cr <= 20) rating = 'Very Low';
    else if (cr <= 40) rating = 'Low';
    else if (cr <= 55) rating = 'Moderate';
    else if (cr <= 90) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('SupplyCoverage-index', 'SupplyCoverage-rating', cr.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.2 Storage Capacity per Capita (SPC) - Positive
function calculateStorageCapacity() {
    const capacity = parseFloat(document.getElementById('storage-tank-capacity').value);
    const pop = parseFloat(document.getElementById('villagepopulation').value);
    if (isNaN(capacity) || isNaN(pop) || pop <= 0) {
        updateIndicatorResult('StorageCapacity-index', 'StorageCapacity-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const spc = capacity / pop;
    let rating;
    if (spc <= 25) rating = 'Very Low';
    else if (spc <= 50) rating = 'Low';
    else if (spc <= 70) rating = 'Moderate';
    else if (spc <= 100) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('StorageCapacity-index', 'StorageCapacity-rating', spc.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.3 Pump/Source Operational Reliability (OR) - Positive
function calculateOperationalReliability() {
    const days = parseFloat(document.getElementById('Source-Operational-reliability').value);
    if (isNaN(days)) {
        updateIndicatorResult('Operationalreliability-index', 'Operationalreliability-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const or = (days / 365) * 100;
    let rating;
    if (or <= 40) rating = 'Very Low';
    else if (or <= 60) rating = 'Low';
    else if (or <= 75) rating = 'Moderate';
    else if (or <= 90) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Operationalreliability-index', 'Operationalreliability-rating', or.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.4 Pipeline Network Density (PND) - Positive
function calculatePipelineNetwork() {
    const length = parseFloat(document.getElementById('Pipeline-Network-density').value);
    const area = parseFloat(document.getElementById('Village-area').value);
    if (isNaN(length) || isNaN(area) || area <= 0) {
        updateIndicatorResult('PipelineNetwork-index', 'PipelineNetwork-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const pnd = length / area;
    let rating;
    if (pnd <= 0.5) rating = 'Very Low';
    else if (pnd <= 1.5) rating = 'Low';
    else if (pnd <= 3) rating = 'Moderate';
    else if (pnd <= 5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('PipelineNetwork-index', 'PipelineNetwork-rating', pnd.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.5 Infrastructure Breakdown Frequency (BF) - Negative: lower is better
function calculateBreakdownFrequency() {
    const breakdowns = parseFloat(document.getElementById('breakdowns-recorded').value);
    const units = parseFloat(document.getElementById('water-supply-units').value);
    if (isNaN(breakdowns) || isNaN(units) || units <= 0) {
        updateIndicatorResult('BreakdownFrequency-index', 'BreakdownFrequency-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const bf = breakdowns / units;
    let rating;
    if (bf > 4) rating = 'Very Low';
    else if (bf > 2) rating = 'Low';
    else if (bf > 1) rating = 'Moderate';
    else if (bf > 0.5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('BreakdownFrequency-index', 'BreakdownFrequency-rating', bf.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.6 Backup Source Availability (BC) - Positive
function calculateBackupCoverage() {
    const backupHab = parseFloat(document.getElementById('functioning-backup-source').value);
    const totalHab = parseFloat(document.getElementById('Total-habitations').value);
    if (isNaN(backupHab) || isNaN(totalHab) || totalHab <= 0) {
        updateIndicatorResult('Backupcoverage-index', 'Backupcoverage-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const bc = (backupHab / totalHab) * 100;
    let rating;
    if (bc <= 20) rating = 'Very Low';
    else if (bc <= 40) rating = 'Low';
    else if (bc <= 60) rating = 'Moderate';
    else if (bc <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Backupcoverage-index', 'Backupcoverage-rating', bc.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.7 Distribution Delivery Efficiency (DE) - Positive
function calculateDistributionEfficiency() {
    const delivered = parseFloat(document.getElementById('water-delivered-consumers').value);
    const produced = parseFloat(document.getElementById('water-produced-source').value);
    if (isNaN(delivered) || isNaN(produced) || produced <= 0) {
        updateIndicatorResult('DistributionEfficiency-index', 'DistributionEfficiency-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const de = (delivered / produced) * 100;
    let rating;
    if (de <= 50) rating = 'Very Low';
    else if (de <= 65) rating = 'Low';
    else if (de <= 80) rating = 'Moderate';
    else if (de <= 90) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('DistributionEfficiency-index', 'DistributionEfficiency-rating', de.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.8 Infrastructure Disaster Resilience (DFR) - Positive
function calculateDisasterResilience() {
    const functional = parseFloat(document.getElementById('functional-infrastructureunits-disaster').value);
    const exposed = parseFloat(document.getElementById('infrastructure-exposed-disaster').value);
    if (isNaN(functional) || isNaN(exposed) || exposed <= 0) {
        updateIndicatorResult('DisasterResilience-index', 'DisasterResilience-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const dfr = (functional / exposed) * 100;
    let rating;
    if (dfr <= 20) rating = 'Very Low';
    else if (dfr <= 40) rating = 'Low';
    else if (dfr <= 60) rating = 'Moderate';
    else if (dfr <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('DisasterResilience-index', 'DisasterResilience-rating', dfr.toFixed(2), rating);
    calculateInfrastructureRealm();
}

// 2.9 Pipe Material Quality (PMQI) - Positive
function calculatePipeMaterialQuality() {
    const resistant = parseFloat(document.getElementById('pipeline-networ-resistantmaterial').value);
    const total = parseFloat(document.getElementById('pipeline-network-length').value);
    if (isNaN(resistant) || isNaN(total) || total <= 0) {
        updateIndicatorResult('PipeMaterialQuality-index', 'PipeMaterialQuality-rating', null, null);
        calculateInfrastructureRealm();
        return;
    }
    const pmqi = (resistant / total) * 100;
    let rating;
    if (pmqi <= 20) rating = 'Very Low';
    else if (pmqi <= 40) rating = 'Low';
    else if (pmqi <= 60) rating = 'Moderate';
    else if (pmqi <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('PipeMaterialQuality-index', 'PipeMaterialQuality-rating', pmqi.toFixed(2), rating);
    calculateInfrastructureRealm();
}

function calculateInfrastructureRealm() {
    const ratingIds = [
        'SupplyCoverage-rating', 'StorageCapacity-rating', 'Operationalreliability-rating', 'PipelineNetwork-rating',
        'BreakdownFrequency-rating', 'Backupcoverage-rating', 'DistributionEfficiency-rating', 'DisasterResilience-rating',
        'PipeMaterialQuality-rating'
    ];
    const scores = ratingIds
        .map(id => parseFloat(document.getElementById(id)?.getAttribute('data-score')))
        .filter(score => !isNaN(score) && score !== null);

    const val = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2) : '-';
    const elem = document.getElementById('Infrastructure-realm-score');
    if (elem) elem.textContent = val;
    syncRealmScoreUI('i', val);
    calculateWaterSensitivityLevel();
}


//  3: Water Quality Resilience (Weight: 0.15)


// 3.1 Composite Chemical Water Quality Index (CWQI) - Positive: higher better
function calculateCWQI() {
    const cwqi = parseFloat(document.getElementById('CWQI-input').value);
    if (isNaN(cwqi)) {
        updateIndicatorResult('CWQI-score', 'CWQI-rating', null, null);
        calculateWaterQualityRealm();
        return;
    }
    let rating;
    if (cwqi <= 40) rating = 'Very Low';
    else if (cwqi <= 55) rating = 'Low';
    else if (cwqi <= 70) rating = 'Moderate';
    else if (cwqi <= 85) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('CWQI-score', 'CWQI-rating', cwqi.toFixed(2), rating);
    calculateWaterQualityRealm();
}

// 3.2 Safe Source Availability (SSR) - Positive
function calculateSafeSourceRatio() {
    const safe = parseFloat(document.getElementById('source-stested-quality-parameters').value);
    const total = parseFloat(document.getElementById('Total-sources').value);
    if (isNaN(safe) || isNaN(total) || total <= 0) {
        updateIndicatorResult('Safesourceratio-index', 'Safesourceratio-rating', null, null);
        calculateWaterQualityRealm();
        return;
    }
    const ssr = (safe / total) * 100;
    let rating;
    if (ssr <= 40) rating = 'Very Low';
    else if (ssr <= 60) rating = 'Low';
    else if (ssr <= 75) rating = 'Moderate';
    else if (ssr <= 90) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Safesourceratio-index', 'Safesourceratio-rating', ssr.toFixed(2), rating);
    calculateWaterQualityRealm();
}

// 3.3 Seasonal Quality Stability (SI) - Positive: higher stability is better
function calculateSeasonalStability() {
    const pre = parseFloat(document.getElementById('WQI-pre-monsoon').value);
    const post = parseFloat(document.getElementById('WQI-post-monsoon').value);
    if (isNaN(pre) || isNaN(post)) {
        updateIndicatorResult('Stability-index', 'Stability-rating', null, null);
        calculateWaterQualityRealm();
        return;
    }
    // SI = 100 - (|WQI pre - WQI post| / 100) * 100
    const diff = Math.abs(pre - post);
    const si = Math.max(0, 100 - (diff / 100) * 100);

    let rating;
    if (si <= 60) rating = 'Very Low';
    else if (si <= 75) rating = 'Low';
    else if (si <= 85) rating = 'Moderate';
    else if (si <= 95) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Stability-index', 'Stability-rating', si.toFixed(2), rating);
    calculateWaterQualityRealm();
}

// 3.4 Composite Biological Water Quality (CBWQI) - Positive
function calculateCompositeBiologicalWaterQuality() {
    const negSamples = parseFloat(document.getElementById('Ecoli-and-total-coliform').value);
    const totalSamples = parseFloat(document.getElementById('Total-samples-tested').value);
    if (isNaN(negSamples) || isNaN(totalSamples) || totalSamples <= 0) {
        updateIndicatorResult('CompositeBiologicalWaterQuality-Index', 'CompositeBiologicalWaterQuality-rating', null, null);
        calculateWaterQualityRealm();
        return;
    }
    const cbwqi = (negSamples / totalSamples) * 100;
    let rating;
    if (cbwqi <= 50) rating = 'Very Low';
    else if (cbwqi <= 70) rating = 'Low';
    else if (cbwqi <= 85) rating = 'Moderate';
    else if (cbwqi <= 95) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('CompositeBiologicalWaterQuality-Index', 'CompositeBiologicalWaterQuality-rating', cbwqi.toFixed(2), rating);
    calculateWaterQualityRealm();
}

function calculateWaterQualityRealm() {
    const ratingIds = [
        'CWQI-rating', 'Safesourceratio-rating', 'Stability-rating', 'CompositeBiologicalWaterQuality-rating'
    ];
    const scores = ratingIds
        .map(id => parseFloat(document.getElementById(id)?.getAttribute('data-score')))
        .filter(score => !isNaN(score) && score !== null);

    const val = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2) : '-';
    const elem = document.getElementById('WaterQuality-realm-score');
    if (elem) elem.textContent = val;
    syncRealmScoreUI('wq', val);
    calculateWaterSensitivityLevel();
}


//  4: Climate Resilience (Weight: 0.15)


// 4.1 Rainfall Variability (CV) - Negative: lower variability is better
function calculateRainfallVariability() {
    const sd = parseFloat(document.getElementById('Rainfall-SD').value);
    const mean = parseFloat(document.getElementById('Rainfall-Mean').value);
    if (isNaN(sd) || isNaN(mean) || mean <= 0) {
        updateIndicatorResult('Rainfall-Variability-index', 'Rainfall-Variability-rating', null, null);
        calculateClimateRealm();
        return;
    }
    const cv = (sd / mean) * 100;
    let rating;
    if (cv > 45) rating = 'Very Low';
    else if (cv > 35) rating = 'Low';
    else if (cv > 25) rating = 'Moderate';
    else if (cv > 15) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('Rainfall-Variability-index', 'Rainfall-Variability-rating', cv.toFixed(2), rating);
    calculateClimateRealm();
}

// 4.2 Mean SPI of Drought Years (MSPI) - Positive: less negative/higher is better
function calculateMeanSPI() {
    const mspi = parseFloat(document.getElementById('MSPI-input').value);
    if (isNaN(mspi)) {
        updateIndicatorResult('MSPI-score', 'MSPI-rating', null, null);
        calculateClimateRealm();
        return;
    }
    let rating;
    if (mspi <= -2.0) rating = 'Very Low';
    else if (mspi <= -1.5) rating = 'Low';
    else if (mspi <= -1.0) rating = 'Moderate';
    else if (mspi <= -0.5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('MSPI-score', 'MSPI-rating', mspi.toFixed(2), rating);
    calculateClimateRealm();
}

// 4.3 Consecutive Dry Years (CDY) - Negative: lower is better
function calculateConsecutiveDryYears() {
    const cdy = parseFloat(document.getElementById('CDY-input').value);
    if (isNaN(cdy)) {
        updateIndicatorResult('CDY-score', 'CDY-rating', null, null);
        calculateClimateRealm();
        return;
    }
    let rating;
    if (cdy > 4) rating = 'Very Low';
    else if (cdy >= 3) rating = 'Low';
    else if (cdy >= 2) rating = 'Moderate';
    else if (cdy >= 1) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('CDY-score', 'CDY-rating', cdy.toString(), rating);
    calculateClimateRealm();
}

// 4.4 Drought Frequency (FR) - Negative: lower is better
function calculateDroughtFrequency() {
    const droughtYears = parseFloat(document.getElementById('drought-years-count').value);
    const totalYears = parseFloat(document.getElementById('total-years-record').value);
    if (isNaN(droughtYears) || isNaN(totalYears) || totalYears <= 0) {
        updateIndicatorResult('FR-score', 'FR-rating', null, null);
        calculateClimateRealm();
        return;
    }
    const fr = (droughtYears / totalYears) * 100;
    let rating;
    if (fr > 40) rating = 'Very Low';
    else if (fr > 30) rating = 'Low';
    else if (fr > 20) rating = 'Moderate';
    else if (fr > 10) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('FR-score', 'FR-rating', fr.toFixed(2), rating);
    calculateClimateRealm();
}

// 4.5 Temperature Trend (TTS) - Negative: lower/less warming is better
function calculateTemperatureTrend() {
    const tts = parseFloat(document.getElementById('TTS-input').value);
    if (isNaN(tts)) {
        updateIndicatorResult('TTS-score', 'TTS-rating', null, null);
        calculateClimateRealm();
        return;
    }
    let rating;
    if (tts > 0.05) rating = 'Very Low';
    else if (tts > 0.03) rating = 'Low';
    else if (tts > 0.02) rating = 'Moderate';
    else if (tts > 0.01) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('TTS-score', 'TTS-rating', tts.toFixed(3), rating);
    calculateClimateRealm();
}

// 4.6 Groundwater Recharge Sensitivity to Rainfall (RS) - Negative: lower sensitivity is better
function calculateRechargeSensitivity() {
    const chgRecharge = parseFloat(document.getElementById('recharge-pct-change').value);
    const chgRainfall = parseFloat(document.getElementById('rainfall-pct-change').value);
    if (isNaN(chgRecharge) || isNaN(chgRainfall) || chgRainfall === 0) {
        updateIndicatorResult('RS-score', 'RS-rating', null, null);
        calculateClimateRealm();
        return;
    }
    const rs = chgRecharge / chgRainfall;
    let rating;
    if (rs > 2.0) rating = 'Very Low';
    else if (rs > 1.5) rating = 'Low';
    else if (rs > 1.0) rating = 'Moderate';
    else if (rs > 0.5) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('RS-score', 'RS-rating', rs.toFixed(2), rating);
    calculateClimateRealm();
}

// 4.7 GHG Emission Control Index (GECI) - Positive: higher reduction is better
function calculateGHGEmissionControl() {
    const baseline = parseFloat(document.getElementById('baseline-ghg').value);
    const actual = parseFloat(document.getElementById('actual-ghg').value);
    if (isNaN(baseline) || isNaN(actual) || baseline <= 0) {
        updateIndicatorResult('GECI-score', 'GECI-rating', null, null);
        calculateClimateRealm();
        return;
    }
    const geci = ((baseline - actual) / baseline) * 100;
    let rating;
    if (geci <= 20) rating = 'Very Low';
    else if (geci <= 40) rating = 'Low';
    else if (geci <= 60) rating = 'Moderate';
    else if (geci <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('GECI-score', 'GECI-rating', geci.toFixed(2), rating);
    calculateClimateRealm();
}

function calculateClimateRealm() {
    const ratingIds = [
        'Rainfall-Variability-rating', 'MSPI-rating', 'CDY-rating', 'FR-rating',
        'TTS-rating', 'RS-rating', 'GECI-rating'
    ];
    const scores = ratingIds
        .map(id => parseFloat(document.getElementById(id)?.getAttribute('data-score')))
        .filter(score => !isNaN(score) && score !== null);

    const val = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2) : '-';
    const elem = document.getElementById('climate-realm-score');
    if (elem) elem.textContent = val;
    syncRealmScoreUI('c', val);
    calculateWaterSensitivityLevel();
}


//  5: Socio-economic Resilience (Weight: 0.20)


// 5.1 Per Capita Income (IPC) - Positive
function calculatePerCapitaIncome() {
    const income = parseFloat(document.getElementById('annual-household-income').value);
    const size = parseFloat(document.getElementById('household-size').value);
    if (isNaN(income) || isNaN(size) || size <= 0) {
        updateIndicatorResult('IPC-index', 'IPC-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const ipc = income / size;
    let rating;
    if (ipc <= 40000) rating = 'Very Low';
    else if (ipc <= 70000) rating = 'Low';
    else if (ipc <= 100000) rating = 'Moderate';
    else if (ipc <= 150000) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('IPC-index', 'IPC-rating', Math.round(ipc).toLocaleString('en-IN'), rating);
    calculateSocioEconomicRealm();
}

// 5.2 Livestock Dependency (LR) - Negative: lower is better
function calculateLivestockDependency() {
    const slu = parseFloat(document.getElementById('livestock-slu').value);
    const pop = parseFloat(document.getElementById('human-population-lr').value);
    if (isNaN(slu) || isNaN(pop) || pop <= 0) {
        updateIndicatorResult('LR-index', 'LR-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const lr = slu / pop;
    let rating;
    if (lr > 1.5) rating = 'Very Low';
    else if (lr > 1.0) rating = 'Low';
    else if (lr > 0.6) rating = 'Moderate';
    else if (lr > 0.3) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('LR-index', 'LR-rating', lr.toFixed(2), rating);
    calculateSocioEconomicRealm();
}

// 5.3 Water-scarcity Migration Rate (MR) - Negative: lower is better
function calculateMigrationRate() {
    const migrating = parseFloat(document.getElementById('migrating-households').value);
    const total = parseFloat(document.getElementById('total-households-mr').value);
    if (isNaN(migrating) || isNaN(total) || total <= 0) {
        updateIndicatorResult('MR-index', 'MR-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const mr = (migrating / total) * 100;
    let rating;
    if (mr > 20) rating = 'Very Low';
    else if (mr > 10) rating = 'Low';
    else if (mr > 5) rating = 'Moderate';
    else if (mr > 1) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('MR-index', 'MR-rating', mr.toFixed(2), rating);
    calculateSocioEconomicRealm();
}

// 5.4 Community Participation in Water Management (CPR) - Positive
function calculateCommunityParticipation() {
    const participants = parseFloat(document.getElementById('active-vwsc-participants').value);
    const adults = parseFloat(document.getElementById('eligible-adult-population').value);
    if (isNaN(participants) || isNaN(adults) || adults <= 0) {
        updateIndicatorResult('CPR-index', 'CPR-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const cpr = (participants / adults) * 100;
    let rating;
    if (cpr <= 10) rating = 'Very Low';
    else if (cpr <= 25) rating = 'Low';
    else if (cpr <= 40) rating = 'Moderate';
    else if (cpr <= 60) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('CPR-index', 'CPR-rating', cpr.toFixed(2), rating);
    calculateSocioEconomicRealm();
}

// 5.5 Water Governance Index (CGS) - Positive
function calculateGovernanceIndex() {
    const q1 = document.getElementById('cgs-q1').value;
    const q2 = document.getElementById('cgs-q2').value;
    const q3 = document.getElementById('cgs-q3').value;
    if (q1 === '' || q2 === '' || q3 === '') {
        updateIndicatorResult('CGS-index', 'CGS-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const cgs = (parseFloat(q1) + parseFloat(q2) + parseFloat(q3)) / 3.0;
    const roundedCgs = Math.round(cgs * 100) / 100;
    let rating;
    if (roundedCgs === 0) rating = 'Very Low';
    else if (roundedCgs <= 0.33) rating = 'Low';
    else if (roundedCgs <= 0.67) rating = 'Moderate';
    else if (roundedCgs < 1) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('CGS-index', 'CGS-rating', cgs.toFixed(2), rating);
    calculateSocioEconomicRealm();
}

// 5.6 Water Conservation Participation (WCPR) - Positive
function calculateWaterConservationParticipation() {
    const arHh = parseFloat(document.getElementById('wcpr-ar-households').value);
    const cfiHh = parseFloat(document.getElementById('wcpr-cfi-households').value);
    const totalHh = parseFloat(document.getElementById('wcpr-total-households').value);
    if (isNaN(arHh) || isNaN(cfiHh) || isNaN(totalHh) || totalHh <= 0) {
        updateIndicatorResult('WCPR-index', 'WCPR-rating', null, null);
        calculateSocioEconomicRealm();
        return;
    }
    const ar = (arHh / totalHh) * 100;
    const cfi = (cfiHh / totalHh) * 100;
    const wcpr = 0.5 * ar + 0.5 * cfi;

    let rating;
    if (wcpr <= 20) rating = 'Very Low';
    else if (wcpr <= 40) rating = 'Low';
    else if (wcpr <= 60) rating = 'Moderate';
    else if (wcpr <= 80) rating = 'High';
    else rating = 'Very High';

    updateIndicatorResult('WCPR-index', 'WCPR-rating', wcpr.toFixed(2), rating);
    calculateSocioEconomicRealm();
}

function calculateSocioEconomicRealm() {
    const ratingIds = [
        'IPC-rating', 'LR-rating', 'MR-rating', 'CPR-rating', 'CGS-rating', 'WCPR-rating'
    ];
    const scores = ratingIds
        .map(id => parseFloat(document.getElementById(id)?.getAttribute('data-score')))
        .filter(score => !isNaN(score) && score !== null);

    const val = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2) : '-';
    const elem = document.getElementById('socio-economic-realm-score');
    if (elem) elem.textContent = val;
    syncRealmScoreUI('se', val);
    calculateWaterSensitivityLevel();
}


// COMPOSITE VWRI & RESILIENCE LEVEL


function calculateWaterSensitivityLevel() {
    const hElem = document.getElementById('Hydrological-realm-score');
    const iElem = document.getElementById('Infrastructure-realm-score');
    const wqElem = document.getElementById('WaterQuality-realm-score');
    const cElem = document.getElementById('climate-realm-score');
    const seElem = document.getElementById('socio-economic-realm-score');

    const hScore = parseFloat(hElem?.textContent);
    const iScore = parseFloat(iElem?.textContent);
    const wqScore = parseFloat(wqElem?.textContent);
    const cScore = parseFloat(cElem?.textContent);
    const seScore = parseFloat(seElem?.textContent);

    const scores = [hScore, iScore, wqScore, cScore, seScore];
    const allFilled = scores.every(s => !isNaN(s) && s > 0);

    const compositeScoreElem = document.getElementById('composite-vwri-score');
    const statusElem = document.getElementById('water-sensitivity-level');
    const stickyVwriElem = document.getElementById('sticky-vwri-val');
    const stickyResilienceElem = document.getElementById('sticky-resilience-badge');

    if (!allFilled) {
        if (compositeScoreElem) compositeScoreElem.textContent = '-';
        if (statusElem) {
            statusElem.textContent = 'Pending Calculation';
            statusElem.setAttribute('data-level', 'default');
        }
        if (stickyVwriElem) stickyVwriElem.textContent = '-';
        if (stickyResilienceElem) {
            stickyResilienceElem.textContent = '-';
            stickyResilienceElem.removeAttribute('data-rating');
        }
        return;
    }

    // Formula: VWRI = 0.30 H + 0.20 I + 0.15 WQ + 0.15 C + 0.20 SE
    const vwri = (0.30 * hScore) + (0.20 * iScore) + (0.15 * wqScore) + (0.15 * cScore) + (0.20 * seScore);
    const vwriFormatted = vwri.toFixed(2);

    if (compositeScoreElem) compositeScoreElem.textContent = vwriFormatted;
    if (stickyVwriElem) stickyVwriElem.textContent = vwriFormatted;

    // Resilience Level based on Table 3:
    // RS <= 1.5: Very Low resilience
    // 1.5 < RS <= 2.5: Low resilience
    // 2.5 < RS <= 3.5: Moderate resilience
    // 3.5 < RS <= 4.5: High resilience
    // RS > 4.5: Very High resilience
    let resilienceLevel;
    let ratingTier;
    if (vwri <= 1.5) {
        resilienceLevel = 'Very Low resilience';
        ratingTier = 'Very Low';
    } else if (vwri <= 2.5) {
        resilienceLevel = 'Low resilience';
        ratingTier = 'Low';
    } else if (vwri <= 3.5) {
        resilienceLevel = 'Moderate resilience';
        ratingTier = 'Moderate';
    } else if (vwri <= 4.5) {
        resilienceLevel = 'High resilience';
        ratingTier = 'High';
    } else {
        resilienceLevel = 'Very High resilience';
        ratingTier = 'Very High';
    }

    if (statusElem) {
        statusElem.textContent = resilienceLevel;
        statusElem.setAttribute('data-level', ratingTier);
    }
    if (stickyResilienceElem) {
        stickyResilienceElem.textContent = resilienceLevel;
        stickyResilienceElem.setAttribute('data-rating', ratingTier);
    }
}


// SAMPLE VILLAGE DATA (Gujarat Semi-Arid Benchmark)


const sampleVillageData = {
    // Realm 1: Hydrological
    'groundWater-depth': 15.5,
    'groundWater-Level': 0.02,
    'AGR': 180000,
    'VGA': 1200,
    'drinkingwater-sources': 6,
    'village-area': 3,
    'water-body-weights': '0.75, 0.60, 0.50',
    'water-body-areas': '2, 1.5, 1',
    'source-supplied-water': 280,
    'Annual-available-water': 1800000,
    'total-population': 1200,
    'surface-water-available': 45000,
    'storage-capacity': 80000,

    // Realm 2: Infrastructure
    'households-tapconnection': 160,
    'households': 250,
    'storage-tank-capacity': 75000,
    'villagepopulation': 1200,
    'Source-Operational-reliability': 82,
    'Pipeline-Network-density': 6.5,
    'Village-area': 3,
    'breakdowns-recorded': 3,
    'water-supply-units': 2,
    'functioning-backup-source': 3,
    'Total-habitations': 5,
    'water-delivered-consumers': 72000,
    'water-produced-source': 95000,
    'functional-infrastructureunits-disaster': 7,
    'infrastructure-exposed-disaster': 10,
    'pipeline-networ-resistantmaterial': 5.2,
    'pipeline-network-length': 6.5,

    // Realm 3: Water Quality
    'CWQI-input': 68,
    'source-stested-quality-parameters': 5,
    'Total-sources': 6,
    'WQI-pre-monsoon': 62,
    'WQI-post-monsoon': 72,
    'Ecoli-and-total-coliform': 16,
    'Total-samples-tested': 20,

    // Realm 4: Climate
    'Rainfall-SD': 185,
    'Rainfall-Mean': 650,
    'MSPI-input': -0.85,
    'CDY-input': 2,
    'drought-years-count': 7,
    'total-years-record': 30,
    'TTS-input': 0.024,
    'recharge-pct-change': -12,
    'rainfall-pct-change': -15,
    'baseline-ghg': 120,
    'actual-ghg': 85,

    // Realm 5: Socio-economic
    'annual-household-income': 380000,
    'household-size': 4.5,
    'livestock-slu': 650,
    'human-population-lr': 1200,
    'migrating-households': 18,
    'total-households-mr': 250,
    'active-vwsc-participants': 120,
    'eligible-adult-population': 380,
    'cgs-q1': '1',
    'cgs-q2': '1',
    'cgs-q3': '0',
    'wcpr-ar-households': 85,
    'wcpr-cfi-households': 45,
    'wcpr-total-households': 250
};

// Tab switcher helper
function switchRealmTab(targetRealmId) {
    if (!targetRealmId) return;

    // Update tab button active states
    document.querySelectorAll('.realm-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-realm-target') === targetRealmId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update realm section active states (only in tabbed mode)
    const container = document.getElementById('realms-container');
    const isGrid = container && container.classList.contains('grid-view');
    if (!isGrid) {
        document.querySelectorAll('.realm').forEach(section => {
            if (section.id === targetRealmId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
}

// UI Controls initializer
function initUIControls() {
    // 1. Tab buttons click
    document.querySelectorAll('.realm-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-realm-target');
            switchRealmTab(target);
        });
    });

    // 2. Mini pills in KPI dashboard click
    document.querySelectorAll('.mini-pill[data-realm-target]').forEach(pill => {
        pill.addEventListener('click', function() {
            const target = this.getAttribute('data-realm-target');
            switchRealmTab(target);
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // 3. Step navigation buttons in footer of each realm
    document.querySelectorAll('.nav-step-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-next-target') || this.getAttribute('data-prev-target');
            if (target) {
                switchRealmTab(target);
                document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 4. Layout toggle (Tabbed vs 5-Column Grid)
    const layoutToggleBtn = document.getElementById('btn-toggle-layout');
    if (layoutToggleBtn) {
        layoutToggleBtn.addEventListener('click', function() {
            const container = document.getElementById('realms-container');
            const textSpan = document.getElementById('layout-toggle-text');
            const icon = document.getElementById('layout-toggle-icon');
            if (!container) return;

            container.classList.toggle('grid-view');
            const isGrid = container.classList.contains('grid-view');

            if (isGrid) {
                if (textSpan) textSpan.textContent = 'Tabbed Realm View';
                if (icon) {
                    icon.classList.remove('fa-th');
                    icon.classList.add('fa-columns');
                }
            } else {
                if (textSpan) textSpan.textContent = '5-Column Grid View';
                if (icon) {
                    icon.classList.remove('fa-columns');
                    icon.classList.add('fa-th');
                }
                const activeTab = document.querySelector('.realm-tab-btn.active');
                if (activeTab) {
                    switchRealmTab(activeTab.getAttribute('data-realm-target'));
                }
            }
        });
    }

    // 5. Inline benchmark popovers toggle with smooth accordion animation
    document.querySelectorAll('.benchmark-info-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const indicatorCard = this.closest('.indicator');
            if (!indicatorCard) return;
            const popover = indicatorCard.querySelector('.benchmark-popover');
            if (popover) {
                const isOpen = popover.classList.contains('open');

                // Close any other open accordions for clean UX
                document.querySelectorAll('.benchmark-popover.open').forEach(p => {
                    if (p !== popover) p.classList.remove('open');
                });
                document.querySelectorAll('.benchmark-info-btn.active').forEach(b => {
                    if (b !== this) b.classList.remove('active');
                });

                // Toggle selected accordion
                popover.classList.toggle('open', !isOpen);
                this.classList.toggle('active', !isOpen);
            }
        });
    });

    // Close popovers when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.benchmark-info-btn') && !e.target.closest('.benchmark-popover')) {
            document.querySelectorAll('.benchmark-popover.open').forEach(p => {
                p.classList.remove('open');
            });
            document.querySelectorAll('.benchmark-info-btn.active').forEach(b => {
                b.classList.remove('active');
            });
        }
    });

    // 6. Classification Rules toggle with smooth accordion animation
    const rulesBtn = document.getElementById('btn-toggle-rules');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', function() {
            const rulesDrawer = document.getElementById('collapsible-rules');
            const rulesText = document.getElementById('rules-toggle-text');
            const rulesIcon = document.getElementById('rules-toggle-icon');
            if (!rulesDrawer) return;

            const isOpen = rulesDrawer.classList.contains('open');

            if (isOpen) {
                rulesDrawer.classList.remove('open');
                this.classList.remove('active');
                if (rulesText) rulesText.textContent = 'View Classification Rules';
                if (rulesIcon) {
                    rulesIcon.classList.remove('fa-chevron-up');
                    rulesIcon.classList.add('fa-chevron-down');
                }
            } else {
                rulesDrawer.classList.add('open');
                this.classList.add('active');
                if (rulesText) rulesText.textContent = 'Hide Classification Rules';
                if (rulesIcon) {
                    rulesIcon.classList.remove('fa-chevron-down');
                    rulesIcon.classList.add('fa-chevron-up');
                }
            }
        });
    }

    // 7. Full Reference Drawer toggle with smooth accordion animation
    const benchmarksDrawerBtn = document.getElementById('btn-toggle-all-benchmarks');
    if (benchmarksDrawerBtn) {
        benchmarksDrawerBtn.addEventListener('click', function() {
            const drawer = document.getElementById('all-benchmarks-drawer');
            if (!drawer) return;

            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                drawer.classList.remove('open');
                this.classList.remove('active');
            } else {
                drawer.classList.add('open');
                this.classList.add('active');
            }
        });
    }

    // 8. Sticky floating KPI bar & scroll observer
    const stickyBar = document.getElementById('sticky-kpi-bar');
    const btnStickyTop = document.getElementById('btn-sticky-top');

    if (stickyBar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 350) {
                stickyBar.style.display = 'flex';
            } else {
                stickyBar.style.display = 'none';
            }
        });
    }

    if (btnStickyTop) {
        btnStickyTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 9. Load Sample Village Data
    const loadSampleBtn = document.getElementById('btn-load-sample');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', function() {
            for (const [id, val] of Object.entries(sampleVillageData)) {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.value = val;
                    elem.dispatchEvent(new Event('input', { bubbles: true }));
                    elem.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // Also prefill sample metadata for PDF export
            const vNameInput = document.getElementById('pdf-village-name');
            const vTalukaInput = document.getElementById('pdf-taluka');
            const vAssessorInput = document.getElementById('pdf-assessor');
            if (vNameInput && !vNameInput.value) vNameInput.value = 'Rampur';
            if (vTalukaInput && !vTalukaInput.value) vTalukaInput.value = 'Mansa Taluka';
            if (vAssessorInput && !vAssessorInput.value) vAssessorInput.value = 'W4C Field Survey Team / IITGN';

            const originalHtml = loadSampleBtn.innerHTML;
            loadSampleBtn.innerHTML = '<i class="fas fa-check"></i> Sample Data Loaded!';
            setTimeout(() => {
                loadSampleBtn.innerHTML = originalHtml;
            }, 2000);
        });
    }

    // 10. Reset All Data
    const resetBtn = document.getElementById('btn-reset-all');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            for (const id of Object.keys(sampleVillageData)) {
                const elem = document.getElementById(id);
                if (elem) {
                    if (elem.tagName.toLowerCase() === 'select') {
                        elem.selectedIndex = 0;
                    } else {
                        elem.value = '';
                    }
                    elem.dispatchEvent(new Event('input', { bubbles: true }));
                    elem.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            const vNameInput = document.getElementById('pdf-village-name');
            const vTalukaInput = document.getElementById('pdf-taluka');
            const vAssessorInput = document.getElementById('pdf-assessor');
            if (vNameInput) vNameInput.value = '';
            if (vTalukaInput) vTalukaInput.value = '';
            if (vAssessorInput) vAssessorInput.value = '';

            calculateHydrologicalRealm();
            calculateInfrastructureRealm();
            calculateWaterQualityRealm();
            calculateClimateRealm();
            calculateSocioEconomicRealm();
            calculateWaterSensitivityLevel();
        });
    }

    // 11. PDF Export Modal & Report Generation
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnStickyPdf = document.getElementById('btn-sticky-pdf');
    const pdfModalOverlay = document.getElementById('pdf-modal-overlay');
    const btnClosePdfModal = document.getElementById('btn-close-pdf-modal');
    const btnCancelPdf = document.getElementById('btn-cancel-pdf');
    const pdfMetadataForm = document.getElementById('pdf-metadata-form');
    const pdfVillageInput = document.getElementById('pdf-village-name');
    const pdfDateInput = document.getElementById('pdf-date');

    function openPdfModal() {
        if (!pdfModalOverlay) return;
        
        // Ensure date is set to today
        if (pdfDateInput && !pdfDateInput.value) {
            pdfDateInput.value = new Date().toISOString().split('T')[0];
        }

        // Show modal
        pdfModalOverlay.style.display = 'flex';
        setTimeout(() => {
            pdfVillageInput?.focus();
        }, 100);
    }

    function closePdfModal() {
        if (!pdfModalOverlay) return;
        pdfModalOverlay.style.display = 'none';
    }

    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', openPdfModal);
    }

    if (btnStickyPdf) {
        btnStickyPdf.addEventListener('click', openPdfModal);
    }

    if (btnClosePdfModal) {
        btnClosePdfModal.addEventListener('click', closePdfModal);
    }

    if (btnCancelPdf) {
        btnCancelPdf.addEventListener('click', closePdfModal);
    }

    if (pdfModalOverlay) {
        pdfModalOverlay.addEventListener('click', function(e) {
            if (e.target === pdfModalOverlay) {
                closePdfModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModalOverlay && pdfModalOverlay.style.display === 'flex') {
            closePdfModal();
        }
    });

    if (pdfMetadataForm) {
        pdfMetadataForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const villageName = document.getElementById('pdf-village-name')?.value.trim();
            const taluka = document.getElementById('pdf-taluka')?.value.trim();
            const district = document.getElementById('pdf-district')?.value.trim();
            const state = document.getElementById('pdf-state')?.value.trim();
            const assessor = document.getElementById('pdf-assessor')?.value.trim();
            const assessDate = document.getElementById('pdf-date')?.value;

            if (!villageName) {
                alert('Please enter the Village Name to generate the official report.');
                document.getElementById('pdf-village-name')?.focus();
                return;
            }

            const btnConfirm = document.getElementById('btn-confirm-pdf');
            const originalBtnHtml = btnConfirm ? btnConfirm.innerHTML : '';
            if (btnConfirm) {
                btnConfirm.disabled = true;
                btnConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
            }

            setTimeout(() => {
                try {
                    if (window.VWRI_PDF_Generator && window.VWRI_PDF_Generator.generatePDFReport) {
                        window.VWRI_PDF_Generator.generatePDFReport({
                            villageName: villageName,
                            taluka: taluka,
                            district: district,
                            state: state,
                            assessor: assessor || 'Technical Survey Team',
                            assessmentDate: assessDate
                        });
                        closePdfModal();
                    } else {
                        alert('PDF Generator module is initializing. Please try again.');
                    }
                } catch (err) {
                    console.error('PDF Generation Error:', err);
                    alert('An error occurred during PDF generation: ' + err.message);
                } finally {
                    if (btnConfirm) {
                        btnConfirm.disabled = false;
                        btnConfirm.innerHTML = originalBtnHtml;
                    }
                }
            }, 100);
        });
    }
}


// EVENT LISTENERS BINDING


document.addEventListener('DOMContentLoaded', function() {
    // Realm 1: Hydrological
    document.getElementById('groundWater-depth')?.addEventListener('input', calculateGroundWaterDepth);
    document.getElementById('groundWater-Level')?.addEventListener('input', calculateGroundWaterLevel);
    document.getElementById('AGR')?.addEventListener('input', calculateRechargePotential);
    document.getElementById('VGA')?.addEventListener('input', calculateRechargePotential);
    document.getElementById('drinkingwater-sources')?.addEventListener('input', calculateWaterSourceDensity);
    document.getElementById('village-area')?.addEventListener('input', calculateWaterSourceDensity);
    document.getElementById('water-body-weights')?.addEventListener('input', calculateAquaHealthIndex);
    document.getElementById('water-body-areas')?.addEventListener('input', calculateAquaHealthIndex);
    document.getElementById('source-supplied-water')?.addEventListener('input', calculateSourceReliability);
    document.getElementById('Annual-available-water')?.addEventListener('input', calculateWaterAvailability);
    document.getElementById('total-population')?.addEventListener('input', calculateWaterAvailability);
    document.getElementById('surface-water-available')?.addEventListener('input', calculateSurfaceWaterAvailability);
    document.getElementById('storage-capacity')?.addEventListener('input', calculateSurfaceWaterAvailability);

    // Realm 2: Infrastructure
    document.getElementById('households-tapconnection')?.addEventListener('input', calculateSupplyCoverage);
    document.getElementById('households')?.addEventListener('input', calculateSupplyCoverage);
    document.getElementById('storage-tank-capacity')?.addEventListener('input', calculateStorageCapacity);
    document.getElementById('villagepopulation')?.addEventListener('input', calculateStorageCapacity);
    document.getElementById('Source-Operational-reliability')?.addEventListener('input', calculateOperationalReliability);
    document.getElementById('Pipeline-Network-density')?.addEventListener('input', calculatePipelineNetwork);
    document.getElementById('Village-area')?.addEventListener('input', calculatePipelineNetwork);
    document.getElementById('breakdowns-recorded')?.addEventListener('input', calculateBreakdownFrequency);
    document.getElementById('water-supply-units')?.addEventListener('input', calculateBreakdownFrequency);
    document.getElementById('functioning-backup-source')?.addEventListener('input', calculateBackupCoverage);
    document.getElementById('Total-habitations')?.addEventListener('input', calculateBackupCoverage);
    document.getElementById('water-delivered-consumers')?.addEventListener('input', calculateDistributionEfficiency);
    document.getElementById('water-produced-source')?.addEventListener('input', calculateDistributionEfficiency);
    document.getElementById('functional-infrastructureunits-disaster')?.addEventListener('input', calculateDisasterResilience);
    document.getElementById('infrastructure-exposed-disaster')?.addEventListener('input', calculateDisasterResilience);
    document.getElementById('pipeline-networ-resistantmaterial')?.addEventListener('input', calculatePipeMaterialQuality);
    document.getElementById('pipeline-network-length')?.addEventListener('input', calculatePipeMaterialQuality);

    // Realm 3: Water Quality
    document.getElementById('CWQI-input')?.addEventListener('input', calculateCWQI);
    document.getElementById('source-stested-quality-parameters')?.addEventListener('input', calculateSafeSourceRatio);
    document.getElementById('Total-sources')?.addEventListener('input', calculateSafeSourceRatio);
    document.getElementById('WQI-pre-monsoon')?.addEventListener('input', calculateSeasonalStability);
    document.getElementById('WQI-post-monsoon')?.addEventListener('input', calculateSeasonalStability);
    document.getElementById('Ecoli-and-total-coliform')?.addEventListener('input', calculateCompositeBiologicalWaterQuality);
    document.getElementById('Total-samples-tested')?.addEventListener('input', calculateCompositeBiologicalWaterQuality);

    // Realm 4: Climate
    document.getElementById('Rainfall-SD')?.addEventListener('input', calculateRainfallVariability);
    document.getElementById('Rainfall-Mean')?.addEventListener('input', calculateRainfallVariability);
    document.getElementById('MSPI-input')?.addEventListener('input', calculateMeanSPI);
    document.getElementById('CDY-input')?.addEventListener('input', calculateConsecutiveDryYears);
    document.getElementById('drought-years-count')?.addEventListener('input', calculateDroughtFrequency);
    document.getElementById('total-years-record')?.addEventListener('input', calculateDroughtFrequency);
    document.getElementById('TTS-input')?.addEventListener('input', calculateTemperatureTrend);
    document.getElementById('recharge-pct-change')?.addEventListener('input', calculateRechargeSensitivity);
    document.getElementById('rainfall-pct-change')?.addEventListener('input', calculateRechargeSensitivity);
    document.getElementById('baseline-ghg')?.addEventListener('input', calculateGHGEmissionControl);
    document.getElementById('actual-ghg')?.addEventListener('input', calculateGHGEmissionControl);

    // Realm 5: Socio-economic
    document.getElementById('annual-household-income')?.addEventListener('input', calculatePerCapitaIncome);
    document.getElementById('household-size')?.addEventListener('input', calculatePerCapitaIncome);
    document.getElementById('livestock-slu')?.addEventListener('input', calculateLivestockDependency);
    document.getElementById('human-population-lr')?.addEventListener('input', calculateLivestockDependency);
    document.getElementById('migrating-households')?.addEventListener('input', calculateMigrationRate);
    document.getElementById('total-households-mr')?.addEventListener('input', calculateMigrationRate);
    document.getElementById('active-vwsc-participants')?.addEventListener('input', calculateCommunityParticipation);
    document.getElementById('eligible-adult-population')?.addEventListener('input', calculateCommunityParticipation);
    document.getElementById('cgs-q1')?.addEventListener('change', calculateGovernanceIndex);
    document.getElementById('cgs-q2')?.addEventListener('change', calculateGovernanceIndex);
    document.getElementById('cgs-q3')?.addEventListener('change', calculateGovernanceIndex);
    document.getElementById('wcpr-ar-households')?.addEventListener('input', calculateWaterConservationParticipation);
    document.getElementById('wcpr-cfi-households')?.addEventListener('input', calculateWaterConservationParticipation);
    document.getElementById('wcpr-total-households')?.addEventListener('input', calculateWaterConservationParticipation);

    // Initialize UI Controls (Tabs, Popovers, Rules drawer, Sticky bar, Sample data, Reset)
    initUIControls();
});

// Animations & Intersection Observer
const contentSections = document.querySelectorAll('.content-section');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

contentSections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sticky Navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'white';
            navbar.style.boxShadow = 'none';
        }
    }
});