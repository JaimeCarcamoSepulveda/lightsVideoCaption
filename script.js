
const search = document.body.querySelector('input');
const button = document.getElementById('button');
const iframe = document.querySelector('iframe');
const iframeContainer = document.getElementById('iframeContainer');
const caption = document.querySelector('.caption');
const resultsContainer = document.querySelector(`.results`);
const newsContainer = document.querySelector(".news-container");
const searchContainer = document.querySelector('.searchContainer');
const placeURL = document.querySelector('iframe').src;
let fixedURL = null;

//add old movie intro when enter key is pressed and alters youtube URL before adding to iframe src 
search.addEventListener('keypress',(e) => {
   if(e.key =='Enter'){
   searchNow();
   initializeVideoIntro();
   return getNews();
   }  
});

button.addEventListener('click', searchNow);
/* take URL, make it an array. Remove ‘youtube’ portion add ‘you-tube’ return URL to src="" */
function searchNow (e) {
   let originalURL = ''
    originalURL = [...search.value];
    originalURL.splice(16,0,'-');
    fixedURL = originalURL.join('');
    search.value = '';
    return iframe.setAttribute('src', fixedURL);      
 }

//when button is clicked a short gif will appear. Play once. then youtube video will display
 button.addEventListener('click', initializeVideoIntro);
let vidIntro = document.getElementById('vid-introduction');
/*.video-intro will display: visible for 3.1seconds then display:none. After iframeContainer to change from display: none to visible; */
 function initializeVideoIntro(){
   vidIntro.setAttribute("style", "display: visible");
   setTimeout(()=>{
      vidIntro.style.display = 'none';
      iframeContainer.setAttribute("style", "display: visible"); 
   }, 3100)
 }

/* ------------------------NEWS API FETCH REQUEST ------------------------------------------------------*/
button.addEventListener('click', getNews)

//---GETS NEWS AND INPUTS IT INTO HTML AS CARDS ---------------------------------------------------
let newsArray = 0; 
let timesToQueueGetNews = 2;
async function getNews() {
   timesToQueueGetNews--;
   newsArray++;   // gets added before it's used. 1-based (although it starts with 0)
   const newsAPIKey = `837d794f-7d2f-482d-bd2e-249dd665a0e8`;
   let searchTopicOne = getNewsTopic(); //Assigned random news topic 
   let searchTopicTwo = checkTopic(searchTopicOne, getNewsTopic()); //Assigns random news topic checks to avoid duplicate news topic
   let newsURLmultipleTopics = `https://content.guardianapis.com/search?q=${searchTopicOne}%20AND${searchTopicTwo}&api-key=${newsAPIKey}`;
   //console.log(`search number: ${newsArray}, News URL multiple topics ${newsURLmultipleTopics}`)

   const newsResp = await fetch(newsURLmultipleTopics);
   const newsData = await newsResp.json();
   let { response: { results }} = await newsData;
      let fragment = document.createDocumentFragment(); 
      let newsIndex = 0;
      let newsSnippetArray = [ ]
      let arrayLength = results.length;

      results.forEach(result => {
      //creates card-content for each news article and places it in DOM invisibly
      let { webTitle, webPublicationDate, webUrl, sectionName, type } = result;
        let monthDate = webPublicationDate.slice(0,10).split("-").join('/').slice(5,10);
        let year = webPublicationDate.slice(0,10).split("-").slice(0,1);
        let newsDate = monthDate.concat(`/${year}`);
        const cardContent = document.createElement('div');
        cardContent.classList.add("card-content", "invisible");
        const cardTitle = document.createElement('h2');
        cardTitle.setAttribute("class", " card-title")
        cardTitle.dataset.newsArray = `${newsArray}`
        cardTitle.dataset.newsIndex = `${newsIndex}`
        cardTitle.textContent = `${webTitle}`;
        const cardType = document.createElement('p'); //const cardBody = document.createElement('p');
        cardType.setAttribute("class", "card-type") // ("class", "card-body")
        cardType.textContent = `${sectionName} ${type}`; // `${sectionName} ${type}`
        const cardFooter = document.createElement('div');
        cardFooter.setAttribute("class", "card-footer");
        const cardPublishedDate = document.createElement('p')
        cardPublishedDate.setAttribute("class", "card-published-date"); // ("class", "card-published-date")
        cardPublishedDate.textContent =`${newsDate}`; //`${newsDate}`
        const cardBtn = document.createElement('a');
        cardBtn.setAttribute(`href`, `${webUrl}`);
        cardBtn.setAttribute('target', '_blank');
        cardBtn.setAttribute("class", "card-btn");
        cardBtn.textContent = 'Read More';
        cardFooter.append(cardBtn, cardType); // cardFooter.append(cardPublishedDate, cardBtn);
        cardContent.append(cardTitle, cardPublishedDate, cardFooter); // cardContent.append(cardTitle, cardBody, cardFooter);
        fragment.append(cardContent);
        newsContainer.append(fragment);    
//----Create News Snippet Array from  newsSnippetItems send to getNewsSnippet function-------------------------------------------------------------
         let newsSnippetItem = { href: webUrl, newsIndex: newsIndex, newsArray: newsArray, webTitle: webTitle, sectionName: sectionName };
         newsSnippetArray.push({newsSnippetItem});   
         newsIndex++;

         if(newsSnippetArray.length === arrayLength /*10*/ ) {
            return getNewsSnippet(newsSnippetArray)
         }
      }) 
}


