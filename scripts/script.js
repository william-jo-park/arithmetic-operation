var minValue = 1;
var maxValue = 10; /* 한 자리수 게임일 경우는 10, 두 자리수 게임일 경우는 100, 세 자리는 1000, ... */

var minOper = 0;
var maxOper = 4;

var digitNum = 1; /* 자리수 - 이수 자리수를 높일 경우 자리수에 대한 입력값을 전달 받도록 수정 필요 */

// var arithSym = ["+", "-", "X", "&divide;"];
var arithSym = ["＋", "－", "×", "÷"];

var startCount = 1;

var problemField = document.querySelector('.problemField');
// var startSubmit = document.querySelector('.startSubmit');

var answerField = document.querySelector('.answerField');
var answerSubmit = document.querySelector('.answerSubmit');

var truefalseField = document.querySelector('.truefalseField');

var answerVal = 0;

var timerId1 = null;
// answerField.focus();


/* min 이상 max 미만의 정수 난수를 생성하기 */
function createRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createOperator(min, max) {
    var vOper = createRandomNumber(min, max);
    return vOper;
}

/* min 이상 max 미만의 정수 난수를 생성하기 */
function createNumber(min, max, oper) {
    var randomN1 = 0;
    var randomN2 = 0;

    randomN1 = createRandomNumber(min, max);
    randomN2 = createRandomNumber(min, max);

    if(oper === 1 || oper === 3) { /* 뺄셈 또는 나눗셈 일 경우 */
        console.log("In case of 뺄셈 또는 나눗셈");
        // console.log("randomN1 = " + randomN1, ", ", "randomN2 = " + randomN2);

        if(randomN1 < randomN2) {
            randomN1 = createRandomNumber(randomN2, max);
            // console.log("randomN1 = " + randomN1);
        }

        /* 나눗셈일 경우 */
        if(oper === 3) {
            console.log("나눗셈 연산");

            max = max / 2;
            // console.log("max = " + max);

            if(randomN2 >= max) {
                randomN2 = createRandomNumber(min, max);
                // console.log("randomN2 가 max 보다 같거나 크기때문에 randomN2 를 재 생성함, randomN2 = " + randomN2);    
            } else {
                // console.log("randomN2 가 max 보다 작기때문에 randomN2 를 재 생성하지 않음");
            }

            if((randomN1 % randomN2) !== 0) {
                // console.log("나머지가 존재하기 때문에 randomN1 재 생성 진행");

                for(var i = minValue; i <= max; i++) {
                    // console.log("i = " + i);
                    
                    if((i * randomN2) >= maxValue) {
                        var j = createRandomNumber(minValue, i);
                        // console.log("j = " + j);
                        randomN1 = j * randomN2;
                        // console.log("randomN1 = " + randomN1, " = ", j, " * ", randomN2);

                        if((randomN1 % randomN2) === 0) {
                            console.log("재 생성 OK!");
                        } else {
                            console.log("재 생성 FAIL!");
                        }
                        break;
                    }
                }
            } else {
                // console.log("나머지 = 0 : N1을 재 생성하지 않음");
            }
        }
    } else {
        console.log("In case of 덧셈 and 곱셈");
    }

    return [randomN1, randomN2];
}


/* 정답 계산하기 */
function calcAnswer(v1, v2, v3) {
    var result = 0;

    // 사칙연산 기호에 대한 경우의 수로 구분하여 계산하기
    switch(v3) {
        case 0: // 덧셈
            result = v1 + v2;
            break;
        case 1: // 뺄셈
            result = v1 - v2;
            break;
        case 2: // 곱셈
            result = v1 * v2;
            break;
        case 3: // 나눗셈
            result = v1 / v2;
            break;
        default:
            break;
    };

    return result;
}


/* "(정수) (사칙연산 기호) (정수)" 형태를 만들어서 화면에 출력하기 */
function makeProblemAnswer() {
    // console.log("Running makeProblemAnswer() function");

    // 사칙연산 기호 값 생성하기
    var symVal = createOperator(minOper, maxOper);

    // 두 개의 정수 생성하기
    //var numOne = createNumber(minValue, maxValue, symVal);
    var numVal = createNumber(minValue, maxValue, symVal);
    var numOne = numVal[0];
    var numTwo = numVal[1];

    // console.log("numOne: " + numOne, ", ", "numTwo: " + numTwo);

    // 화면에 출력할 문제 정리하기
    if(startCount === 1) {
        problemField.textContent = numOne + '  ' + arithSym[symVal] + '  ' + numTwo + ' =';
        // document.write(numOne + '  ' + arithSym[symVal] + '  ' + numTwo + ' =');
    }

    // 정답 계산하기
    answerVal = calcAnswer(numOne, numTwo, symVal);
    // console.log(answerVal);

    // 타이머를 지워주기
    clearTimeout(timerId1);
}


