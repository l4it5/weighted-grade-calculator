var gradeRanges = {
    'A': { min: 90, max: 100 },
    'B': { min: 80, max: 89 },
    'C': { min: 70, max: 79 },
    'D': { min: 60, max: 69 },
    'E': { min: 50, max: 59 }
};


function calculateTotalEctsOfGrades(params={}) {
  let { grades } = params;
  //
  let ects_values = grades.map(({grade,ects})=>(grade*ects/100)).reduce((a,b)=>a+b,0);
  return ects_values
}

function calculateGrades(modules, finalGrade) {
    var total           = parseFloat(finalGrade);
    let finalGradeOfSemester = parseFloat(finalGrade)
    if (isNaN(total)) return null;
    let checks          = 0;
    var totalEcts       =  modules.map(a=>a.ects).reduce((a, b)=>(parseInt(a) || 0) + (parseInt(b) || 0), 0);
    if (totalEcts === 0) return null;
    //
    var modulesData = modules.map(function(m) {
        var range = gradeRanges[m.grade];
        var ects = parseInt(m.ects) || 0;
        let details = {
            prefix: m.prefix || '—',
            ects: ects,
            min: range ? range.min : 0,
            max: range ? range.max : 100,
        }
        //
        details.range = Array(details.max-details.min+1).join(',').split(',').map((e,i)=>i+details.min) 
        return details;
    });
    //
    var results = [];
    let stack = [];
    //
    var capped = false;
    //
    function looping(params={}) {
      try {
        let { index , grades=[] } = params
        let module = modulesData[index];
        let { range , ects } = module;
        for( let expectedGrade of range ){
          if( index === (modulesData.length - 1) ){
            checks++;
            // list.push([...grades,{ 'grade':expectedGrade,ects,index }]);
            let final_grades = [...grades,{ 'grade':expectedGrade,ects,index }]
            let totalEctsOfGrades = calculateTotalEctsOfGrades({ grades:final_grades })
            if( totalEctsOfGrades === finalGradeOfSemester ){
              results.push([...grades,{ 'grade':expectedGrade,ects,index }])
            }
          } else {
            if( index < modulesData.length ){
              looping({index:index+1,grades:[...grades,{ 'grade':expectedGrade,ects,index }]})
            }
          }
        }
        //
        stack = [];
      } catch (error) {
        console.log(error)
      }
    }
    //
    looping({index:0})
    //
    return {
        modules: modulesData,
        results: results,
        totalEcts: totalEcts,
        finalGrade: total,
        capped: capped,
        count: results.length,
        checks: checks
    };
}
