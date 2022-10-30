
const search = document.body.querySelector('input');
const button = document.getElementById('button');
const iframe = document.querySelector('iframe');
const iframeContainer = document.getElementById('iframeContainer');
const placeURL = document.querySelector('iframe').src;
let tubeURL = null;
let fixedURL = null;
//adds old movie intro when enter key is pressed
search.addEventListener('keypress',(e) => {
   if(e.key =='Enter'){
   searchNow();
   initializeVideo();
   }  
});

button.addEventListener('click', searchNow);
/*
take in URL add, It to a variable creates an element (iframe) function.
Remove the ‘youtube’ portion of URL and add ‘you-tube’ then return URL to src="" */
function searchNow (e) {
    tubeURL = [...search.value];
    tubeURL.splice(16,0,'-');
    fixedURL = tubeURL.join('');
    search.value = '';
    return iframe.setAttribute('src', fixedURL);
    iframe.click(); //doesn't work need to fix
        
 }

 button.addEventListener('click', initializeVideo);
 //button.addEventListener('click', VideoPlay);
 let vidIntro = document.getElementById('vid-introduction');
//when button is clicked a short gif will appear. Play once. then youtube video will display
/*
.video-intro will display: visible for 3.1seconds then display:none OR class can be removed
then iframeContainer will go from display: none to display:flex; 
*/
 function initializeVideo(){
   vidIntro.setAttribute("style", "display: visible");
   setTimeout(()=>{
   //console.log('working');
      vidIntro.style.display = 'none';
      iframeContainer.setAttribute("style", "display: visible");
      
}, "3100")
 }

 //in the works click() doesn't initiate look into youtube's API
 /*
function VideoPlay(e) {
   setTimeout(()=>{
    //  iframe.click();
     console.log(e.target, iframe);
   }, "3210")  
}
*/



/* ----------------------NEWS API FETCH REQUEST ---------------------------------*/

document.addEventListener('click', getNews)
const newsAPIKey = `837d794f-7d2f-482d-bd2e-249dd665a0e8`;
let searchTopic = `culture`;
let searchTopic2 = `music`;
let searchTopic3 = `us news`
//const newsURL = `https://content.guardianapis.com/search?q=${searchTopic}debate&api-key=${newsAPIKey}`
const newsURLAND = `https://content.guardianapis.com/search?q=${searchTopic}%20AND${searchTopic2}%20AND${searchTopic3}debate&api-key=${newsAPIKey}`;

let newsContainer = document.querySelector(".news-container");

async function getNews() {
   const newsResp = await fetch(newsURLAND);
   const newsData = await newsResp.json();
   let { response: { results }} = await newsData;
      let fragment = document.createDocumentFragment(); 
      let html = '';
      results.forEach(result => {
        let { webTitle, webPublicationDate, webUrl, sectionName, type } = result;
        console.log(webUrl);
        let monthDate = webPublicationDate.slice(0,10).split("-").join('/').slice(5,10);
        let year = webPublicationDate.slice(0,10).split("-").slice(0,1);
        let newsDate = monthDate.concat(`/${year}`);
      
        const cardContent = document.createElement('div');
        cardContent.setAttribute("class","card-content");
        const cardTitle = document.createElement('h2');
        cardTitle.setAttribute("class", " card-title")
        cardTitle.textContent = `${webTitle}`;
        const cardBody = document.createElement('p');
        cardBody.setAttribute("class", "card-body")
        cardBody.textContent = `${sectionName} ${type}`;
        const cardFooter = document.createElement('div');
        cardFooter.setAttribute("class", "card-footer");
        const cardPublishedDate = document.createElement('p')
        cardPublishedDate.setAttribute("class", "card-published-date");
        cardPublishedDate.textContent =`${newsDate}`;
        const cardBtn = document.createElement('a');
        cardBtn.setAttribute(`href`, `${webUrl}`);
        cardBtn.setAttribute('target', '_blank');
        cardBtn.setAttribute("class", "card-btn");
        cardBtn.textContent = 'Read News';
        cardFooter.append(cardPublishedDate, cardBtn);
        cardContent.append(cardTitle, cardBody, cardFooter);
        fragment.append(cardContent);
        newsContainer.append(fragment);
      }) 
}




/*
 News topics that can be searched -- Can combine them and get more precise results 
business politics,sports, culture, music, science, big data, us news, world news, global development, tech, film, US sports
*/



//-------------------------------------------------------------------------------------------------------

//gets webPublicationDate and curates date 
/*
let webPublicationDate = "2022-09-04T07:00:41Z";

function getCorrectedPublicationDate (webPublicationDate) {
    let monthDate = webPublicationDate.slice(0,10).split("-").join('/').slice(5,10);
    let year = webPublicationDate.slice(0,10).split("-").slice(0,1)
    return monthDate.concat(`/${year}`);
}

let publicationDate = getCorrectedPublicationDate(webPublicationDate);

console.log(date)

*/



 /*
Write a function that adjust video size responsively with the 16/9 ratio
width is good. height needs to be adjusted.
*/
const container = document.querySelector('.container');
const width = container.offsetWidth;
const height = window.innerHeight;



 let videoWidth = iframe["width"]; 
 let videoHeight = iframe["height"]; 

const caption = document.querySelector('.caption');
let captionSize = caption.offsetWidth;

window.addEventListener('load', videoResizer);
window.addEventListener('resize', videoResizer);


function videoResizer() {
   //videoHeightContainer = videoWidthContainer*0.5625;
    videoHeight = (width *0.5625) *.95;
    videoWidth = (videoHeight * 1.776) * .95;
    captionSize = width * .75 + 'px';
    //console.log(`video width is ${videoWidth} and video height is now ${videoHeight}`);
    //console.log(`videoContainer width is ${width} and videoContainer height is now ${height} `);
   // console.log(`caption width size is ${captionSize}`)
    
}



/*
the function and event listener below retrieve URL into page and open it. 
could be adapted to open in new tab for a 'open URL in youtube' option.
 _parent, _top, _self open in same window while  
const self = window.name;
button.addEventListener('click', openURL);

function openURL() {
   tubeURL = search.value;
   window.open(tubeURL,'_self');
   console.log(tubeURL);

}
*/


/* 

when window loads resize the height of video
//const videoWidth = iframe.offsetWidth; 
 //let videoHeight = iframe.offsetHeight; 

const iframeContainer= document.querySelector('.iframeContainer');
 //const videoWidthContainer = iframeContainer.offsetWidth; 
 //let videoHeightContainer = iframeContainer.offsetHeight; 

*/