/*
Cycle through newsSnippets array 3x then makes new fetch request stops by default at 2 //--can change later to match length of video playing 

2.-Make newsItem clickable so that it display it's news card counter part.
3.-Allow option to remove, save, or go to news link when hovered over news Snippet. Put event listener on newsContainer
4.-Style news card for each theme of sectionName. Maybe add picture or nice color mixture
5.-Look into including youtubeAPI to enable a customizable play button and volume button
6.-Include instructions on how news Snippets work.
7.-Allow for selection of news type. Example global news, art/entertainment only etc... 

*/
let snippetContainer = document.querySelector('#snippet-container');

function getNewsSnippet(newsSnippetArray) {
   let newsArrayDisplayedTimes = 1;
   snippetContainer.setAttribute("style", "opacity: 1;");
   snippetContainer.setAttribute("data-visible", " ");
   let snippetContainerVisible = document.querySelector(`#snippet-container[data-visible]`);
   let counter = 0;
   setInterval(postIt, 18000);
   function postIt() {
      if(counter < newsSnippetArray.length) {
      
         let { newsSnippetItem: { href: webUrl, newsIndex, newsArray, webTitle, sectionName } } = newsSnippetArray[counter];
         let newsSnippetHTML = `
         <a class="snippet-item" data-newsIndex="${newsIndex}" data-newsArray="${newsArray}">${webTitle}, ${sectionName}
         <span class="snippet-button" style = "opacity: 0"> <button id="hyperlinkButton" href="${webUrl}" target="_blank">Link</button><button id="newsSnippetButtonAdd">add</button><button id="newsSnippetButtonRemove">remove</button></span></a>
         `;
         snippetContainerVisible.innerHTML = newsSnippetHTML;
         //adjust width to news snippet text content size
         let snippetWidth = (searchContainer.offsetWidth - 24) + `px`;
         snippetContainerVisible.setAttribute(`style`,`width:${snippetWidth}`); 
         let snippetItem = document.querySelector('.snippet-item')/* returns 1st snippet item instance. Ok since snippet items are being replaced: only one exist a time */
         snippetItem.setAttribute("data-animation", ""); // here snippetAnimation will be set
         counter++;
      }
      if(counter == newsSnippetArray.length && newsArrayDisplayedTimes < 3) { 
         newsArrayDisplayedTimes++; 
         counter = 0; 
      }
      if(counter == newsSnippetArray.length && newsArrayDisplayedTimes === 3) {
              setInterval( ()=> { 
                  // be sure to add IF statement for video playing so as to NOT fetch news if video is not playing
                  
                  return timesToQueueGetNews <= 0? '': getNews();
                  // snippetContainer.removeAttribute("data-visible")
                  //console.log(`remove data-transition to snippetItem`)
               }, 18000); 
               
      }
         
   }

}