/* 문제 영역을 초기화한 후 0.5초 뒤에 문제를 */
function printProblem() {
    // console.log("Running printProblem() function");

    // 기존의 문제를 지우기
    problemField.textContent = "";

    // 새로운 문제를 0.5초 뒤에 출력하기
    timerId1 = setTimeout(function() {
        makeProblemAnswer();
    }, 500);

    // 정답 입력란을 지우고 커서를 네모 박스에 위치 시키기
    answerField.value = '';
    answerField.focus();
}


/* Key Event 처리하기 */
answerField.addEventListener('keydown', function(e) {
    const keyCode = e.keyCode;
    // console.log("Pressed key " + e.key + "( " + keyCode + " )");

    if(keyCode === 13) {
        // console.log("Check answer by EnterKey");
        checkAnswer();
    }
});


/* 정답 확인하기 */
function checkAnswer() {
    // console.log("입력된 값: " + answerField.value);

    // 입력된 값이 없을 경우 답을 입력하라는 메시지 출력하기
    if(answerField.value === "") {
        // alert("답을 입력하세요!!!");
        truefalseField.textContent = '답을 입력하세요!!!';
        truefalseField.style.backgroundColor = 'yellow';
    } else {
        // 네모 박스에 입력된 값을 가져오기
        var userAnswer = Number(answerField.value);
        console.log("입력된 정답: " + userAnswer);

        // 입력된 값과 실제 결과값을 비교하기
        if(userAnswer === answerVal) {
            // alert("정답입니다!!!");
            truefalseField.textContent = '정답 입니다!!!';
            truefalseField.style.backgroundColor = 'green';
        } else {
            // alert("틀렸습니다!!!");
            truefalseField.textContent = '오답 입니다!!!';
            truefalseField.style.backgroundColor = 'red';
        }

        // 정답 확인 결과 지우기
        // truefalseField.textContent = '';

        // 다음 문제를 표시하기
        printProblem();
    }
}


/* Game 페이지가 로드될 때 문제를 생성하는 함수 수행 하기 */
document.getElementById("h1Title").addEventListener('load', printProblem());


/* 정답 확인을 위한 이벤트 수행 하기 */
answerSubmit.addEventListener('click', checkAnswer);



/* To Do
1. 시작 페이지에서 게임 페이지로 넘어 갈 때 문제 출력하기 <-- Completed
2. 첫 문제 출력하기 전에 시작 지연 주기 ( 3초 ) <-- Completed
3. Enter를 입력하면 정답을 확인하도록 수정 <-- Completed
4. 하나의 문제를 풀고나면 다른 문제가 출제되도록 수정 <-- Completed
5. 답을 확인한 후 문제 영역을 지우도록 수정 <-- Completed
6. 뺄셈과 나눗셈의 경우 빼는 수(또는 나눠지는 수)가 빼지는 수(또는 나누는 수)보다 큰 수를 가지도록 수정 <-- Completed
7. 나눗셈의 경우 나머지가 생기지 않도록 수정 <-- Completed

8. 향후 나눗셈의 경우 몫과 나머지를 입력할 수 있는 양식으로 수정
9. 10개의 문제로 문제 수를 제한
10. 답을 입력하면 문제 풀이 시간을 표시하도록 수정
11. 10개의 문제를 다 풀고 나면 몇 개를 맞췄고, 몇 개를 틀렸는지 표시하도록 수정
12. 가장 빨리 답을 입력한 시간과 가장 늦게 답을 입력한 시간을 표시하도록 수정
13. 덧셈, 뺄셈, 곱셈, 나눗셈에 대해 혼합하여 푸는 방식을 개별로 나누어서 진행 할 수 있도록 수정
14. 게임을 진행할 숫자의 범위를 설정할 수 있도록 수정

15. 문제와 답을 입력하는 양식을 화면 중앙에 위치하도록 수정 <-- Completed
*/