// 設定遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched : "CardsMatched",
  GameFinished: "GameFinished"
}


// 宣告花色陣列

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 宣告 Model
const model = {
  //revealedCards 代表被翻開的卡，是一個暫存牌組
  revealedCards: [],

  // 如果index除以13的餘數相同表示數字一樣，回傳布林直true or false
  isRevealdedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },
// 新增分數和嘗試次數
  score: 0,
  triedTimes: 0
}

const view = {
  /* 
  當物件的屬性與函式/變數名稱相同時，可以省略不寫
  displayCards: function displayCards() { ...  }
  */

// 卡片內容獨立出來
  getCardContent (index) {
    const number = this.transformNumber((index % 13) + 1)// index 0-51 牌的餘數加1
    const symbol = Symbols[Math.floor(index / 13)] // 取symbol陣列數抓花色

    // template的點要在這不能放下面
    return`<p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
    
  },

//  getCardElement - 負責生成卡片內容，包括花色和數字，之後要把內外拆開卡片內容獨立出來
// 拆開後只渲染外部卡面(背面)
    getCardElement (index) { 
    // template的點要在這不能放下面，補上index用來翻牌時確認位置用
      return`<div data-index="${index}" class="card back"></div>`
  },
  transformNumber (number) {
    switch (number) {
      case 1: // case value1 當 expression 的值符合 value1 要執行的陳述句
        return 'A'
      case 11:
        return 'J'
      case 12:
      return 'Q'
      case 13:
      return 'K'
      default: //當 expression 的值都不符合上述條件 要執行的陳述句
          return number
    }
  },
  // displayCards - 負責選出 #cards 並抽換內容
  /* 這裡的indexes本來是沒有的為空參數，現在因為要MVC架構所以這裡放入參數。
  這個indexes單純只放被打散過的陣列，所以utility.getRandomNumberArray(52)這個也是要放在controller裡面呼叫後把打散過後的indexes放入displayCards裡，就不會跟utility耦合起來*/
  displayCards(indexes) { 
  const rootElement = document.querySelector('#cards')
  rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  // this 指函式 view

  // 從Array(52).keys()拿到 array 實體，接著我們要新增array要從哪裡來?
  // 我們會從這個Array(52).keys()迭代器來

  // 將這個從 array.keys 的 index 印出的0-51 的 新陣列(from 出來的) map 出來，如果沒有加join就還是一個陣列，變成52個卡片內容的陣列，
  // 所以我們要用join去把陣列內的內容拆解出來把它們黏在一起
  
  // 為了要洗牌，會把Array.from(Array(52).keys())住這個陣列換成utility.getRandomNumberArray(52)這個亂數陣列
  },

  // 展開運算子 (spread operator)
  // flipCards(1, 2, 3, 4, 5) 如果用展開運算式就可以把多個參數整合成一個陣列
  // cards = [1,2,3,4,5]
  flipCards (...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
       card.classList.remove('back') //回傳背面
       // 從html拿回來的資料大部分都是字串所以要用number轉換
       card.innerHTML = this.getCardContent(Number(card.dataset.index))
       return
    }
    card.classList.add('back') 
    card.innerHTML = null //卡面背面是部會有花字地所以要清空null為空值
    //如果是正面
    //回傳背面

    })
    
  },

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
   
  },

  // 在view內新增渲染分數和次數，controller動作後渲染分數和次數

  renderScore(score) {
    document.querySelector('.score').textContent = `Score:${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`

  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', 
        event => {
          card.classList.remove('wrong')
        },
        {
          once: true// 為了不讓瀏覽器增加負擔，這個監聽器只會觸發一次，觸發完後就會一次消失
        }
      )
    })
  },

  showGameFinished() {
    const showGameFinished = document.createElement('div')
    showGameFinished.classList.add('completed')
    showGameFinished.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(showGameFinished) // 在header前面插入遊戲結束內容
  }

}

// 洗牌函式
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randonIndex = Math.floor(Math.random() * (index + 1))
      ;[number[index],number[randonIndex]] = [number[randonIndex], number[index]]
    }
   return number
  }
}
// 陣列被洗亂
// console.log(utility.getRandomNumberArray(5)) 




// 宣告Controller

const controller = {
  currentState: GAME_STATE.FirstCardAwaits, // 初始屬性
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  // 依照不同遊戲狀態，做不同的行為
  dispatchCardAction(card) {
    // 如果已經是被翻開的卡片，就不會再被蓋起來
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      // 狀態在一時，把狀態改成等待第二章翻開以及翻開第一張花色
      // 再來把這張卡片放進revealedCards空陣列裡
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break 
        //中斷後下方程式碼還是可以繼續進行，return後面的程式碼就不會執行

      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes) // 不管有沒有成功，翻牌二次嘗試次數就++
        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷配對是否成功

        if (model.isRevealdedCardsMatched()) {
          //配對成功的話，加上背景顏色強調，狀態更改到Matched，並在改回初始狀態(因為程式碼不多才會覺得怪怪的但一多就有差)
          // 這裡沒有執行翻回去所以配對成功的排不會被翻

          view.renderScore(model.score += 10) // 配對成功加10分
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          this.currentState = GAME_STATE.FirstCardAwaits
          model.revealedCards = []
          if(model.score === 260) {
            // console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
          }
        } else { 
          //配對失敗的話，狀態改成失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          // 一秒後再執行翻回去的動作，狀態改成初始

          // 顯示錯誤的動畫
          view.appendWrongAnimation(...model.revealedCards)

          /*  setTimeout這個API意思，第一個參數是想要執行的函式內容，第二個參數是停留的毫秒 (1000 毫秒為 1 秒)，在計時器跑完以後，就會執行函式內容。*/

          setTimeout(this.resetCards,1000)
          // setTimeout的第一個參數是要放函式本身，而不是放函式回傳值
          // 因為在controller所以this是controller沒錯
          
        }
        break
    }
    console.log(`current state:`, this.currentState)
    
    // map出card裡的index
    console.log(`revealed cards:`, model.revealedCards.map(card => card.dataset.index))

  },

  resetCards() {
    // console.log(this) 會印出Windows瀏覽器
    // 先翻回來再清空revealedCards
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
     controller.currentState = GAME_STATE.FirstCardAwaits
     // 這裡不是this的原因是因為setTimeout呼叫了resetCards，這時候的this就不是controller，this 的對象變成了 setTimeout
     // 而 setTimeout 又是一個由瀏覽器提供的東西，所以console.log this 時會是 Windows
  }
}

controller.generateCards() //因為統一都由controller控制，所以把view.displayCards()放入controller控制

// 為每一個 .card 產生監聽器，總共需要 52 個監聽器 較直觀的作法
// querySelectorAll 抓到會回傳 arraylike 的 nodeList陣列
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card) // 點擊後抓到DOM元素印出翻牌的內容
  })
})