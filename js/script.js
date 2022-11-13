{
  ("use strict");
  /*document.getElementById("test-button").addEventListener("click", function () {
    const links = document.querySelectorAll(".titles a");
    console.log("links:", links);
  });*/

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log("clickedElement (with plus): ", clickedElement);

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(".titles a.active");
    for (let activeLink of activeLinks) {
      activeLink.classList.remove("active");
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add("active");
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll(".posts article.active");
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove("active");
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute("href");
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log("articleSelector (with plus): ", articleSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add("active");
    console.log("targetArticle (with plus): ", targetArticle);
  };

  const generateTitleLinks = function () {
    function clearLinks() {
      document.getElementById("LinkList").innerHTML = "";
    }
    clearLinks();
    console.log("generateTitleLinksworks");
    const allArticles = document.querySelectorAll(".posts article");

    for (let Article of allArticles) {
      const articleId = Article.getAttribute("id");
      const articleTitle = Article.querySelector("h3.post-title").innerHTML;
      const linkHTML = '<a href="#' + articleId + '"><span>' + articleTitle + "</span></a>";
      let li = document.createElement("li");
      li.innerHTML = linkHTML;
      document.getElementById("LinkList").appendChild(li);
    }
  };

  generateTitleLinks();
  const links = document.querySelectorAll(".titles a");

  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }

  /*function printMessage(msg){
    let div = document.createElement('div');
    div.innerHTML = msg;
    document.getElementById('messages').appendChild(div);
  }*/
}
