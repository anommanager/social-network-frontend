# SocialSphere

## Project Title & Topic

**Topic:** - Social Media
**SocialSphere** — A responsive social media platform layout designed for sharing moments, exploring global trends, and connecting with peers.

## Group Information

* **Group:** SE-2539
* **Team Members:**
* Aidar Murat
* Ilya Koval
* Aldiyar Kairolin

## Description

SocialSphere is a multi-page web platform created for a frontend social network interface. The site allows users to browse feed posts, explore popular hashtags and topic rankings, interact with user profile pages, and customize account settings. Interface adapts smoothly across mobile, tablet, and desktop viewports.

# Project Structure

social-network-frontend/
│
├── index.html
├── platforms.html
├── trends.html
├── history.html
├── contact.html
│
├── css/
│   └── style.css
│
├── images/
    |── footer/
    |   |── image.png
    |   |── images.png
    |   |── linkedin-svgrepo-com.svg
│   ├── avatars/
│   │   ├── alex.jpg
│   │   ├── mia.jpg
│   │   └── daniel.jpg
│   │
│   └── posts/
│       ├── post1.jpg
│       ├── post2.jpg
│       └── post3.jpg
│
└── README.md

## Features Implemented

* **Responsive Header & Navigation:** Sticky header with a logo and Flexbox-powered navigation bar integrated with Bootstrap's responsive collapse menu.


* **Feed & Posts System:** Layout displaying user posts, interaction bars (likes, comments, share), image lazy-loading, text-only gradient cards, and nested comment sections.


* **Trends & Rankings Table:** Dedicated trends page featuring topic cards, category grids, and a styled HTML data table highlighting post volume and engagement rates.


* **User Profile View:** Profile header with cover/avatar media, friend statistics, navigation tabs, quick bio details, and photo gallery grids.


* **Interactive Settings Dashboard:** Multi-tab settings interface with form inputs, selection menus, custom toggle switches, interactive Bootstrap modals (Danger Zone), and save toast notifications.


* **Footer Section:** Semantic footer featuring contact information, direct external links, and social icon badges.



## Technologies Used

* **HTML5:** Semantic structural elements (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`, forms, and tables).


* **CSS3:** Flexbox, CSS Grid layout, CSS Variables (`:root`), `:hover`/`:focus` pseudo-classes, `:nth-child` styling, and media queries for responsiveness.


* **Bootstrap 5 (v5.3.3):** Grid system, utility classes, navigation toggle, tab panels, and modal components.


* **Google Fonts:** Integrated Inter font family.



## Individual Contributions

* **Aidar Murat:**
* Developed `settings.html` and `settings.css` (Settings dashboard, tabbed forms, form controls, switches, danger zone modal, save toast).
* Written and formatted `README.md` documentation.

* **Ilya Koval:**
* Developed `profile.html` and `profile.css` (Profile banner, identity section, profile tabs, sidebars, and photo grids).
* Developed `posts.html` and `posts.css` (Feed layout, compose post card, post actions, sidebars, and comment UI).

* **Aldiyar Kairolin:**
* Developed global `style.css` (Root variables, typography, navigation, shared layout, base buttons, and footer styling).
* Developed `index.html` (Landing hero section and featured posts grid).
* Developed `trends.html` (Trending cards grid, category layout, and trend rankings table).

## Published Website

* **Live Demo:** [SocialSphere on GitHub Pages]()
* **GitHub Repository:** [https://github.com/anommanager/social-network-frontend.git](https://github.com/anommanager/social-network-frontend.git)
