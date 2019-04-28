var squarWidth = 50;
var bordWidth = 10;
var squareSet = [];
var table;
var choose = [];
var timer;
var baseScore = 5; //基础分
var stempScore = 10; //递增分
var totalScore = 0;
var targetScore = 2000;
var flag = true;
var tempSquare = null;

function refresh() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].row = i;
            squareSet[i][j].col = j;
            squareSet[i][j].style.transition = 'left 0.3s ,bottom 0.3s';
            squareSet[i][j].style.left = squareSet[i][j].col * squarWidth + 'px';
            squareSet[i][j].style.bottom = squareSet[i][j].row * squarWidth + 'px';
            squareSet[i][j].style.backgroundImage = "url(" + '../img/' + squareSet[i][j].num + '.png' + ")";
            squareSet[i][j].style.backgroundSize = 'cover';
            squareSet[i][j].style.transform = 'scale(0.95)';
        }
    }
}
// 创建小方块
function creatSquare(value, row, col) {
    var temp = document.createElement('div');
    temp.style.width = squarWidth + 'px';
    temp.style.height = squarWidth + 'px';
    temp.style.display = 'inline-block';
    temp.style.backgroundColor = 'red';
    temp.style.position = 'absolute';
    temp.style.boxSizing = 'borderbox';
    temp.style.borderRadius = '12px';
    temp.num = value;
    temp.row = row;
    temp.col = col;
    return temp;

}

function checkLinked(square, arr) {
    if (square == null) {
        return;
    }
    arr.push(square);
    //判断左边的小方块需不需要被收录进来
    //1.不能是最左边的；
    //2.左边要有；
    //3.左边的小方块和当前的小方块颜色相同
    //4.左边的小方块没有被收录进来
    if (square.col > 0 && squareSet[square.row][square.col - 1] && squareSet[square.row][square.col - 1].num == square.num && arr.indexOf(squareSet[square.row][square.col - 1]) == -1) {
        checkLinked(squareSet[square.row][square.col - 1], arr);
    }
    if (square.col < bordWidth - 1 && squareSet[square.row][square.col + 1] && squareSet[square.row][square.col + 1].num == square.num && arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
        checkLinked(squareSet[square.row][square.col + 1], arr);
    }
    if (square.row < bordWidth - 1 && squareSet[square.row + 1][square.col] && squareSet[square.row + 1][square.col].num == square.num && arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
        checkLinked(squareSet[square.row + 1][square.col], arr);
    }
    if (square.row > 0 && squareSet[square.row - 1][square.col] && squareSet[square.row - 1][square.col].num == square.num && arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
        checkLinked(squareSet[square.row - 1][square.col], arr);
    }
}
//小星星闪动效果
function flicker(arr) {
    var num = 0;
    timer = setInterval(function () {
        for (i = 0; i < arr.length; i++) {
            arr[i].style.border = '3px solid #BFEFFF';
            arr[i].style.transform = 'scale(' + (0.90 + 0.05 * +Math.pow(-1, num)) + ')';
        }
        num++;
    }, 300)
}

function goBack() {
    if (!(timer == null)) {
        clearInterval(timer);
    }
    for (i < 0; i < squareSet.length; i++) {
        for (j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].style.border = '0px solid #BFEFFF';
            squareSet[i][j].style.transform = 'scale(0.95)';
        }
    }
}

function selectScore() {
    var score = 0;
    for (var i = 0; i < choose.length; i++) {
        score += baseScore + i * stempScore; //基础分加递增分
    }
    if (score <= 0) {
        return;
    }
    document.getElementById('select_score').innerHTML = choose.length + '块' + score + '分';
    document.getElementById('select_score').style.transition = null;
    document.getElementById('select_score').style.opacity = 1;
    setTimeout(function () {
        document.getElementById('select_score').style.transition = 'opacity 1s';
        document.getElementById('select_score').style.opacity = 0;
    }, 1000)
}

function mouseOver(obj) {
    if (!flag) {
        tempSquare = obj;
        return;
    }
    goBack();
    choose = [];
    checkLinked(obj, choose);
    if (choose.length <= 1) {
        choose = [];
        return;
    }
    flicker(choose);
    selectScore();
}

function move() {
    // 向下移动
    for (var i = 0; i < bordWidth; i++) {
        var pointer = 0;
        for (var j = 0; j < bordWidth; j++) {
            if (squareSet[j][i] != null) {
                if (j != pointer) {
                    squareSet[pointer][i] = squareSet[j][i];
                    squareSet[j][i].row = pointer;
                    squareSet[j][i] = null;
                }
                pointer++;
            }
        }
    }
    //横向移动
    for (var i = 0; i < squareSet[0].length;) {
        if (squareSet[0][i] == null) {
            for (var j = 0; j < bordWidth; j++) {
                squareSet[j].splice(i, 1);
            }
            continue;
        }
        i++;
    }
    refresh();
}

function isFinish() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            var temp = [];
            checkLinked(squareSet[i][j], temp); //判断周围是否还存在可以消去的小方块
            if (temp.length > 1) {
                return false;
            }
        }
    }
    return true;
}

// 总体初始化
function init() {
    var table = document.getElementById('popStar');
    for (i = 0; i < bordWidth; i++) {
        squareSet[i] = new Array();
        for (j = 0; j < bordWidth; j++) {
            var square = creatSquare(Math.floor(Math.random() * 5), i, j); //创建小方块，双重循环，i是行j是是列
            square.onmouseover = function () {
                mouseOver(this);
            }
            square.onclick = function () {
                if (!flag || choose.length == 0) {
                    return;
                }
                flag = false;
                tempSquare = null;
                //加分数
                var score = 0;
                for (var i = 0; i < choose.length; i++) {
                    score += baseScore + i * stempScore; //基础分加递增分
                }
                totalScore += score;
                document.getElementById('now_score').innerHTML = '当前分数' + totalScore;
                //消灭星星
                for (var i = 0; i < choose.length; i++) {
                    (function (i) {
                        setTimeout(function () {
                            squareSet[choose[i].row][choose[i].col] = null;
                            table.removeChild(choose[i]);
                        }, i * 100)
                    })(i)
                }
                //移动
                setTimeout(function () {
                    move();
                    //判断结束
                    setTimeout(function () {
                        var is = isFinish();
                        if (is) {
                            if (totalScore > targetScore) {
                                alert('游戏获胜');
                            } else {
                                alert('游戏失败');
                            }
                        } else {
                            choose = [];
                            flag = true;
                            mouseOver(tempSquare);
                        }
                    }, choose.length * 100 + 300)

                }, choose.length * 100)
            }
            squareSet[i][j] = square;
            table.appendChild(square);
        }
    }
    refresh();
}
window.onload = function () {
    init();
}