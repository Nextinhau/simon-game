let isGaming = false
let isPlayerTurn = false
let cpuBoxList = []
let playerBoxList = []
let score = 0
let playerPressCount = 0
// js引用文件要用html作为路径起点，唔可以用js的路径为起点，因为js最终会畀复制到html入边
const audioPlayerList = [
    new Audio("./static/audios/red.mp3"),
    new Audio("./static/audios/green.mp3"),
    new Audio("./static/audios/blue.mp3"),
    new Audio("./static/audios/orange.mp3"),
    new Audio("./static/audios/wrong.mp3")
]

$(document).ready(async () => {
    $(document).keydown(async (event) => {
            if (!isGaming) {
                if (event.code === "Space") {
                    await waitAMinute(500)
                    isGaming = true
                    enterCpuTurn()
                }
            } else {
                // 玩家回合
                if (isPlayerTurn) {
                    if (event.code === "ArrowUp" || event.code === "ArrowLeft" || event.code === "ArrowDown" || event.code === "ArrowRight") {
                        playerPressCount++
                        if (playerPressCount <= cpuBoxList.length) {
                            enterPlayerTurn(event.code)
                        }
                    }
                }
            }
        }
    )
})

async function enterCpuTurn() {
    const randomCpuBoxIndex = getRandomBoxIndex()
    const cpuBox = ".game-box-" + randomCpuBoxIndex

    $(".title").text("cpu turn!")
    cpuBoxList.push(cpuBox)
    await showCpuBoxes(cpuBoxList)

    isPlayerTurn = true
    $(".title").text("your turn!")
}

async function enterPlayerTurn(keyCode) {
    let playerBox
    let lastIndex

    switch (keyCode) {
        case "ArrowUp":
            playerBox = ".game-box-1"
            break
        case "ArrowLeft":
            playerBox = ".game-box-2"
            break
        case "ArrowDown":
            playerBox = ".game-box-3"
            break
        case "ArrowRight":
            playerBox = ".game-box-4"
            break
        default:
            break
    }
    playerBoxList.push(playerBox)
    lastIndex = playerBoxList.length - 1

    // 方块点击阴影效果
    await showPlayerBoxes(playerBoxList[lastIndex])

    // 如果出错，画面变红，出局，return结束函数
    if (playerBoxList[lastIndex] !== cpuBoxList[lastIndex]) {
        // 失败音乐
        audioPlayerList[audioPlayerList.length - 1].play()

        $(".content").toggleClass("red")
        await waitAMinute(1500)
        $(".content").toggleClass("red")

        $(".title").html("score: <span>" + score + "</span><br>press space to restart!")
        isGaming = false
        init()
    }
    // 如果正确
    else {
        // 如果玩家所有答案和Cpu出题一样，则进入下一个回合
        if (lastIndex === cpuBoxList.length - 1) {
            score++
            await waitAMinute(500)
            isPlayerTurn = false
            playerPressCount = 0
            playerBoxList = []
            enterCpuTurn()
        }
    }
}

// 使用Promise异步加上async，await，令程序可以等待阴影效果结束之后，再继续出题，使用同步会造成程序混乱，Cpu题目为提前计算的集合，使用循环
async function showCpuBoxes(boxList) {
    // 选择要播放的声音
    let audioPlayerIndex

    for (let i = 0; i < boxList.length; i++) {
        await waitAMinute(500)

        audioPlayerIndex = boxList[i][boxList[i].length - 1] - 1
        audioPlayerList[audioPlayerIndex].play()

        $(boxList[i]).toggleClass("keypress")
        await waitAMinute(100)
        $(boxList[i]).toggleClass("keypress")
        await waitAMinute(500)
    }
}

// 同理使用Promise造成等待，玩家答题是根据玩家实时监听键盘的结果，所以需要一个一个的验证，不使用循环，同样使用等待实现阴影效果
async function showPlayerBoxes(box) {
    // 选择要播放的声音
    let audioPlayerIndex = box[box.length - 1] - 1
    audioPlayerList[audioPlayerIndex].play()

    $(box).toggleClass("keypress")
    await waitAMinute(100)
    $(box).toggleClass("keypress")
}

// 生成随机数，决定是哪个方块
function getRandomBoxIndex() {
    return Math.floor(Math.random() * 4) + 1
}

// 封装一个Promise等待函数，简洁代码，自定义等待时间，用于缓冲游戏节奏
function waitAMinute(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

// 初始化所有变量
function init() {
    isGaming = false
    isPlayerTurn = false
    cpuBoxList = []
    playerBoxList = []
    score = 0
    playerPressCount = 0
}