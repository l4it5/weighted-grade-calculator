function ModuleRow({ index, data, onChange }) {
    return (
        <fieldset className="xp-fieldset">
            <legend className="xp-legend">Module {index + 1}</legend>
            <div className="module-row">
                <div>
                    <label className="xp-label">Prefix</label>
                    <input
                        type="text"
                        className="xp-input"
                        value={data.prefix}
                        onChange={e => onChange(index, 'prefix', e.target.value)}
                        placeholder="e.g. CS101"
                    />
                </div>
                <div>
                    <label className="xp-label">Grade</label>
                    <select
                        className="xp-input"
                        value={data.grade}
                        onChange={e => onChange(index, 'grade', e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {grades.map(g => (
                            <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="xp-label">Standard ECTS</label>
                    <input
                        type="number"
                        className="xp-input input-ects"
                        value={data.ects}
                        min="1"
                        onChange={e => onChange(index, 'ects', e.target.value)}
                        placeholder="e.g. 6"
                    />
                </div>
            </div>
        </fieldset>
    );
}
