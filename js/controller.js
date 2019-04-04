"use strict";
/* jshint esversion: 8 */
/* jshint browser:true */
/* jshint node:true */

// Define the Model Objects
var myNewsCards = new NewsCardList([]);
var myNewsView = new NewsView(myNewsCards);

// Define the sources
const leftArray = ["al-jazeera-english", "msnbc", "daily-mail", "newsweek", "the-new-york-times", "bbc-news","the-washington-post"];
const centerArray = ["abc-news", "cnn", "cbs-news", "associated-press","reuters", "indepedent", "the-wall-street-journal"];
const rightArray = ["the-american-conservative", "fox-news","national-review", "breitbart-news"];

//
//  Task Flow Functions
//

async function clickSearchButton() {
    
    let searchField = document.querySelector("#search-field");
    if (!searchField.checkValidity()) {
        // Validator Failed
        console.log("No Input");
    }
    else {
        // Validator Passed
        console.log("search for "+searchField.value);
        populateCardList(searchField.value);
    }
}

async function populateCardList(searchField) {

    // call the news API for news articles and populate into NewsCardList
    let leanings = [];
    
    // Process the Left Leaning Articles
    let left = leftArray.slice(0);
    let leftResponses = [];
    for (let i=0; i<3 ; i++){
        leftResponses.push(getNews(searchField,chooseSource(left)));
    }
    let leftArticles = await Promise.all(leftResponses);

    console.log("left articles:", leftArticles);

    // Process the center leaning Articles
    let center = centerArray.slice(0);
    let centerResponses = [];
    for (let i=0; i<3 ; i++){
        centerResponses.push(getNews(searchField,chooseSource(center)));
    } 
    let centerArticles = await Promise.all(centerResponses);

    // Process the right leaning articles
    let right = centerArray.slice(0);
    let rightResponses = [];
    for (let i=0; i<3 ; i++){
        rightResponses.push(getNews(searchField,chooseSource(right)));
    } 
    let rightArticles = await Promise.all(rightResponses);

    // Push al the articles to the list of leanings
    leanings.push(leftArticles);
    leanings.push(centerArticles);
    leanings.push(rightArticles);


    // Add all the articles to the cardlist
    for (let currentLeaning = 0; currentLeaning < 3; ++currentLeaning){
        for (let indexOfArticle = 0 ; indexOfArticle < leanings[currentLeaning].length; ++indexOfArticle){
            let currentArticle = leanings[currentLeaning][indexOfArticle].articles[0];
            
            // Get card elements from json
            let source = currentArticle.source.name;
            let title = currentArticle.title;
            let text = getSummary(currentArticle.content);
            let tone = getTone(title);

            let aNewsCard = new NewsCard(source, title, text, tone, currentLeaning);

            myNewsCards.push(aNewsCard);
        }
    }

    // Update the view
    myNewsView.update();

}

// Picks a random source from the array of sources
function chooseSource(arrayOfSources) {
    let sourceIndex = Math.floor(Math.random() * arrayOfSources.length);
    let pickedSource = arrayOfSources[sourceIndex];
    arrayOfSources.splice(sourceIndex, 1);
    return pickedSource;
}

//
// API Getter Functions
//

async function getNews(query, source) {
    //    
    // The getNews function calls the News API and gets a list of
    // news titles and content from the news sources in newsSourceMap.
    //

    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + query + '&' +
        'sources=' + source + '&' +
        'pageSize=1' + '&' +
        'apiKey=bbd60ca606f641e094d9440de45c1940';

        return fetch(url)
        .then(response => response.json())
        .catch(error => console.log(error));

}

async function getTone(headline) {
    //
    // The getTone function calls the IBM sentiment analysis API
    // for the title of each news article on the list of the NewsCardList.
    // Then it assigns a set of RGB values for each of the items on the list.
    //

    return "";
}

async function getSummary(content) {

    // Uses the summary API to get a short summary of the news article
    // If the news article summary is not available, then it gives a short
    // summary of the page itself

    return "";
}