let isMoving = true; //flag to detect when to pause news snippet and display add and remove button
snippetContainer.addEventListener('mouseup', ()=> isMoving = false );
snippetContainer.addEventListener('click', ()=> isMoving = false );
snippetContainer.addEventListener('mousedown', ()=> isMoving = false );
snippetContainer.addEventListener('mouseenter', ()=> isMoving = false );
snippetContainer.addEventListener('mouseover', ()=> isMoving = false );
snippetContainer.addEventListener('mouseleave', ()=> isMoving = true );
snippetContainer.addEventListener('mouseout', ()=> isMoving = true );


 
/*----news Container selection of add, remove or go to link -------*/

snippetContainer.addEventListener(`mouseover`, getSelection);
snippetContainer.addEventListener(`mouseenter`, getSelection);
snippetContainer.addEventListener('mouseleave', getSelection );
snippetContainer.addEventListener('mouseout',  getSelection );


//get nth-child index for  child element card-item to display news snippet counterpart 
function getCardNthChild(snippetNewsArray,snippetNewsIndex) { 
   let addArr = snippetNewsArray > 1? (snippetNewsArray -1) * 9: 0; 
   return (snippetNewsIndex + addArr);
   } 

function getSelection() {
   const snippetButton = document.querySelector(".snippet-button");
   const addButton = document.querySelector('#newsSnippetButtonAdd');
   const removeButton = document.querySelector('#newsSnippetButtonRemove');
   let snippetNewsArray = addButton.closest('.snippet-item').dataset.newsarray;
   let snippetNewsIndex = addButton.closest('.snippet-item').dataset.newsindex;
      
   if(isMoving === false) {
         snippetButton.setAttribute("style", "opacity: 1");
         //if add Button is clicked adds news snippet into NewsBox and removes from snippet news container
         addButton.addEventListener("click", ()=> {
         resultsContainer.setAttribute("style", "display: visible");
         let nthChildIs = getCardNthChild(parseInt(snippetNewsArray), parseInt(snippetNewsIndex));            
            let cardMatch = newsContainer.children[`${nthChildIs}`]
            cardMatch.classList.remove("invisible");
            let thisSnippetItem = document.querySelector('.snippet-item')
            thisSnippetItem.classList.add("invisible");
         })
         //if remove button is clicked it removes from snippet news container
         removeButton.addEventListener("click", ()=> {
            let thisSnippetItem = document.querySelector('.snippet-item')
            thisSnippetItem.classList.add("invisible");
         })
   }  else {
      snippetButton.setAttribute("style", "opacity: 0");
   }
}


/*-----Corrects possible duplicate news topics compares searchTopic1 to searchTopic2 after random topics are generated--------------------------*/
function checkTopic(searchTopic1, searchTopic2) {
   return (searchTopic1 === searchTopic2)? checkTopic(searchTopic1, searchTopic2 = getNewsTopic()): searchTopic2; //recursive: calls itself if value is same
}

//--returns a random news topic -------------
function getNewsTopic() {
    let searchTopic = Math.floor(Math.random() * 14)
        switch(searchTopic)   {
           case 0:
              return searchTopic = "music";
              break;
           case 1:                
              return searchTopic = "politics";
              break;
           case 2:
              return searchTopic = "business";
              break;
           case 3:
              return searchTopic = "sports";
              break;
           case 4:
              return searchTopic = "culture";
              break;
           case 5:
              return searchTopic = "music";
              break;
           case 6:
              return searchTopic = "science";
              break;
           case 7:
              return searchTopic = "big data";
              break;
           case 8:
              return searchTopic = "us news";
              break;
           case 9:
              return searchTopic = "world news";
              break;
           case 10:
              return searchTopic = "global development";
              break;
           case 11:
              return searchTopic = "tech";
              break;
           case 12:
              return searchTopic = "film";
              break;
           case 13:
              return searchTopic = "US sports";
              break;
           case 14:
            return searchTopic = "culture";
           }
    }  

  


//-----get width dynamically for news snippet container------------------------------------------------------------

window.addEventListener('resize', getSnippetWidth);
//window.addEventListener('load', getSnippetWidth);
//window.addEventListener('click', getSnippetWidth);

function getSnippetWidth() {
   let snippetWidth = (searchContainer.offsetWidth - 24) + `px`;
   snippetContainer.setAttribute(`style`,`width:${snippetWidth}`); 
}

 /*
Write a function that adjust video size responsively with the 16/9 ratio
width is good. height needs to be adjusted.

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
