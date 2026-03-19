function MathBox() {
    return (
        <fieldset className="xp-fieldset math-box">
            <legend className="xp-legend">Equation — How Exact Grades Are Calculated</legend>

            <p className="math-line">
                <span className="math-label">Formula used:</span>
            </p>
            <p className="math-expr-block">
                ( x&#8321;×ECTS&#8321; + x&#8322;×ECTS&#8322; + ... + x&#8345;×ECTS&#8345; ) / 100 = Final Grade
            </p>

            <p className="math-line">
                <span className="math-label">Step 1 — Find base grade</span>
                <span> (assume all modules equal):</span>
            </p>
            <p className="math-expr-block">
                base = Final_Grade × 100 / Total_ECTS
            </p>

            <p className="math-line">
                <span className="math-label">Step 2 — Clamp each module to its range:</span>
            </p>
            <p className="math-expr-block">
                x&#7522; = max( range_min&#7522;, min( range_max&#7522;, base ) )
            </p>

            <p className="math-line">
                <span className="math-label">Grade ranges:</span>
                <span className="math-ranges"> A: 90–100 &nbsp;|&nbsp; B: 80–89 &nbsp;|&nbsp; C: 70–79 &nbsp;|&nbsp; D: 60–69 &nbsp;|&nbsp; E: 50–59</span>
            </p>

            <p className="math-line">
                <span className="math-label">Example (Total ECTS = 30, Final Grade = 26):</span>
            </p>
            <p className="math-expr-block">
                base = 26 × 100 / 30 = 86.67
            </p>
            <p className="math-expr-block">
                H*2/100 + C*4/100 + A*2/100 + M*5/100 + E*6/100 + P*6/100 + D*5/100 = 26
            </p>
            <p className="math-line">
                <span> → module grade B (80–89): clamp(86.67, 80, 89) = 86.67 ✓</span>
            </p>
            <p className="math-line">
                <span> → module grade A (90–100): clamp(86.67, 90, 100) = 90 (clamped)</span>
            </p>
        </fieldset>
    );
}
