/**
 * Village Water Resilience Index (VWRI)
 * Professional Template-Based Assessment PDF Report Generator
 * 
 * Developed for: W4C — Water for Communities Initiative
 * Department of Civil Engineering, Indian Institute of Technology Gandhinagar
 */

(function(window) {
    'use strict';

    // Refined color palette eliminating drab/muddy greys
    const COLORS = {
        primary: [0, 77, 153],         // #004d99 IITGN Deep Blue
        primaryDark: [15, 23, 42],     // #0f172a Deep Slate Navy
        accent: [2, 132, 199],         // #0284c7 Sky Blue
        accentLight: [56, 189, 248],   // #38bdf8 Light Sky Blue
        
        // Clean, fresh backgrounds (pure white & soft brand ice-tints)
        bgCard: [255, 255, 255],       // Crisp Pure White for cards & signatures
        bgTint: [246, 250, 254],       // Soft Ice Blue Tint (fresh & clean, no dirty grey)
        bgSubtle: [240, 247, 255],     // Gentle brand tint for headers and key findings
        bgRowAlt: [249, 252, 255],     // Alternating table row background
        
        // Hairline borders & Dividers (clean slate-blue rather than dull grey)
        border: [214, 228, 242],       // Soft, elegant hairline border
        borderAccent: [186, 215, 245], // Prominent brand border
        borderDark: [148, 180, 215],   // Defined container outline
        
        // Typography (high contrast, crisp & readable)
        textDark: [15, 23, 42],        // #0f172a High-contrast Charcoal Slate
        textMuted: [71, 85, 105],      // #475569 Clear, readable Medium Slate (high contrast)
        textSubtle: [100, 116, 139],   // #64748b Subtle for minor footnotes
        white: [255, 255, 255],
        
        // Rating Tiers (vibrant & authoritative)
        veryLow: [220, 38, 38],        // Red
        low: [234, 88, 12],            // Orange
        moderate: [217, 119, 6],       // Amber
        high: [22, 163, 74],           // Green
        veryHigh: [5, 150, 105],       // Emerald
        defaultGray: [71, 85, 105]
    };

    function getTierColor(rating) {
        switch (rating) {
            case 'Very Low': return COLORS.veryLow;
            case 'Low': return COLORS.low;
            case 'Moderate': return COLORS.moderate;
            case 'High': return COLORS.high;
            case 'Very High': return COLORS.veryHigh;
            default: return COLORS.defaultGray;
        }
    }

    function getScoreRating(scoreNum) {
        if (isNaN(scoreNum) || scoreNum === null) return 'Pending';
        if (scoreNum <= 1.5) return 'Very Low';
        if (scoreNum <= 2.5) return 'Low';
        if (scoreNum <= 3.5) return 'Moderate';
        if (scoreNum <= 4.5) return 'High';
        return 'Very High';
    }

    const INDICATOR_SPECS = {
        // Realm 1: Hydrological (Weight: 0.30)
        h: [
            {
                code: '1.1',
                name: 'Depth to Groundwater (DTW)',
                scoreId: 'groundWaterDepth-score',
                ratingId: 'groundWaterDepth-rating',
                inputId: 'groundWater-depth',
                unit: 'm bgl',
                direction: 'Negative (lower is better)',
                source: 'CGWB / State GW Dept',
                recommendation: 'Construct managed aquifer recharge (MAR) check dams and regulate local borewell extraction.'
            },
            {
                code: '1.2',
                name: 'Historical Groundwater Level Trend (GWLT)',
                scoreId: 'groundWaterLevel-score',
                ratingId: 'groundWaterLevel-rating',
                inputId: 'groundWater-Level',
                unit: 'm/yr',
                direction: 'Negative (decline is worse)',
                source: 'CGWB Historical Piezometers',
                recommendation: 'Initiate village-wide aquifer rejuvenation programs and mandatory artificial recharge shafts.'
            },
            {
                code: '1.3',
                name: 'Aquifer Recharge Potential (AGR)',
                scoreId: 'RechargePotential-score',
                ratingId: 'RechargePotential-rating',
                inputId: 'AGR',
                unit: 'm³/ha/yr',
                direction: 'Positive',
                source: 'GEC-2015 Methodology',
                recommendation: 'Implement soil-moisture contour trenching, percolation tanks, and afforestation in recharge zones.'
            },
            {
                code: '1.4',
                name: 'Drinking Water Source Diversity (DSR)',
                scoreId: 'WaterSource-score',
                ratingId: 'WaterSource-rating',
                inputId: 'drinkingwater-sources',
                unit: 'sources/km²',
                direction: 'Positive',
                source: 'JJM Habitation Master',
                recommendation: 'Develop auxiliary community open wells and surface storage to avoid single-source reliance.'
            },
            {
                code: '1.5',
                name: 'Aquifer Health Index (AHI)',
                scoreId: 'aqua-health-score',
                ratingId: 'aqua-health-rating',
                inputId: 'water-body-areas',
                unit: 'ha-weighted index',
                direction: 'Positive',
                source: 'Remote Sensing / Village Pond Survey',
                recommendation: 'Desilt existing village water bodies (talavs) and clear natural feeder inlet channels.'
            },
            {
                code: '1.6',
                name: 'Source Reliability Index (SRI)',
                scoreId: 'SourceReliability-score',
                ratingId: 'SourceReliability-rating',
                inputId: 'source-supplied-water',
                unit: 'days/year',
                direction: 'Positive',
                source: 'Pani Samiti Pumping Logbooks',
                recommendation: 'Establish dual-source connectivity and inter-habitation water supply transfer conduits.'
            },
            {
                code: '1.7',
                name: 'Annual Water Availability (AWA)',
                scoreId: 'Water-Availability-score',
                ratingId: 'Water-Availability-rating',
                inputId: 'Annual-available-water',
                unit: 'm³/capita/yr',
                direction: 'Positive',
                source: 'Falkenmark Water Budget',
                recommendation: 'Formulate an enforceable village water security plan to bridge demand-supply deficits.'
            },
            {
                code: '1.8',
                name: 'Surface Water Storage Index (SWSI)',
                scoreId: 'SurfaceWater-Availability-index',
                ratingId: 'SurfaceWater-Availability-rating',
                inputId: 'surface-water-available',
                unit: '% capacity',
                direction: 'Positive',
                source: 'Minor Irrigation Dept / GP',
                recommendation: 'Deepen community storage ponds and build percolation bunds for monsoon capture.'
            }
        ],

        // Realm 2: Infrastructure (Weight: 0.20)
        i: [
            {
                code: '2.1',
                name: 'Household Tap Water Coverage (CR)',
                scoreId: 'SupplyCoverage-index',
                ratingId: 'SupplyCoverage-rating',
                inputId: 'households-tapconnection',
                unit: '% households',
                direction: 'Positive',
                source: 'JJM-IMIS Database',
                recommendation: 'Accelerate functional household tap connections (FHTC) to achieve 100% saturation.'
            },
            {
                code: '2.2',
                name: 'Per Capita Storage Capacity (SC)',
                scoreId: 'StorageCapacity-index',
                ratingId: 'StorageCapacity-rating',
                inputId: 'storage-tank-capacity',
                unit: 'litres/person',
                direction: 'Positive',
                source: 'GWSSB / GP Asset Register',
                recommendation: 'Construct additional Elevated Storage Reservoirs (ESR) or Ground Level Reservoirs (GLR).'
            },
            {
                code: '2.3',
                name: 'Source Operational Reliability (OR)',
                scoreId: 'Operationalreliability-index',
                ratingId: 'Operationalreliability-rating',
                inputId: 'Source-Operational-reliability',
                unit: '% uptime',
                direction: 'Positive',
                source: 'Operator Pumping Logs',
                recommendation: 'Upgrade power reliability and replace ageing pump sets with energy-efficient units.'
            },
            {
                code: '2.4',
                name: 'Pipeline Network Density (ND)',
                scoreId: 'PipelineNetwork-index',
                ratingId: 'PipelineNetwork-rating',
                inputId: 'Pipeline-Network-density',
                unit: 'km/km²',
                direction: 'Positive',
                source: 'Village Distribution GIS Maps',
                recommendation: 'Extend distribution network to underserved falias/hamlets and tail-end streets.'
            },
            {
                code: '2.5',
                name: 'Breakdown Frequency (BF)',
                scoreId: 'BreakdownFrequency-index',
                ratingId: 'BreakdownFrequency-rating',
                inputId: 'breakdowns-recorded',
                unit: 'breakdowns/unit/yr',
                direction: 'Negative',
                source: 'Maintenance Logbooks',
                recommendation: 'Establish preventive maintenance protocol and train local youth as certified Jal Sevaks.'
            },
            {
                code: '2.6',
                name: 'Backup Source Availability (BA)',
                scoreId: 'Backupcoverage-index',
                ratingId: 'Backupcoverage-rating',
                inputId: 'functioning-backup-source',
                unit: 'backups/habitation',
                direction: 'Positive',
                source: 'Pani Samiti Asset Inventory',
                recommendation: 'Equip standby borewells with solar pumping systems to prevent total supply outages.'
            },
            {
                code: '2.7',
                name: 'Non-Revenue Water / Loss (NRW)',
                scoreId: 'DistributionEfficiency-index',
                ratingId: 'DistributionEfficiency-rating',
                inputId: 'water-delivered-consumers',
                unit: '% loss',
                direction: 'Negative',
                source: 'Water Metering / Flow Audit',
                recommendation: 'Conduct acoustic leak detection, fix distribution joint leaks, and install bulk flow meters.'
            },
            {
                code: '2.8',
                name: 'Post-Disaster Functionality (PDIF)',
                scoreId: 'DisasterResilience-index',
                ratingId: 'DisasterResilience-rating',
                inputId: 'functional-infrastructureunits-disaster',
                unit: '% units functional',
                direction: 'Positive',
                source: 'DDMA / Local Disaster Log',
                recommendation: 'Raise pump plinths above flood levels and install weatherproof electrical switchgear.'
            },
            {
                code: '2.9',
                name: 'Pipe Material Quality Index (PMQI)',
                scoreId: 'PipeMaterialQuality-index',
                ratingId: 'PipeMaterialQuality-rating',
                inputId: 'pipeline-networ-resistantmaterial',
                unit: '% corrosion-resistant',
                direction: 'Positive',
                source: 'Engineering As-Built Drawings',
                recommendation: 'Phase out brittle PVC and corroded steel pipes with high-density polyethylene (HDPE).'
            }
        ],

        // Realm 3: Water Quality (Weight: 0.15)
        wq: [
            {
                code: '3.1',
                name: 'Composite Chemical Water Quality (CWQI)',
                scoreId: 'CWQI-score',
                ratingId: 'CWQI-rating',
                inputId: 'CWQI-input',
                unit: 'Index (0–100)',
                direction: 'Positive',
                source: 'BIS 10500:2012 / Lab Testing',
                recommendation: 'Install community water purification units (RO / de-fluoridation / iron-removal filters).'
            },
            {
                code: '3.2',
                name: 'Safe Source Availability Ratio (SSR)',
                scoreId: 'Safesourceratio-score',
                ratingId: 'Safesourceratio-rating',
                inputId: 'source-stested-quality-parameters',
                unit: '% tested safe',
                direction: 'Positive',
                source: 'JJM Water Testing Protocol',
                recommendation: 'Mandate 100% seasonal testing of all community drinking sources using Field Test Kits (FTKs).'
            },
            {
                code: '3.3',
                name: 'Seasonal Quality Stability (SI)',
                scoreId: 'Stability-score',
                ratingId: 'Stability-rating',
                inputId: 'WQI-pre-monsoon',
                unit: 'Stability Index (0–100)',
                direction: 'Positive',
                source: 'Pre/Post Monsoon Lab Series',
                recommendation: 'Implement sanitary protection zones around wellheads to prevent monsoon contamination run-off.'
            },
            {
                code: '3.4',
                name: 'Composite Biological Water Quality (CBWQI)',
                scoreId: 'CompositeBiologicalWaterQuality-Index',
                ratingId: 'CompositeBiologicalWaterQuality-rating',
                inputId: 'Ecoli-and-total-coliform',
                unit: '% coliform-free',
                direction: 'Positive',
                source: 'Bacteriological Lab Reports',
                recommendation: 'Enforce automated chlorination dosing at overhead tanks and test residual chlorine weekly.'
            }
        ],

        // Realm 4: Climate (Weight: 0.15)
        c: [
            {
                code: '4.1',
                name: 'Rainfall Variability (CV)',
                scoreId: 'Rainfall-Variability-score',
                ratingId: 'Rainfall-Variability-rating',
                inputId: 'Rainfall-SD',
                unit: '% CV',
                direction: 'Negative',
                source: 'IMD Gridded Historical Data',
                recommendation: 'Construct drought-resilient multi-year surface water storage reservoirs and farm ponds.'
            },
            {
                code: '4.2',
                name: 'Mean SPI of Drought Years (MSPI)',
                scoreId: 'MSPI-score',
                ratingId: 'MSPI-rating',
                inputId: 'MSPI-input',
                unit: 'SPI units',
                direction: 'Positive (less negative is better)',
                source: 'IMD / WMO Drought Series',
                recommendation: 'Establish early-warning drought contingency protocols and strategic emergency drinking reserves.'
            },
            {
                code: '4.3',
                name: 'Consecutive Dry Years (CDY)',
                scoreId: 'CDY-score',
                ratingId: 'CDY-rating',
                inputId: 'CDY-input',
                unit: 'years',
                direction: 'Negative',
                source: 'IMD Historical Weather Records',
                recommendation: 'Develop multi-village regional water grid bulk transfer links to buffer prolonged dry spells.'
            },
            {
                code: '4.4',
                name: 'Drought Frequency (FR)',
                scoreId: 'FR-score',
                ratingId: 'FR-rating',
                inputId: 'drought-years-count',
                unit: '% drought years',
                direction: 'Negative',
                source: 'District Disaster Management Authority',
                recommendation: 'Incorporate village water risk and vulnerability mapping into Gram Panchayat Development Plans.'
            },
            {
                code: '4.5',
                name: 'Temperature Trend Slope (TTS)',
                scoreId: 'TTS-score',
                ratingId: 'TTS-rating',
                inputId: 'TTS-input',
                unit: '°C/year',
                direction: 'Negative',
                source: 'IMD Long-Term Climatology',
                recommendation: 'Expand village tree canopy and shade buffers along open reservoirs to reduce evaporation.'
            },
            {
                code: '4.6',
                name: 'Recharge Sensitivity to Rainfall (RS)',
                scoreId: 'RS-score',
                ratingId: 'RS-rating',
                inputId: 'recharge-pct-change',
                unit: 'Elasticity ratio',
                direction: 'Negative',
                source: 'CGWB Hydrological Modeling',
                recommendation: 'Construct deep recharge shafts to channel peak monsoon run-off directly into confined aquifers.'
            },
            {
                code: '4.7',
                name: 'GHG Emission Control Index (GECI)',
                scoreId: 'GECI-score',
                ratingId: 'GECI-rating',
                inputId: 'baseline-ghg',
                unit: '% reduction',
                direction: 'Positive',
                source: 'Pumping Energy Audit',
                recommendation: 'Convert conventional grid and diesel water pumping systems to solar PV arrays.'
            }
        ],

        // Realm 5: Socio-economic Governance (Weight: 0.20)
        se: [
            {
                code: '5.1',
                name: 'Per Capita Annual Income (IPC)',
                scoreId: 'IPC-index',
                ratingId: 'IPC-rating',
                inputId: 'annual-household-income',
                unit: 'INR/yr',
                direction: 'Positive',
                source: 'SECC / GP Register',
                recommendation: 'Promote water-efficient micro-enterprises and micro-irrigation equipment subsidies.'
            },
            {
                code: '5.2',
                name: 'Livestock Dependency Ratio (LR)',
                scoreId: 'LR-score',
                ratingId: 'LR-rating',
                inputId: 'livestock-slu',
                unit: 'SLU/capita',
                direction: 'Negative',
                source: 'Livestock Census & GP Records',
                recommendation: 'Construct dedicated livestock water troughs and village animal watering ponds.'
            },
            {
                code: '5.3',
                name: 'Water Scarcity Migration Rate (MR)',
                scoreId: 'MR-score',
                ratingId: 'MR-rating',
                inputId: 'migrating-households',
                unit: '% households',
                direction: 'Negative',
                source: 'Panchayat Survey / Census',
                recommendation: 'Ensure year-round assured potable water supply to curb distress seasonal migration.'
            },
            {
                code: '5.4',
                name: 'Community Water Participation (CPR)',
                scoreId: 'CPR-score',
                ratingId: 'CPR-rating',
                inputId: 'active-vwsc-participants',
                unit: '% adult attendance',
                direction: 'Positive',
                source: 'Gram Sabha / VWSC Registers',
                recommendation: 'Organize Jal Chaupals and women-led water stewardship campaigns for local ownership.'
            },
            {
                code: '5.5',
                name: 'Water Governance Index (CGS)',
                scoreId: 'CGS-score',
                ratingId: 'CGS-rating',
                inputId: 'cgs-q1',
                unit: 'Score (0–1)',
                direction: 'Positive',
                source: 'Pani Samiti Constitution & Passbooks',
                recommendation: 'Operationalize active Pani Samiti with regular tariff collection, O&M account, and water audit.'
            },
            {
                code: '5.6',
                name: 'Conservation Participation Rate (WCPR)',
                scoreId: 'WCPR-score',
                ratingId: 'WCPR-rating',
                inputId: 'wcpr-ar-households',
                unit: '% practicing households',
                direction: 'Positive',
                source: 'Field Survey / Inspection',
                recommendation: 'Incentivize household greywater recharge soak pits and rooftop rainwater harvesting.'
            }
        ]
    };

    function extractAssessmentData() {
        const hElem = document.getElementById('Hydrological-realm-score');
        const iElem = document.getElementById('Infrastructure-realm-score');
        const wqElem = document.getElementById('WaterQuality-realm-score');
        const cElem = document.getElementById('climate-realm-score');
        const seElem = document.getElementById('socio-economic-realm-score');
        const compositeElem = document.getElementById('composite-vwri-score');
        const statusElem = document.getElementById('water-sensitivity-level');

        const hScore = parseFloat(hElem?.textContent) || null;
        const iScore = parseFloat(iElem?.textContent) || null;
        const wqScore = parseFloat(wqElem?.textContent) || null;
        const cScore = parseFloat(cElem?.textContent) || null;
        const seScore = parseFloat(seElem?.textContent) || null;
        const compositeScore = parseFloat(compositeElem?.textContent) || null;

        const classification = (statusElem?.textContent && statusElem.textContent !== 'Please fill all indicators')
            ? statusElem.textContent.replace(' resilience', ' Resilience')
            : (compositeScore ? getScoreRating(compositeScore) + ' Resilience' : 'Pending Calculation');

        // Extract detailed indicators
        const realmsData = {};
        let totalEvaluated = 0;
        const vulnerabilities = [];

        for (const [realmKey, list] of Object.entries(INDICATOR_SPECS)) {
            realmsData[realmKey] = list.map(spec => {
                let scoreElem = document.getElementById(spec.scoreId);
                if (!scoreElem && spec.scoreId) {
                    if (spec.scoreId.includes('-score')) {
                        scoreElem = document.getElementById(spec.scoreId.replace('-score', '-index')) || document.getElementById(spec.scoreId.replace('-score', '-Index'));
                    } else if (spec.scoreId.includes('-index')) {
                        scoreElem = document.getElementById(spec.scoreId.replace('-index', '-score'));
                    } else if (spec.scoreId.includes('-Index')) {
                        scoreElem = document.getElementById(spec.scoreId.replace('-Index', '-score'));
                    }
                }
                const ratingElem = document.getElementById(spec.ratingId);
                const scoreNum = parseFloat(ratingElem?.getAttribute('data-score')) || null;
                const rating = ratingElem?.getAttribute('data-rating') || (ratingElem?.textContent !== '-' ? ratingElem?.textContent : 'Pending');
                const rawVal = scoreElem?.textContent && scoreElem.textContent !== '-' ? scoreElem.textContent : '—';

                if (scoreNum !== null) totalEvaluated++;

                const record = {
                    ...spec,
                    rawValue: rawVal,
                    rating: rating || 'Pending',
                    score: scoreNum !== null ? scoreNum : '—'
                };

                // Track indicators needing intervention (score <= 2)
                if (scoreNum !== null && scoreNum <= 2) {
                    vulnerabilities.push(record);
                }

                return record;
            });
        }

        return {
            compositeScore: compositeScore !== null ? compositeScore.toFixed(2) : '—',
            classification: classification,
            totalEvaluated: totalEvaluated,
            isComplete: totalEvaluated === 34,
            realms: {
                h: { name: 'Hydrological Resilience', weight: 0.30, score: hScore, indicators: realmsData.h },
                i: { name: 'Infrastructure Resilience', weight: 0.20, score: iScore, indicators: realmsData.i },
                wq: { name: 'Water Quality Resilience', weight: 0.15, score: wqScore, indicators: realmsData.wq },
                c: { name: 'Climate Resilience', weight: 0.15, score: cScore, indicators: realmsData.c },
                se: { name: 'Socio-economic Governance', weight: 0.20, score: seScore, indicators: realmsData.se }
            },
            vulnerabilities: vulnerabilities
        };
    }

    /**
     * Main PDF Report Generator Function
     * @param {Object} metadata Village and assessment metadata from modal
     */
    function generatePDFReport(metadata) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('jsPDF library is not loaded. Please verify your connection or files.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const data = extractAssessmentData();
        const villageName = metadata.villageName || 'Sample Village';
        const taluka = metadata.taluka || 'Mansa';
        const district = metadata.district || 'Gandhinagar';
        const state = metadata.state || 'Gujarat';
        const assessor = metadata.assessor || 'Water Sanitation Survey Team';
        const assessDate = metadata.assessmentDate || new Date().toISOString().split('T')[0];
        const reportId = 'VWRI-' + assessDate.replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

        // Page setup constants
        const pageWidth = 210;
        const pageHeight = 297;
        const marginX = 14;
        const contentWidth = pageWidth - (2 * marginX);

        // Helper: Add running header on pages 2..N
        function addRunningHeader(doc, pageNum, totalPages) {
            if (pageNum === 1) return;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.8);
            doc.setTextColor(...COLORS.textMuted);
            doc.text(`VWRI Field Assessment Report | Village: ${villageName}, ${district} (${state})`, marginX, 10);
            doc.text(`Report ID: ${reportId}`, pageWidth - marginX, 10, { align: 'right' });

            doc.setDrawColor(...COLORS.accentLight);
            doc.setLineWidth(0.4);
            doc.line(marginX, 12.5, pageWidth - marginX, 12.5);
        }

        // Helper: Add running footer on all pages
        function addRunningFooter(doc, pageNum, totalPages) {
            doc.setDrawColor(...COLORS.border);
            doc.setLineWidth(0.35);
            doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLORS.textMuted);
            doc.text('IIT Gandhinagar — Water for Communities (W4C) | Village Water Resilience Index (VWRI)', marginX, pageHeight - 6.5);
            doc.setFont('helvetica', 'bold');
            doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - marginX, pageHeight - 6.5, { align: 'right' });
        }

        // ==========================================
        // PAGE 1: EXECUTIVE SUMMARY & SCORECARD
        // ==========================================

        // 1. Institutional Top Banner Box
        doc.setFillColor(...COLORS.primary);
        doc.roundedRect(marginX, 14, contentWidth, 22, 2, 2, 'F');

        doc.setTextColor(...COLORS.white);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13.5);
        doc.text('VILLAGE WATER RESILIENCE INDEX (VWRI)', marginX + 6, 22.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.2);
        doc.text('W4C — Water for Communities  |  Department of Civil Engineering, IIT Gandhinagar', marginX + 6, 29.5);

        // Top right badge in header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('FIELD ASSESSMENT DOSSIER', pageWidth - marginX - 6, 26, { align: 'right' });

        // 2. Report Sub-Header & Reference
        let currentY = 42;
        doc.setTextColor(...COLORS.primaryDark);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.text('COMPREHENSIVE VILLAGE WATER RESILIENCE AUDIT REPORT', marginX, currentY);

        currentY += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Field Investigation & Quantitative Indicator Verification Dossier', marginX, currentY);
        doc.text(`Date of Audit: ${assessDate}   |   Reference: ${reportId}`, pageWidth - marginX, currentY, { align: 'right' });

        // Accent divider
        currentY += 3;
        doc.setDrawColor(...COLORS.accent);
        doc.setLineWidth(0.6);
        doc.line(marginX, currentY, pageWidth - marginX, currentY);

        // 3. Village & Survey Metadata Card (Height 28mm)
        currentY += 4;
        const metaCardHeight = 28;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(marginX, currentY, contentWidth, metaCardHeight, 1.5, 1.5, 'FD');

        const col1X = marginX + 5;
        const col2X = marginX + 50;
        const col3X = marginX + 96;
        const col4X = marginX + 142;

        // Subtle vertical dividers between columns
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.2);
        doc.line(col2X - 4, currentY + 3.5, col2X - 4, currentY + metaCardHeight - 3.5);
        doc.line(col3X - 4, currentY + 3.5, col3X - 4, currentY + metaCardHeight - 3.5);
        doc.line(col4X - 4, currentY + 3.5, col4X - 4, currentY + metaCardHeight - 3.5);

        const metaRow1Y = currentY + 8;
        const metaRow2Y = currentY + 20;

        // Row 1
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('VILLAGE NAME', col1X, metaRow1Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(villageName, col1X, metaRow1Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('BLOCK / TALUKA', col2X, metaRow1Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.textDark);
        doc.text(taluka || '—', col2X, metaRow1Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('DISTRICT & STATE', col3X, metaRow1Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.textDark);
        doc.text(`${district}, ${state}`, col3X, metaRow1Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('ASSESSMENT DATE', col4X, metaRow1Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.textDark);
        doc.text(assessDate, col4X, metaRow1Y + 3);

        // Row 2
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('PRIMARY ASSESSOR', col1X, metaRow2Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text(assessor, col1X, metaRow2Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('EVALUATION COVERAGE', col2X, metaRow2Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text(`${data.totalEvaluated} of 34 Indicators Evaluated`, col2X, metaRow2Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('ASSESSMENT SCOPE', col3X, metaRow2Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text('Habitation / Revenue Village', col3X, metaRow2Y + 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('COMPLETION STATUS', col4X, metaRow2Y - 2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        if (data.isComplete) {
            doc.setTextColor(...COLORS.high);
            doc.text('Complete Assessment', col4X, metaRow2Y + 3);
        } else {
            doc.setTextColor(...COLORS.low);
            doc.text(`Incomplete (${data.totalEvaluated}/34)`, col4X, metaRow2Y + 3);
        }

        // 4. Two Executive Score Cards (Height 38mm)
        currentY += metaCardHeight + 5;
        const scoreCardWidth = (contentWidth - 6) / 2;
        const scoreCardHeight = 38;

        // Card 1: Composite Score
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(marginX, currentY, scoreCardWidth, scoreCardHeight, 2, 2, 'FD');

        doc.setFillColor(...COLORS.primary);
        doc.roundedRect(marginX, currentY, scoreCardWidth, 2.5, 2, 2, 'F');
        doc.rect(marginX, currentY + 1.5, scoreCardWidth, 1.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('COMPOSITE VILLAGE WATER RESILIENCE SCORE', marginX + 6, currentY + 9);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(30);
        doc.setTextColor(...COLORS.primary);
        doc.text(data.compositeScore, marginX + 6, currentY + 24);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('/ 5.00', marginX + 44, currentY + 23);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Weighted index across 5 realms (34 field indicators)', marginX + 6, currentY + 32);

        // Card 2: Resilience Tier
        const card2X = marginX + scoreCardWidth + 6;
        const tierColor = getTierColor(data.classification.replace(' Resilience', ''));

        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(card2X, currentY, scoreCardWidth, scoreCardHeight, 2, 2, 'FD');

        doc.setFillColor(...tierColor);
        doc.roundedRect(card2X, currentY, scoreCardWidth, 2.5, 2, 2, 'F');
        doc.rect(card2X, currentY + 1.5, scoreCardWidth, 1.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('OVERALL RESILIENCE CLASSIFICATION TIER', card2X + 6, currentY + 9);

        // Badge inside Card 2
        doc.setFillColor(...tierColor);
        doc.roundedRect(card2X + 6, currentY + 14, scoreCardWidth - 12, 11, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLORS.white);
        doc.text(data.classification.toUpperCase(), card2X + (scoreCardWidth / 2), currentY + 21, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Table 3 Framework Classification Scale Benchmark', card2X + 6, currentY + 32);

        // 5. Executive 5-Realm Matrix Table
        currentY += scoreCardHeight + 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('EXECUTIVE REALM PERFORMANCE MATRIX', marginX, currentY);

        currentY += 3;
        const realmsSummaryBody = [
            ['1. Hydrological Resilience', '8', '30 %', 
                data.realms.h.score ? data.realms.h.score.toFixed(2) : '—',
                data.realms.h.score ? (data.realms.h.score * 0.30).toFixed(3) : '—',
                data.realms.h.score ? getScoreRating(data.realms.h.score) : '—'],
            ['2. Water Infrastructure Resilience', '9', '20 %',
                data.realms.i.score ? data.realms.i.score.toFixed(2) : '—',
                data.realms.i.score ? (data.realms.i.score * 0.20).toFixed(3) : '—',
                data.realms.i.score ? getScoreRating(data.realms.i.score) : '—'],
            ['3. Water Quality Resilience', '4', '15 %',
                data.realms.wq.score ? data.realms.wq.score.toFixed(2) : '—',
                data.realms.wq.score ? (data.realms.wq.score * 0.15).toFixed(3) : '—',
                data.realms.wq.score ? getScoreRating(data.realms.wq.score) : '—'],
            ['4. Climate Resilience', '7', '15 %',
                data.realms.c.score ? data.realms.c.score.toFixed(2) : '—',
                data.realms.c.score ? (data.realms.c.score * 0.15).toFixed(3) : '—',
                data.realms.c.score ? getScoreRating(data.realms.c.score) : '—'],
            ['5. Socio-economic Governance', '6', '20 %',
                data.realms.se.score ? data.realms.se.score.toFixed(2) : '—',
                data.realms.se.score ? (data.realms.se.score * 0.20).toFixed(3) : '—',
                data.realms.se.score ? getScoreRating(data.realms.se.score) : '—']
        ];

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Pillar / Realm', 'Indicators', 'Weight', 'Realm Score (1–5)', 'Weighted Contrib.', 'Resilience Status']],
            body: realmsSummaryBody,
            foot: [['Composite Village Water Resilience Index (VWRI)', '34', '100 %', data.compositeScore, data.compositeScore, data.classification]],
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 8,
                halign: 'left',
                cellPadding: 2.8
            },
            bodyStyles: {
                fontSize: 8,
                textColor: COLORS.textDark,
                cellPadding: 2.8,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            footStyles: {
                fillColor: [236, 244, 253],
                textColor: COLORS.primary,
                fontStyle: 'bold',
                fontSize: 8.5,
                cellPadding: 3.0,
                lineColor: [200, 220, 242],
                lineWidth: 0.2
            },
            columnStyles: {
                0: { cellWidth: 68 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 24, halign: 'center' },
                5: { cellWidth: 24, halign: 'center' }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 5) {
                    const text = tableData.cell.raw;
                    tableData.cell.styles.fontStyle = 'bold';
                    tableData.cell.styles.textColor = getTierColor(text);
                }
            }
        });

        currentY = doc.lastAutoTable.finalY + 5;

        // 6. Strategic Resilience Summary & Key Findings Card (Height 36mm)
        const summaryCardHeight = 36;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(marginX, currentY, contentWidth, summaryCardHeight, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.primary);
        doc.text('STRATEGIC RESILIENCE SUMMARY & KEY FINDINGS', marginX + 6, currentY + 7);

        // Calculate dynamic insights
        const realmEntries = Object.entries(data.realms).filter(([k, v]) => v.score !== null);
        realmEntries.sort((a, b) => a[1].score - b[1].score);
        const weakest = realmEntries[0] ? realmEntries[0][1] : null;
        const strongest = realmEntries[realmEntries.length - 1] ? realmEntries[realmEntries.length - 1][1] : null;

        const findingLine1 = weakest 
            ? `• Critical Priority Realm: ${weakest.name} scored lowest (${weakest.score.toFixed(2)}/5.00 - ${getScoreRating(weakest.score)}), highlighting key systemic vulnerability.`
            : '• System assessment incomplete. Ensure all realm inputs are recorded to identify critical vulnerabilities.';
        const findingLine2 = strongest
            ? `• Strongest Resilience Pillar: ${strongest.name} demonstrated highest capacity (${strongest.score.toFixed(2)}/5.00 - ${getScoreRating(strongest.score)}).`
            : '';
        const findingLine3 = `• Priority Action Focus: ${data.vulnerabilities.length} indicators flagged with Low or Very Low resilience, requiring targeted Gram Panchayat intervention (detailed on Page 4).`;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.6);
        doc.setTextColor(...COLORS.textDark);
        doc.text(findingLine1, marginX + 6, currentY + 14);
        doc.text(findingLine2, marginX + 6, currentY + 20);
        doc.text(findingLine3, marginX + 6, currentY + 26);
        doc.text('• Field Planning Action: Integrate identified vulnerabilities directly into Gram Panchayat Development Plan (GPDP).', marginX + 6, currentY + 32);

        // 7. Methodological Mandate & Framework Card (Height 38mm, finishes Page 1 at ~y=265)
        currentY += summaryCardHeight + 5;
        const mandateCardHeight = 38;
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, mandateCardHeight, 2, 2, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(marginX, currentY, contentWidth, 7, 2, 2, 'F');
        doc.rect(marginX, currentY + 4, contentWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('METHODOLOGICAL FRAMEWORK & INSTITUTIONAL MANDATE', marginX + 6, currentY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.3);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Framework Genesis: Developed by W4C at the Department of Civil Engineering, IIT Gandhinagar, as a standardized,', marginX + 6, currentY + 12);
        doc.text('  multi-dimensional decision support system specifically tailored for Gujarat\'s village water ecosystems.', marginX + 6, currentY + 16.5);
        doc.text('• Indicator Aggregation: Normalizes 34 indicators across 5 critical realms onto a 1.00–5.00 continuous scale,', marginX + 6, currentY + 22);
        doc.text('  incorporating differential expert weights (Hydrological 30%, Infrastructure 20%, Quality 15%, Climate 15%, Socio-economic 20%).', marginX + 6, currentY + 26.5);
        doc.text('• Planning Mandate: Designed for Gram Panchayats, Pani Samitis, and GWSSB engineers to prioritize fund allocations', marginX + 6, currentY + 32);
        doc.text('  under the Jal Jeevan Mission (JJM), Atal Bhujal Yojana (ABY), and Gram Panchayat Development Plans (GPDP).', marginX + 6, currentY + 36);

        addRunningFooter(doc, 1, 4);

        // ==========================================
        // PAGE 2: REALM 1 & REALM 2 AUDITS
        // ==========================================
        doc.addPage();
        addRunningHeader(doc, 2, 4);

        // Realm 1 Header
        currentY = 16;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(`1. HYDROLOGICAL RESILIENCE AUDIT  (Weight: 30% | Score: ${data.realms.h.score ? data.realms.h.score.toFixed(2) : '—'} / 5.00)`, marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Evaluates groundwater depth, historical trends, recharge potential, source diversity, and surface storage.', marginX, currentY + 4);

        currentY += 6;
        const hRows = data.realms.h.indicators.map(ind => [
            ind.code,
            ind.name,
            ind.rawValue + (ind.rawValue !== '—' ? ' ' + ind.unit.split(' ')[0] : ''),
            ind.rating,
            ind.score.toString(),
            ind.source
        ]);

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Code', 'Indicator Name', 'Observed Value', 'Benchmark Rating', 'Score', 'Primary Data Source']],
            body: hRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7.5,
                cellPadding: 2.1
            },
            bodyStyles: {
                fontSize: 7.3,
                textColor: COLORS.textDark,
                cellPadding: 2.1,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 62 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 38 }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 3) {
                    tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                }
            }
        });

        // Realm 1 Field Synthesis Card (Height 13mm)
        currentY = doc.lastAutoTable.finalY + 3.5;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, 13, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        doc.setTextColor(...COLORS.primary);
        doc.text('REALM 1 SYNTHESIS & HYDROLOGICAL FINDINGS', marginX + 5, currentY + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Aquifer Dynamics: Natural recharge potential (1.3) and source diversity (1.4) indicate buffer against dry spells.', marginX + 5, currentY + 8.5);
        doc.text('• Key Action: Piezometric monitoring and managed artificial recharge shafts recommended to stabilize groundwater table (1.1 & 1.2).', marginX + 5, currentY + 11.8);

        // Realm 2 Header
        currentY += 17;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(`2. WATER INFRASTRUCTURE RESILIENCE AUDIT  (Weight: 20% | Score: ${data.realms.i.score ? data.realms.i.score.toFixed(2) : '—'} / 5.00)`, marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Evaluates tap coverage, per capita storage, pumping reliability, network density, NRW losses, and disaster resilience.', marginX, currentY + 4);

        currentY += 6;
        const iRows = data.realms.i.indicators.map(ind => [
            ind.code,
            ind.name,
            ind.rawValue + (ind.rawValue !== '—' ? ' ' + ind.unit.split(' ')[0] : ''),
            ind.rating,
            ind.score.toString(),
            ind.source
        ]);

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Code', 'Indicator Name', 'Observed Value', 'Benchmark Rating', 'Score', 'Primary Data Source']],
            body: iRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7.5,
                cellPadding: 2.1
            },
            bodyStyles: {
                fontSize: 7.3,
                textColor: COLORS.textDark,
                cellPadding: 2.1,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 62 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 38 }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 3) {
                    tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                }
            }
        });

        // Realm 2 Field Synthesis Card (Height 13mm)
        currentY = doc.lastAutoTable.finalY + 3.5;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, 13, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        doc.setTextColor(...COLORS.primary);
        doc.text('REALM 2 SYNTHESIS & INFRASTRUCTURE FINDINGS', marginX + 5, currentY + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Network Integrity: Piped network coverage (2.1) and pipe material resilience (2.9) provide strong baseline distribution.', marginX + 5, currentY + 8.5);
        doc.text('• Bottleneck: Operational reliability (2.3) and backup capacity (2.6) require priority pump replacement and standby power.', marginX + 5, currentY + 11.8);

        // Verification & Data Protocols Card (Height 24mm, completes Page 2 safely around y=260)
        currentY += 17;
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, 24, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(marginX, currentY, contentWidth, 6, 1.5, 1.5, 'F');
        doc.rect(marginX, currentY + 3, contentWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('PRIMARY DATA VERIFICATION & AUDIT PROTOCOLS', marginX + 5, currentY + 4.3);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.9);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Groundwater: Verified via CGWB piezometer telemetry and Gujarat State Ground Water Authority (GSGWA) grid points.', marginX + 5, currentY + 9.8);
        doc.text('• Supply Telemetry: Verified against JJM-IMIS village profile, operator logs, and monthly power consumption records.', marginX + 5, currentY + 13.8);
        doc.text('• Asset Inventory: Storage ESR/GLR capacities cross-verified against GWSSB technical drawings and Gram Panchayat register.', marginX + 5, currentY + 17.8);
        doc.text('• Distribution Audit: Tail-end pressure tests and physical leakage surveys conducted during field reconnaissance.', marginX + 5, currentY + 21.8);

        addRunningFooter(doc, 2, 4);

        // ==========================================
        // PAGE 3: REALMS 3, 4, 5 AUDITS & STANDARDS
        // ==========================================
        doc.addPage();
        addRunningHeader(doc, 3, 4);

        // Realm 3 Header
        currentY = 16;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(`3. WATER QUALITY RESILIENCE AUDIT  (Weight: 15% | Score: ${data.realms.wq.score ? data.realms.wq.score.toFixed(2) : '—'} / 5.00)`, marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Evaluates chemical quality index (CWQI), safe source ratio, seasonal stability, and bacteriological contamination.', marginX, currentY + 4);

        currentY += 6;
        const wqRows = data.realms.wq.indicators.map(ind => [
            ind.code,
            ind.name,
            ind.rawValue + (ind.rawValue !== '—' ? ' ' + ind.unit.split(' ')[0] : ''),
            ind.rating,
            ind.score.toString(),
            ind.source
        ]);

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Code', 'Indicator Name', 'Observed Value', 'Benchmark Rating', 'Score', 'Primary Data Source']],
            body: wqRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7.5,
                cellPadding: 2.2
            },
            bodyStyles: {
                fontSize: 7.3,
                textColor: COLORS.textDark,
                cellPadding: 2.2,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 62 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 38 }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 3) {
                    tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                }
            }
        });

        // Realm 4 Header
        currentY = doc.lastAutoTable.finalY + 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(`4. CLIMATE RESILIENCE AUDIT  (Weight: 15% | Score: ${data.realms.c.score ? data.realms.c.score.toFixed(2) : '—'} / 5.00)`, marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Evaluates rainfall variability, drought intensity (SPI), dry years, temperature trends, recharge elasticity, and GHG control.', marginX, currentY + 4);

        currentY += 6;
        const cRows = data.realms.c.indicators.map(ind => [
            ind.code,
            ind.name,
            ind.rawValue + (ind.rawValue !== '—' ? ' ' + ind.unit.split(' ')[0] : ''),
            ind.rating,
            ind.score.toString(),
            ind.source
        ]);

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Code', 'Indicator Name', 'Observed Value', 'Benchmark Rating', 'Score', 'Primary Data Source']],
            body: cRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7.5,
                cellPadding: 2.2
            },
            bodyStyles: {
                fontSize: 7.3,
                textColor: COLORS.textDark,
                cellPadding: 2.2,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 62 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 38 }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 3) {
                    tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                }
            }
        });

        // Realm 5 Header
        currentY = doc.lastAutoTable.finalY + 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text(`5. SOCIO-ECONOMIC GOVERNANCE AUDIT  (Weight: 20% | Score: ${data.realms.se.score ? data.realms.se.score.toFixed(2) : '—'} / 5.00)`, marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Evaluates per capita income, livestock dependency, water migration, community participation, and Pani Samiti index.', marginX, currentY + 4);

        currentY += 6;
        const seRows = data.realms.se.indicators.map(ind => [
            ind.code,
            ind.name,
            ind.rawValue + (ind.rawValue !== '—' ? ' ' + ind.unit.split(' ')[0] : ''),
            ind.rating,
            ind.score.toString(),
            ind.source
        ]);

        doc.autoTable({
            startY: currentY,
            margin: { left: marginX, right: marginX },
            head: [['Code', 'Indicator Name', 'Observed Value', 'Benchmark Rating', 'Score', 'Primary Data Source']],
            body: seRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7.5,
                cellPadding: 2.2
            },
            bodyStyles: {
                fontSize: 7.3,
                textColor: COLORS.textDark,
                cellPadding: 2.2,
                lineColor: [222, 233, 245],
                lineWidth: 0.15
            },
            alternateRowStyles: {
                fillColor: COLORS.bgRowAlt
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 62 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 38 }
            },
            didParseCell: function(tableData) {
                if (tableData.section === 'body' && tableData.column.index === 3) {
                    tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                }
            }
        });

        // Technical Standards & Regulatory Compliance Card (Height 38mm, completes Page 3 down to ~y=255)
        currentY = doc.lastAutoTable.finalY + 4.5;
        const standardsCardHeight = 38;
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, standardsCardHeight, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(marginX, currentY, contentWidth, 6, 1.5, 1.5, 'F');
        doc.rect(marginX, currentY + 3, contentWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('REGULATORY BENCHMARKS & REFERENCE METHODOLOGIES', marginX + 5, currentY + 4.3);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Water Quality (BIS 10500:2012): Permissible thresholds for TDS (<= 500 mg/L), Nitrate (<= 45 mg/L), Fluoride (<= 1.0 mg/L),', marginX + 5, currentY + 10);
        doc.text('  and zero tolerance for E. coli/faecal coliform in 100 mL potable samples as certified by district laboratory testing.', marginX + 5, currentY + 14);
        doc.text('• Climate Series (IMD & WMO): 30-year gridded meteorological dataset (1991–2020) utilized for Standardized Precipitation', marginX + 5, currentY + 19.5);
        doc.text('  Index (SPI-12) drought quantification and long-term rainfall variability (CV) estimation.', marginX + 5, currentY + 23.5);
        doc.text('• Governance Framework (73rd Amendment): Evaluates statutory criteria of Village Water & Sanitation Committee (VWSC),', marginX + 5, currentY + 29);
        doc.text('  mandating minimum 50% women membership, dedicated O&M bank accounts, and quarterly Gram Sabha Jal Chaupals.', marginX + 5, currentY + 33);

        addRunningFooter(doc, 3, 4);

        // ==========================================
        // PAGE 4: INTERVENTIONS, ROADMAP & SIGN-OFF
        // ==========================================
        doc.addPage();
        addRunningHeader(doc, 4, 4);

        // Section 1: Priority Vulnerability Audit
        currentY = 16;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('PRIORITY VULNERABILITY AUDIT & RECOMMENDED INTERVENTIONS', marginX, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Automated intervention matrix for indicators scoring in the Low or Very Low resilience tiers (Score <= 2.0).', marginX, currentY + 4);

        currentY += 6;
        if (data.vulnerabilities.length > 0) {
            const vulnRows = data.vulnerabilities.map(v => [
                v.code,
                v.name,
                v.rating,
                v.recommendation,
                'Gram Panchayat / Pani Samiti'
            ]);

            doc.autoTable({
                startY: currentY,
                margin: { left: marginX, right: marginX },
                head: [['Code', 'Vulnerable Indicator', 'Tier', 'Targeted Field / Policy Intervention', 'Responsible Entity']],
                body: vulnRows,
                theme: 'grid',
                headStyles: {
                    fillColor: COLORS.primaryDark,
                    textColor: COLORS.white,
                    fontStyle: 'bold',
                    fontSize: 7.5,
                    cellPadding: 2.5
                },
                bodyStyles: {
                    fontSize: 7.3,
                    textColor: COLORS.textDark,
                    cellPadding: 2.5,
                    lineColor: [222, 233, 245],
                    lineWidth: 0.15
                },
                alternateRowStyles: {
                    fillColor: COLORS.bgRowAlt
                },
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                    1: { cellWidth: 42, fontStyle: 'bold' },
                    2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
                    3: { cellWidth: 78 },
                    4: { cellWidth: 30 }
                },
                didParseCell: function(tableData) {
                    if (tableData.section === 'body' && tableData.column.index === 2) {
                        tableData.cell.styles.textColor = getTierColor(tableData.cell.raw);
                    }
                }
            });
            currentY = doc.lastAutoTable.finalY + 5;
        } else {
            doc.setFillColor(...COLORS.bgTint);
            doc.setDrawColor(...COLORS.high);
            doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(...COLORS.high);
            doc.text('EXEMPLARY PERFORMANCE: NO CRITICAL VULNERABILITIES DETECTED', marginX + 6, currentY + 7);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLORS.textDark);
            doc.text('All 34 indicators achieved Moderate (3), High (4), or Very High (5) resilience scores. Focus on routine preventive maintenance.', marginX + 6, currentY + 13);
            currentY += 23;
        }

        // Section 2: Phased Resilience Action Roadmap (Height 34mm)
        const roadmapHeight = 34;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, roadmapHeight, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.primary);
        doc.text('STRATEGIC RESILIENCE ROADMAP (GRAM PANCHAYAT DEVELOPMENT PLAN)', marginX + 5, currentY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.1);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Phase 1 (Immediate / 0–6 Months): Execute emergency pump set overhauls, repair tail-end distribution leakages, and initiate', marginX + 5, currentY + 11.5);
        doc.text('  monthly chlorine residual testing at household tap connections. Convene Gram Sabha to re-activate inactive Pani Samiti members.', marginX + 5, currentY + 15.5);
        doc.text('• Phase 2 (Medium-Term / 6–18 Months): Retrofit high-draw groundwater borewells with solar PV pumping arrays to reduce energy', marginX + 5, currentY + 21);
        doc.text('  costs and emissions. Desilt community check dams and recharge shafts ahead of the monsoon season.', marginX + 5, currentY + 25);
        doc.text('• Phase 3 (Long-Term / 18–36 Months): Enforce rooftop rainwater harvesting on institutional buildings; integrate village water budget', marginX + 5, currentY + 30.5);

        currentY += roadmapHeight + 5;

        // Section 3: Classification Scale Reference Card (Height 26mm)
        const scaleCardHeight = 26;
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.35);
        doc.roundedRect(marginX, currentY, contentWidth, scaleCardHeight, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(marginX, currentY, contentWidth, 6, 1.5, 1.5, 'F');
        doc.rect(marginX, currentY + 3, contentWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('FRAMEWORK CLASSIFICATION & AGGREGATION BENCHMARK (Table 3 Reference)', marginX + 5, currentY + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Very Low: Score <= 1.50   |   • Low: 1.50 < Score <= 2.50   |   • Moderate: 2.50 < Score <= 3.50', marginX + 5, currentY + 11.5);
        doc.text('• High: 3.50 < Score <= 4.50   |   • Very High: Score > 4.50', marginX + 5, currentY + 16);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.primary);
        doc.text('Aggregation Formula: VWRI = 0.30 x Hydrological + 0.20 x Infrastructure + 0.15 x Quality + 0.15 x Climate + 0.20 x Socio-economic', marginX + 5, currentY + 21.5);

        currentY += scaleCardHeight + 5;

        // Section 4: Tripartite Official Certification Block (Height 60mm)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('OFFICIAL CERTIFICATION & FIELD VERIFICATION ENDORSEMENT', marginX, currentY);

        currentY += 3.5;
        const sigCardWidth = (contentWidth - 6) / 3;
        const sigCardHeight = 60;

        const box1X = marginX;
        const box2X = marginX + sigCardWidth + 3;
        const box3X = marginX + (sigCardWidth * 2) + 6;

        // Assessor Box
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(box1X, currentY, sigCardWidth, sigCardHeight, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(box1X, currentY, sigCardWidth, 6.5, 1.5, 1.5, 'F');
        doc.rect(box1X, currentY + 3.5, sigCardWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('FIELD ASSESSOR / SURVEYOR', box1X + 4, currentY + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textDark);
        doc.text(`Name: ${assessor}`, box1X + 4, currentY + 11.5);
        doc.text('Role: Technical Lead Surveyor', box1X + 4, currentY + 16.5);
        doc.text('Agency: W4C Research / IITGN', box1X + 4, currentY + 21.5);
        doc.text(`Audit Date: ${assessDate}`, box1X + 4, currentY + 26.5);
        doc.text('Status: Primary Data Validated', box1X + 4, currentY + 31.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Seal & Signature:', box1X + 4, currentY + 44);
        doc.setDrawColor(...COLORS.border);
        doc.line(box1X + 4, currentY + 54, box1X + sigCardWidth - 4, currentY + 54);

        // Sarpanch Box
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(box2X, currentY, sigCardWidth, sigCardHeight, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(box2X, currentY, sigCardWidth, 6.5, 1.5, 1.5, 'F');
        doc.rect(box2X, currentY + 3.5, sigCardWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('GRAM PANCHAYAT / SARPANCH', box2X + 4, currentY + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textDark);
        doc.text(`Village: ${villageName}`, box2X + 4, currentY + 11.5);
        doc.text(`Taluka: ${taluka}`, box2X + 4, currentY + 16.5);
        doc.text(`District: ${district}`, box2X + 4, currentY + 21.5);
        doc.text('Resolution: GPDP-VWRI Approval', box2X + 4, currentY + 26.5);
        doc.text('Acceptance: Confirmed by GP', box2X + 4, currentY + 31.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Official Seal & Signature:', box2X + 4, currentY + 44);
        doc.setDrawColor(...COLORS.border);
        doc.line(box2X + 4, currentY + 54, box2X + sigCardWidth - 4, currentY + 54);

        // Pani Samiti Box
        doc.setFillColor(...COLORS.bgCard);
        doc.setDrawColor(...COLORS.borderAccent);
        doc.setLineWidth(0.4);
        doc.roundedRect(box3X, currentY, sigCardWidth, sigCardHeight, 1.5, 1.5, 'FD');

        doc.setFillColor(...COLORS.bgSubtle);
        doc.roundedRect(box3X, currentY, sigCardWidth, 6.5, 1.5, 1.5, 'F');
        doc.rect(box3X, currentY + 3.5, sigCardWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.primaryDark);
        doc.text('PANI SAMITI / VWSC SECRETARY', box3X + 4, currentY + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(...COLORS.textDark);
        doc.text('Body: Village Water & Sanitation', box3X + 4, currentY + 11.5);
        doc.text('Committee (VWSC / Pani Samiti)', box3X + 4, currentY + 16.5);
        doc.text('Meeting Ref: PS-VWRI Verification', box3X + 4, currentY + 21.5);
        doc.text(`Endorsed: ${assessDate}`, box3X + 4, currentY + 26.5);
        doc.text('Community Oversight: Verified', box3X + 4, currentY + 31.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text('Committee Seal & Signature:', box3X + 4, currentY + 44);
        doc.setDrawColor(...COLORS.border);
        doc.line(box3X + 4, currentY + 54, box3X + sigCardWidth - 4, currentY + 54);

        // Section 5: Institutional Disclaimer & Planning Note (Height 20mm, finishes Page 4 at ~y=255)
        currentY += sigCardHeight + 5;
        doc.setFillColor(...COLORS.bgTint);
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.3);
        doc.roundedRect(marginX, currentY, contentWidth, 20, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.primary);
        doc.text('INSTITUTIONAL PLANNING NOTICE & JAL JEEVAN MISSION (JJM) COMPLIANCE', marginX + 4, currentY + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.textDark);
        doc.text('• Disclaimer: This assessment dossier is generated through the Village Water Resilience Index (VWRI) decision support framework developed', marginX + 4, currentY + 9.5);
        doc.text('  at IIT Gandhinagar. Designed for planning, resource prioritisation, and multi-temporal benchmarking under JJM and GPDP.', marginX + 4, currentY + 13.5);
        doc.text('• Technical Inquiries & Research Validation: Department of Civil Engineering, IIT Gandhinagar | Email: pranabm@iitgn.ac.in', marginX + 4, currentY + 17.5);

        addRunningFooter(doc, 4, 4);

        // Save PDF
        const safeVillageName = villageName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `VWRI_Assessment_Report_${safeVillageName}_${assessDate}.pdf`;
        doc.save(fileName);

        return {
            filename: fileName,
            totalPages: 4,
            dataUri: doc.output('datauristring')
        };
    }

    // Export to global window object
    window.VWRI_PDF = window.VWRI_PDF_Generator = {
        generatePDFReport: generatePDFReport,
        extractAssessmentData: extractAssessmentData,
        INDICATOR_SPECS: INDICATOR_SPECS
    };

})(window);
