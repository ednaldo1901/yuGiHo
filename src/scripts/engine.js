const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector("#score_points")
    },
    cardsSprites:{
        avatar:document.querySelector("#card-image"),
        name:document.querySelector("#card-name"),
        type:document.querySelector("#card-type")
    },
    fieldCards:{
      player:document.querySelector("#player-fiel-card"),  
      computer:document.querySelector("#computer-fiel-card")  
    },
    playerSides :{
        player1 : "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },

    actions:{
        button:document.querySelector("#next-duel")
    }
    
}


const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Roch",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]


async function getRandomCardId() {
    const randamIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randamIndex].id;
}

async function createCardImage(idCard,fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){

        cardImage.addEventListener("mouseover",()=>{
            drawSelectCard(idCard)
        })

        cardImage.addEventListener("click",() =>{
            setCardField(cardImage.getAttribute("data-id")); 
        });
    }

    return cardImage;
}

async function setCardField(cardId){
    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    await mostrarOuNaoDisplay(true);

    await esconderCartas();

    await setarImagemPeloId(cardId,computerCardId);

    let duelResults =   await checkDuelResults(cardId,computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function setarImagemPeloId(cardId,computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function mostrarOuNaoDisplay(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if(value === false){
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }
}

async function esconderCartas(){
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block"
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "empate";
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults ="Win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
        
    }
    await sound(duelResults);

    return duelResults;

}

async function removeAllCardsImage(){
    let {computerBOX,player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attibute: " + cardData[index].type;
}

async function drawcards(cardsNumbers, fieldSide){
    for(let i = 0; i < cardsNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard,fieldSide);
         
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init();
}

async function sound(status){
    const audio = new Audio(`src/assets/audios/${status}.wav`);
    audio.play();
}

function init(){
    mostrarOuNaoDisplay(false);

 drawcards(5,state.playerSides.player1);
 drawcards(5,state.playerSides.computer);
 const bgm = document.getElementById("bgm");
 //bgm.play();
}

init();