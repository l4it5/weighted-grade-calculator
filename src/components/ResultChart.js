var useEffect = React.useEffect;
var useRef = React.useRef;

var CHART_COLORS = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
    '#9c755f', '#bab0ac'
];

function ResultChart({ result }) {
    var canvasRef = useRef(null);
    var chartRef = useRef(null);

    useEffect(function () {
        if (!result || result.count === 0) return;

        // Collect all grade values that appear across all modules
        var gradeSet = {};
        result.modules.forEach(function (m, mi) {
            result.results.forEach(function (combo) {
                gradeSet[combo[mi].grade] = true;
            });
        });

        var labels = Object.keys(gradeSet).map(Number).sort(function (a, b) { return a - b; });

        // Build one dataset per module: count frequency of each grade value
        var datasets = result.modules.map(function (m, mi) {
            var freq = {};
            result.results.forEach(function (combo) {
                var g = combo[mi].grade;
                freq[g] = (freq[g] || 0) + 1;
            });
            return {
                label: m.prefix + ' (' + m.ects + ' ECTS)',
                data: labels.map(function (l) { return freq[l] || 0; }),
                backgroundColor: CHART_COLORS[mi % CHART_COLORS.length]
            };
        });

        // Destroy previous chart instance before creating a new one
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
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Grade Distribution per Module (' + result.count + ' combinations)'
                    }
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
    }, [result]);

    if (!result || result.count === 0) return null;

    return (
        <fieldset className="xp-fieldset result-chart-fieldset">
            <legend className="xp-legend">Grade Distribution Chart</legend>
            <canvas ref={canvasRef}></canvas>
        </fieldset>
    );
}
