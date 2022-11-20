{
  ('use strict');

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
    articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
  };

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.authors.list',
    },
  };

  function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articlesSelector = clickedElement.getAttribute('href');
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articlesSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  }

  function generateTitleLinks(customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    /* [DONE] for each article */
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let html = '';
    for (let article of articles) {
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element, get the title from the title element */
      const articleTitle = article.querySelector(select.article.title).innerHTML;
      /* [DONE] create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);
      /* [DONE] insert link into titleList */
      html = html + linkHTML;
    }
    titleList.innerHTML = html;

    let links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  function calculateTagsParams(tags) {
    let params = {};
    params.max = 0;
    for (let tag in tags) {
      params.max = Math.max(params.max, tags[tag]);
      params.min = Math.min(params.max, tags[tag]);
    }
    return params;
  }

  function calculateTagClass(count, params) {
    return Math.floor(((count - params.min) / (params.max - params.min)) * opts.tagSizes.count + 1);
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object*/
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const articleTagsWrapper = article.querySelector(select.article.tags);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTMLData = { tag: tag };
        const linkHTML = templates.articleTagLink(linkHTMLData);
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add generated code to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      articleTagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);
    /* [NEW] add html from allTags to tagList */
    //tagList.innerHTML = allTags.join(' ');
    /* [NEW] create constant for max and min number of tags */
    const tagsParams = calculateTagsParams(allTags);
    /* [NEW] create variable for all links HTML code */
    const allTagsData = { tags: [] };
    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      let tagSize = calculateTagClass(allTags[tag], tagsParams);
      allTagsData.tags.push({
        tag: tag,
        className: calculateTagClass(allTags[tag], tagsParams),
      });
      /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTag of activeTagLinks) {
      /* remove class active */
      activeTag.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLink of allTagLinks) {
      /* add class active */
      tagLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active author link */
    for (let activeAuthor of activeAuthorLinks) {
      /* remove class active */
      activeAuthor.classList.remove('active');
      /* END LOOP: for each active author link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const allAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    for (let authorLink of allAuthorLinks) {
      /* add class active */
      authorLink.classList.add('active');
      /* END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function generateAuthors() {
    /* [NEW] create a new variable allAuthors with an empty object*/
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find author name wrapper */
      const articleAuthorWrapper = article.querySelector(select.article.author);
      /* get author name from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');
      /* generate HTML of the link */
      const linkHTMLData = { author: articleAuthor };
      const linkHTML = templates.articleAuthorLink(linkHTMLData);
      /* insert HTML of all the links into the authors wrapper */
      articleAuthorWrapper.innerHTML = linkHTML;
      if (!allAuthors[articleAuthor]) {
        /* [NEW] add generated code to allAuthors object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
      /* END LOOP: for every article: */
    }
    const authorsList = document.querySelector(select.listOf.authors);
    /* [NEW] create variable for all links HTML code */
    //let allAuthorsHTML = '';
    const allAuthorsData = { authors: [] };
    /* [NEW] START LOOP: for each author in allAuthors: */
    for (let author in allAuthors) {
      /* [NEW] generate code of a link and add it to allAuthorsHTML */
      allAuthorsData.authors.push({
        author: author,
        articles: allAuthors[author],
      });
      /* [NEW] END LOOP: for each author in allAuthors: */
    }
    /*[NEW] add HTML from allAuthorsHTML to authorsList */
    authorsList.innerHTML = templates.authorsListLink(allAuthorsData);
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const allTagLinks = document.querySelectorAll(select.all.linksTo.tags);
    /* START LOOP: for each link */
    for (let tagLink of allTagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }

  function addClickListenersToAuthors() {
    /* find all links to authors */
    const allAuthorLinks = document.querySelectorAll(select.all.linksTo.authors);
    /* START LOOP: for each link */
    for (let authorLink of allAuthorLinks) {
      /* add authorClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
      /* END LOOP: for each link */
    }
  }

  generateTags();

  addClickListenersToTags();

  generateAuthors();

  addClickListenersToAuthors();

  generateTitleLinks();
}
