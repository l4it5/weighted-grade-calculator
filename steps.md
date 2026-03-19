# steps.md — How Claude Builds Your Project

This file explains what Claude does at each stage when you work together to build something.

---

## Step 1
- create src folder
- inside src folder create inndex html file and put this code in it:
```html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Booking</title>

    <link rel="stylesheet" href="">
    <!-- Babel -->
    <script src="https://api.london-tech.com/lib/babel-standalone@6.26.0/babel.min.js"></script>
<meta name="robots" content="noindex, nofollow">
<meta name="googlebot" content="index, follow">
    <!-- Moment core -->
    <script src="https://api.london-tech.com/lib/moment.js/2.29.1/moment.min.js"></script>

    <!-- Moment Timezone (+ tüm timezone verisi) -->
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.43/moment-timezone-with-data.min.js"></script>

    <style>
        body {
            margin: 0px;
            padding: 0px;
        }
    </style>

    <script>
        var process = { env: {} };
    </script>

    <!-- React -->
    <script src="https://api.london-tech.com/lib/react@18.3.1/umd/react.production.min.js" crossorigin></script>
    <script src="https://api.london-tech.com/lib/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>

    <!-- App JSX -->
    <script src="https://api.london-tech.com/tools/manage-booking/v2/script.js?email=laith-test@aplcars.com" type="text/babel"></script>
</head>
<div style="width:1200;height:100vh" id="manageBookingDemo"></div>

<body>

</body>

</html>
```
- optimising the content of the file and telling me whats the mistaks in it


## Step 2:
- on line 39 at src/index.html, create a jsx reactjs code to render simple compoent to test is file work properlys

## step 3:
- create form with basic style and tiny padding like xp windows style for inputs for the following details:
    - number input for the grade of final grade od semester
    - select input for the number of modules
    - render a grounp of inputs for each module
        - first one, text input for the prfix of module
        - 2nd, select input for marks percentage range (A-Excellent[90-100],B-Very Good[80-89],C-Good[70-79],D-Satisfactory[60-69],E-Suffiecient[50-59])
        - 3rd, Number input for amount of ECTS

## step 4:
- store the state of app to ensure it is exist when i come back later of reload the page, to avoid losing it, and use localStorage


## step 5
- the file will be more bigger, create the following:
    - folder 'components' includes all react components that used in the app, ensure each component has single file
    - folder 'assets' includes functions thhat using within the app for example:
        - ensure thhere is one file named 'index.js' export all assets to easy access
        - for example loadState functoin must have file named 'load-state.js' 

## step 6
- inside semester fieldset, make the content row flex not column, and innclude the total of ECTS that registered intp each modules

## step 7
- use momospace as font-family for all text
- create css file for each component instead of inline style

## Step 8
- updating CLAUDE.md file, where i can understand what are you gain experince from me about this project and ensure to do this updating after check any step i told you to check it

## Step 9 
- create a button to start calculating the exact expcected grade for each modules base on:
    - the standard amount of ECTS for each module
    - total ECTS for student that gained at the final of semester
    - the exact expcected grade must not extend over the assinged grade range for that module


## Step 10
- in the Step 3, you are creating ETCS iput file, change the title of it to standard ETCS
- create a math box showing me the the equestions that you are use it the clamp the exact grade for each modules in Step 9

## Step 11
- Not that what i expected from you via 10,
- chheck this example:
    - Final Grade of Semester is ETCS = 26 and coming from:
        - H*2/100 + C*4/100 + A*2/100 + M*5/100 + E*6/100 + P*6/100 + D*5/100 = Final Grade of Semester
    - I need to find exact value of H,C,A,M,E,P,D if i told you each of them was alocated betwen specific range of marks 

## Step 12
- you are not using this formula: H*2/100 + C*4/100 + A*2/100 + M*5/100 + E*6/100 + P*6/100 + D*5/100 = Final Grade of Semester !!!
- just show me all expected grades for each modules if the total is equel to Final Grade of Semester

## Step 13
- show me expected student ETCS base of the grade range for each modules

## Step 14 
- inside src/assets/calculate.js file, line 21:
    - there is no any usful for baseGrade value
- update src/assets/calculate.js file and make a nested for loop over all modules where
    - parent loop is first module
    - last child loop is last module
    - start point for each loop is min grade range
    - end point for each loop is max grade range
    - inside loop of last module check this formula f(H,C,A,M,E,P,D)= (H*2/100 + C*4/100 + A*2/100 + M*5/100 + E*6/100 + P*6/100 + D*5/100)
    - if the result of the f(H,C,A,M,E,P,D) equel to Final Grade of Semester then push the values of H,C,A,M,E,P,D in a list
    - finalling show me all expected set that has f(H,C,A,M,E,P,D) = Final Grade of Semester in a table

## Step 15
- remove math box
- make the table scrollable with fix head and max height to 600px
- counting total number of checked values via this function f(H,C,A,M,E,P,D)

# Step 16
- inside src/assets/calculate.js file follow this concept to check all H,C,A,M,E,P,D values that have sum equal to Final Grade of Semester
```js
for( let H=Hmodule.min;H<=Hmodule.max;H++){
    for( let C=Cmodule.min;C<=Cmodule.max;C++){
        for( let A=Amodule.min;A<=Amodule.max;A++){
            for( let M=Mmodule.min;M<=Mmodule.max;M++){
                for( let E=Emodule.min;E<=Emodule.max;E++){
                    for( let P=Pmodule.min;P<=Pmodule.max;P++){
                        for( let D=Dmodule.min;D<=Dmodule.max;D++){
                            if( (H*Hmodule.ects/100 + C*Cmodule.ects/100 + A*Amodule.ects/100 + M*Mmodule.ects/100 + E*Emodule.ects/100 + P*Pmodule.ects/100 + D*Dmodule.ects/100) === finalGrade ){
                                results.push([H,C,A,M,E,P,D])
                            }
                        }
                    }
                }
            }
        }
    }
}

```

## Step 17
- FYI, I update src/assets/calculate.js file to meet my expectation, as following:
```js
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
```
- make the table. shoing max 1000 results and put a buttons to nav between results if there is more thhan 1000 results,


## Step 18
- visualizing data of results in Chart.js via CDN
