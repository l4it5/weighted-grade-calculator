var useState = React.useState;
var useEffect = React.useEffect;

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

    var PAGE_SIZE = 1000;

    useEffect(function () {
        saveState({ finalGrade: finalGrade, moduleCount: moduleCount, modules: modules });
        setResult(null);
    }, [finalGrade, moduleCount, modules]);

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
        var res = calculateGrades(modules, finalGrade);
        setResult(res);
        setPage(0);
    }

    var totalEcts = modules.reduce(function(sum, m) { return sum + (parseInt(m.ects) || 0); }, 0);

    return (
        <div className="app-container">
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
            </fieldset>

            {modules.map(function (mod, i) {
                return <ModuleRow key={i} index={i} data={mod} onChange={handleModuleChange} />;
            })}

            <button className="calc-button" onClick={handleCalculate}>
                Calculate Expected Grade
            </button>

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

            <ResultChart result={result} />
        </div>
    );
}

var root = ReactDOM.createRoot(document.getElementById('manageBookingDemo'));
root.render(<App />);
