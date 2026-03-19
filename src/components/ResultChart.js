var useEffect = React.useEffect;
var useRef = React.useRef;
var useState = React.useState;

var CHART_COLORS = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
    '#9c755f', '#bab0ac'
];

function ResultChart({ result, visibleGrades, setVisibleGrades }) {
    var canvasRef = useRef(null);
    var chartRef = useRef(null);

    var _openDropdown = useState(null);
    var openDropdown = _openDropdown[0];
    var setOpenDropdown = _openDropdown[1];

    // Rebuild chart when result or filters change
    useEffect(function () {
        if (!result || result.count === 0) return;
        if (!canvasRef.current) return;

        // Filter combinations to only those where every module's grade is in its visible set
        var filteredResults = result.results.filter(function (combo) {
            return combo.every(function (item, mi) {
                return !!(visibleGrades[mi] && visibleGrades[mi][item.grade]);
            });
        });

        // Build x-axis labels from filtered results only
        var gradeSet = {};
        result.modules.forEach(function (m, mi) {
            filteredResults.forEach(function (combo) {
                gradeSet[combo[mi].grade] = true;
            });
        });

        var labels = Object.keys(gradeSet).map(Number).sort(function (a, b) { return a - b; });

        var datasets = result.modules.map(function (m, mi) {
            var freq = {};
            filteredResults.forEach(function (combo) {
                var g = combo[mi].grade;
                freq[g] = (freq[g] || 0) + 1;
            });
            return {
                label: m.prefix + ' (' + m.ects + ' ECTS)',
                data: labels.map(function (l) { return freq[l] || 0; }),
                backgroundColor: CHART_COLORS[mi % CHART_COLORS.length]
            };
        });

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        var ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    x: { title: { display: true, text: 'Grade Value' } },
                    y: { title: { display: true, text: 'Frequency' }, beginAtZero: true }
                }
            }
        });

        return function () {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [result, visibleGrades]);

    // Close dropdown on outside click
    useEffect(function () {
        if (openDropdown === null) return;
        function handleOutside(e) {
            if (!e.target.closest('.chart-legend-item')) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('click', handleOutside);
        return function () { document.removeEventListener('click', handleOutside); };
    }, [openDropdown]);

    function toggleGrade(mi, grade) {
        setVisibleGrades(function (prev) {
            var updated = Object.assign({}, prev);
            var moduleVisible = Object.assign({}, updated[mi] || {});
            if (moduleVisible[grade]) {
                delete moduleVisible[grade];
            } else {
                moduleVisible[grade] = true;
            }
            updated[mi] = moduleVisible;
            return updated;
        });
    }

    if (!result || result.count === 0) return null;

    // Count combinations where all modules' grades are in their visible set
    var visibleCount = 0;
    result.results.forEach(function (combo) {
        var allVisible = combo.every(function (item, mi) {
            return !!(visibleGrades[mi] && visibleGrades[mi][item.grade]);
        });
        if (allVisible) visibleCount++;
    });

    // Build total frequency map per module: totalFreqByModule[mi][grade] = count across all combos
    var totalFreqByModule = {};
    result.modules.forEach(function (m, mi) {
        var freq = {};
        result.results.forEach(function (combo) {
            var g = combo[mi].grade;
            freq[g] = (freq[g] || 0) + 1;
        });
        totalFreqByModule[mi] = freq;
    });

    // Build filtered frequency map per module: count only combos where ALL OTHER modules are also visible
    var filteredFreqByModule = {};
    result.modules.forEach(function (m, mi) {
        var freq = {};
        result.results.forEach(function (combo) {
            // Check all modules except mi are in their visible set
            var othersVisible = combo.every(function (item, idx) {
                if (idx === mi) return true;
                return !!(visibleGrades[idx] && visibleGrades[idx][item.grade]);
            });
            if (othersVisible) {
                var g = combo[mi].grade;
                freq[g] = (freq[g] || 0) + 1;
            }
        });
        filteredFreqByModule[mi] = freq;
    });

    return (
        <fieldset className="xp-fieldset result-chart-fieldset">
            <legend className="xp-legend">Grade Distribution Chart</legend>

            <p className="chart-visible-count">
                Showing <strong>{visibleCount.toLocaleString()}</strong> of <strong>{result.count.toLocaleString()}</strong> combinations
            </p>

            <div className="chart-legend">
                {result.modules.map(function (m, mi) {
                    var colorClass = 'chart-legend-color chart-color-' + (mi % CHART_COLORS.length);
                    var isOpen = openDropdown === mi;
                    var visibleSet = visibleGrades[mi] || {};
                    var gradeList = [];
                    for (var g = m.min; g <= m.max; g++) gradeList.push(g);
                    var totalFreq = totalFreqByModule[mi] || {};
                    var filteredFreq = filteredFreqByModule[mi] || {};

                    return (
                        <div key={mi} className="chart-legend-item">
                            <div
                                className={colorClass}
                                onClick={function (e) { e.stopPropagation(); setOpenDropdown(isOpen ? null : mi); }}
                                title="Click to filter grades"
                            ></div>
                            <span className="chart-legend-label">{m.prefix} ({m.ects} ECTS)</span>
                            {isOpen && (
                                <div className="chart-legend-dropdown" onClick={function (e) { e.stopPropagation(); }}>
                                    <div className="chart-legend-dropdown-title">
                                        <span className="chart-dropdown-col-grade">Grade</span>
                                        <span className="chart-dropdown-col-total">Total</span>
                                        <span className="chart-dropdown-col-sub">Filtered</span>
                                    </div>
                                    <div className="chart-legend-dropdown-list">
                                        {gradeList.map(function (g) {
                                            return (
                                                <label key={g} className="chart-legend-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!visibleSet[g]}
                                                        onChange={function () { toggleGrade(mi, g); }}
                                                    />
                                                    <span className="chart-dropdown-col-grade">{g}</span>
                                                    <span className="chart-dropdown-col-total">{(totalFreq[g] || 0).toLocaleString()}</span>
                                                    <span className="chart-dropdown-col-sub">{(filteredFreq[g] || 0).toLocaleString()}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <canvas ref={canvasRef}></canvas>
        </fieldset>
    );
}