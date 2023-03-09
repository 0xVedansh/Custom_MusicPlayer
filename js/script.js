// let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list")
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load" , ()=>{
    loadMusic(musicIndex); // Calling load music function once window loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    // here, we will just increment the musicIndex by 1;
    musicIndex++;
    // if musicIndex is greater than array length then musicIndex will be 1. So, the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    //here, we will decrement the musicIndex by 1;
    musicIndex--;
    // if musicIndex is less than 1 then musicIndex will be array length. So, the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or music button event
playPauseBtn.addEventListener("click", ()=> {
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); 
    // calling next music function
});

// previous music btn event
prevBtn.addEventListener("click", ()=> {
    prevMusic();
    // calling preious music function
});

//  update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=> {
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; // getting the total time of song
    let progressWidth = (currentTime/duration)*100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata", ()=> { 

        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
});

        // update playing song current time
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){ // adding 0 if sec is less than 10
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// let's update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e)=> {
    let progressWidthval = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX // getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// let's work on the repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=> {
    // first we'll get the innerText of the icon and then change accordingly
    let getText = repeatBtn.innerText; // getting innerText of icon 
    // let's do different changes on different icon click using switch

    switch(getText){
        case "repeat": // if this icon is repeat then change it to repeat_one.
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");   
            break;

        case "repeat_one": // if this icon is repeat_one then change it to shuffle.
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled");
            break;

        case "shuffle": // if this icon is shuffle then change it to repeat again.
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
});

//above we just changed the icon, now let's work on what to do after the song is ended
mainAudio.addEventListener("ended", ()=> {
    // we'll do according to the icon means if user has set icon to loop song thwn we'll repeat the current song 
    // and will do further accordingly

    let getText = repeatBtn.innerText; // getting innerText of icon
    // let's do different changes on different icon using switch
    switch(getText){
        case "repeat": // if this icon is repeat, then simply we call the nextMusic function. So, the next song will play.
        nextMusic();
        break;

        case "repeat_one": // if icon is repeat_one then we'll change the current time of the playing song to 0. Sp, 
        // that song will play from the beginning again.
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic(); // calling playMusic function.
        break;

        case "shuffle": 
        // generating random index between the max range of array length
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        do{
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex) // this loop run until the next random number won't be the same of 
        // current music index.
        musicIndex = randIndex; // passing randIndex to musicIndex. So, the random song will play.
        loadMusic(musicIndex); // calling loadMusic function.
        playMusic(); // calling playMusic function.
        playingNow();
        break;
    }
}); 

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=> {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// let's create li according to the array length
for(let i=0; i<allMusic.length; i++){
    // let's pass the song name, artist from the array to li
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:28</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=> {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // adding t-duration attribute which we'll use below 
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
}

// let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
// console.log(allLiTags);
function playingNow(){
for(let j=0; j<allLiTags.length; j++){
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    // let's remove playing class from all other li expect the last one which is clicked 
    if(allLiTags[j].classList.contains("playing")){
        allLiTags[j].classList.remove("playing");
        // let's get that audio duration value and pass to .audio-duration innertext
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration; // passing t-duration value to audio duration innerText 
    }

    // if there is an li tag which li-index is equal to musicIndex, 
    // then this music is playing now and we'll style it
    if(allLiTags[j].getAttribute("li-index") == musicIndex){
        allLiTags[j].classList.add("playing");
        audioTag.innerText = "Playing";
    }

    // adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// let's play song on li click
function clicked(element){
    // getting li index of particular clicked li tag 
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that li-index to musicIndex
    loadMusic(musicIndex);
    playMusic(); 
    playingNow();
}
