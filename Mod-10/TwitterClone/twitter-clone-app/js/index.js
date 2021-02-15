const URL = "http://localhost:3100/tweets";
let nextPageUrl = null;

const onEnter = (e) => {
    console.log(e);
    if(e.keyCode === 13) getTwitterData()
}

const tweetTrendingUl = document.querySelector('.tweets-trending ul');
let trendListItems = tweetTrendingUl.querySelectorAll('li');

trendListItems.forEach( item => {
    item.setAttribute('onclick','selectTrend(event)');
});

const onNextPage = () => {
    if(nextPageUrl) getTwitterData(true)
};

/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPage = false) => {
    console.log('fetching..');
    const inputField = document.getElementById('user-search-input');
    let query = inputField.value;
    let encodedQuery = encodeURIComponent(query); 
    let fullUrl = `${URL}?count=10&q=${encodedQuery}`;
    if(!query) return;
    if(nextPage) fullUrl = nextPageUrl;
    fetch(fullUrl)
    .then( response => response.json() )
    .then( data => {
        buildTweets(data.statuses,nextPage) 
        saveNextPage(data.search_metadata)
        nextPageButtonVisibility(data.search_metadata)
    })
}

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    if(metadata.next_results) nextPageUrl = `${URL}${metadata.next_results}`;
    else nextPageUrl = null;
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    const innerText = e.target.innerText;
    document.getElementById('user-search-input').value = innerText;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
    if(metadata.next_results)
        document.getElementById('nextPageButton').style.visibility = 'visible';
    else
    document.getElementById('nextPageButton').style.visibility = 'hidden';
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    console.log(tweets);
    let htmlList= tweets.map( tweet => {
        return `<div class="tweet-container">
        <div class="tweet-user-info">
            <div class="tweet-user-profile" style="background-image:url(${tweet.user.profile_image_url_https})"></div>
            <div class="tweet-user-name-container">
                <div class="tweet-user-fullname">${tweet.user.name}</div>
                <div class="tweet-user-username">@${tweet.user.screen_name}</div>
            </div>
        </div>
        ${ tweet.extended_entities ? buildImages(tweet.extended_entities.media) : buildImages(tweet.entities.media)}
        <div class="tweet-text-container">${tweet.full_text}</div>
        <div class="tweet-date-container">${moment(new Date(tweet.created_at)).fromNow()}</div>
    </div>`
    });

    const tweetList = document.querySelector('.tweets-list');
    if(nextPage){
        tweetList.insertAdjacentHTML('beforeend', htmlList.join(''));
    }
    else
        tweetList.innerHTML = htmlList.join('');
}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
    if(!mediaList) return '';
    return `<div class="tweet-images-container">
                ${mediaList.map( imageData =>{
                    switch(imageData.type){
                        case 'photo': return`<div class="tweet-image" style="background-image:url('${imageData.media_url}')"></div>`;
                        case 'video': return`<video controls>
                            ${imageData.video_info.variants.map( videoSource =>{
                                return `<source src="${videoSource.url}" type="${videoSource.content_type}">`
                            })}
                        </video>`;
                        case 'animated_gif': return`<video autoplay="autoplay" loop="loop">
                            ${imageData.video_info.variants.map( videoSource =>{
                                return `<source src="${videoSource.url}" type="${videoSource.content_type}">`
                            })}
                            <img src="${imageData.media_url}">
                        </video>`;
                    }
                    return '';
                })}
            </div>`
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {

    if(!mediaList) return '';
    return `<div class="tweet-video-container">
                ${mediaList.map( imageData =>{
                    switch(imageData.type){
                        case 'video': return`<video controls>
                            ${imageData.video_info.variants.map( videoSource =>{
                                return `<source src="${videoSource.url}" type="${videoSource.content_type}">`
                            })}
                        </video>`;
                        case 'animated_gif': return`<video autoplay="autoplay" loop="loop">
                            ${imageData.video_info.variants.map( videoSource =>{
                                return `<source src="${videoSource.url}" type="${videoSource.content_type}">`
                            })}
                            <img src="${imageData.media_url}">
                        </video>`;
                    }
                    return '';
                })}
            </div>`
}
