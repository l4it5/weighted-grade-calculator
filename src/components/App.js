var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;

function buildInitialVisible(modules) {
    var map = {};
    modules.forEach(function (m, mi) {
        var grades = {};
        for (var g = m.min; g <= m.max; g++) {
            grades[g] = true;
        }
        map[mi] = grades;
    });
    return map;
}

function App() {
    var saved = loadState();

    var _finalGrade = useState(saved && saved.finalGrade !== undefined ? saved.finalGrade : '');
    var finalGrade = _finalGrade[0];
    var setFinalGrade = _finalGrade[1];

    var _moduleCount = useState(saved && saved.moduleCount !== undefined ? saved.moduleCount : 1);
    var moduleCount = _moduleCount[0];
    var setModuleCount = _moduleCount[1];

    var _modules = useState(saved && saved.modules ? saved.modules : [{ prefix: '', grade: '', ects: '' }]);
    var modules = _modules[0];
    var setModules = _modules[1];

    var _result = useState(null);
    var result = _result[0];
    var setResult = _result[1];

    var _page = useState(0);
    var page = _page[0];
    var setPage = _page[1];

    var _visibleGrades = useState(saved && saved.visibleGrades ? saved.visibleGrades : {});
    var visibleGrades = _visibleGrades[0];
    var setVisibleGrades = _visibleGrades[1];

    var _isCalculating = useState(false);
    var isCalculating = _isCalculating[0];
    var setIsCalculating = _isCalculating[1];

    var importRef = useRef(null);

    var PAGE_SIZE = 1000;

    // Auto-recalculate on mount if inputs were saved
    useEffect(function () {
        if (saved && saved.finalGrade !== undefined && saved.modules && saved.modules.length > 0) {
            calculateGradesAsync(saved.modules, saved.finalGrade).then(function (res) {
                if (res) {
                    setResult(res);
                    // Use saved visibleGrades if present, otherwise build fresh
                    if (!saved.visibleGrades || Object.keys(saved.visibleGrades).length === 0) {
                        setVisibleGrades(buildInitialVisible(res.modules));
                    }
                }
            });
        }
    }, []);

    useEffect(function () {
        saveState({ finalGrade: finalGrade, moduleCount: moduleCount, modules: modules, visibleGrades: visibleGrades });
    }, [finalGrade, moduleCount, modules, visibleGrades]);

    function handleModuleCountChange(e) {
        var count = parseInt(e.target.value) || 1;
        setModuleCount(count);
        setModules(function (prev) {
            var updated = prev.slice();
            while (updated.length < count) updated.push({ prefix: '', grade: '', ects: '' });
            return updated.slice(0, count);
        });
    }

    function handleModuleChange(index, field, value) {
        setModules(function (prev) {
            var updated = prev.slice();
            updated[index] = Object.assign({}, updated[index], { [field]: value });
            return updated;
        });
    }

    function handleCalculate() {
        setIsCalculating(true);
        setTimeout(function () {
            calculateGradesAsync(modules, finalGrade).then(function (res) {
                setResult(res);
                setPage(0);
                if (res && res.modules) {
                    var hasFilters = Object.keys(visibleGrades).length > 0;
                    var moduleCountSame = Object.keys(visibleGrades).length === res.modules.length;
                    if (!hasFilters || !moduleCountSame) {
                        setVisibleGrades(buildInitialVisible(res.modules));
                    }
                }
                setIsCalculating(false);
            });
        }, 10);
    }

    function handleExport() {
        var state = { finalGrade: finalGrade, moduleCount: moduleCount, modules: modules, visibleGrades: visibleGrades };
        var json = JSON.stringify(state, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'weighted-grade-state.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImportFile(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var data = JSON.parse(ev.target.result);
                if (data.finalGrade !== undefined) setFinalGrade(data.finalGrade);
                if (data.moduleCount !== undefined) {
                    setModuleCount(data.moduleCount);
                }
                if (data.modules) setModules(data.modules);
                if (data.visibleGrades) setVisibleGrades(data.visibleGrades);
                setResult(null);
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    var totalEcts = modules.reduce(function(sum, m) { return sum + (parseInt(m.ects) || 0); }, 0);

    return (
        <div className="app-container">
            <div className="app-left">
                <fieldset className="xp-fieldset app-title-fieldset">
                    <legend className="xp-legend">App</legend>
                    <span className="app-title">Weighted Grade Calculator</span>
                </fieldset>

                <fieldset className="xp-fieldset">
                    <legend className="xp-legend">Semester</legend>

                    <div className="semester-row">
                        <div>
                            <label className="xp-label">Final Grade of Semester</label>
                            <input
                                type="number"
                                className="xp-input input-sm"
                                value={finalGrade}
                                min="0"
                                max="100"
                                onChange={e => setFinalGrade(e.target.value)}
                                placeholder="0-100"
                            />
                        </div>

                        <div>
                            <label className="xp-label">Number of Modules</label>
                            <select className="xp-input" value={moduleCount} onChange={handleModuleCountChange}>
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="xp-label">Total ECTS</label>
                            <input
                                type="number"
                                className="xp-input input-xs input-readonly"
                                value={totalEcts}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="semester-actions">
                        <button className="calc-button" onClick={handleCalculate} disabled={isCalculating}>
                            {isCalculating ? 'Calculating...' : 'Calculate Expected Grade'}
                        </button>
                        <button className="calc-button" onClick={handleExport}>Export</button>
                        <button className="calc-button" onClick={function () { importRef.current.click(); }}>Import</button>
                        <input className="import-file-input" type="file" ref={importRef} accept=".json" onChange={handleImportFile} />
                    </div>
                </fieldset>

                {modules.map(function (mod, i) {
                    return <ModuleRow key={i} index={i} data={mod} onChange={handleModuleChange} />;
                })}
            </div>

            <div className="app-right">
                <ResultChart result={result} visibleGrades={visibleGrades} setVisibleGrades={setVisibleGrades} />

                {result && (
                    <fieldset className="xp-fieldset result-fieldset">
                        <legend className="xp-legend">
                            Results — {result.count} valid combination{result.count !== 1 ? 's' : ''} found
                        </legend>

                        <p className="result-checks">
                            Total f() checks: <strong>{result.checks.toLocaleString()}</strong>
                        </p>

                        {result.count === 0 ? (
                            <p className="result-empty">
                                No valid combinations found. Check your grade ranges and final grade.
                            </p>
                        ) : (
                            <div>
                                {result.count > PAGE_SIZE && (
                                    <div className="result-nav">
                                        <button
                                            className="calc-button"
                                            onClick={function() { setPage(function(p) { return p - 1; }); }}
                                            disabled={page === 0}
                                        >Prev</button>
                                        <span className="result-nav-info">
                                            Page {page + 1} / {Math.ceil(result.count / PAGE_SIZE)}
                                            &nbsp;({page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, result.count)} of {result.count})
                                        </span>
                                        <button
                                            className="calc-button"
                                            onClick={function() { setPage(function(p) { return p + 1; }); }}
                                            disabled={(page + 1) * PAGE_SIZE >= result.count}
                                        >Next</button>
                                    </div>
                                )}

                                <div className="result-scroll">
                                    <table className="result-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                {result.modules.map(function(m, i) {
                                                    return <th key={i}>{m.prefix} ({m.ects} ECTS)</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(function(combo, ri) {
                                                var globalIndex = page * PAGE_SIZE + ri;
                                                return (
                                                    <tr key={ri}>
                                                        <td>{globalIndex + 1}</td>
                                                        {combo.map(function(item, gi) {
                                                            return <td key={gi}>{item.grade}</td>;
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="result-total">
                                                <td colSpan={result.modules.length + 1}>
                                                    f(grades) = Σ(grade × ECTS) / 100 = {result.finalGrade} ✓
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}
                    </fieldset>
                )}
            </div>
        </div>
    );
}

var root = ReactDOM.createRoot(document.getElementById('weightedGradeCalculatorDemo'));
root.render(<App />);