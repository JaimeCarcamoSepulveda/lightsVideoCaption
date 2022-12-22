
/* navigation script */

const toggleNav = document.querySelector("header .nav-toggle");
const navMenu = document.querySelector(".nav_list ul");
const navItems = document.querySelectorAll(".nav-items");
const navLinks = document.querySelectorAll(".nav_links");

toggleNav.addEventListener("click", getMenuToggle)

function getMenuToggle() {
   toggleNav.classList.toggle("clicked");
   navMenu.classList.toggle("clicked");
   navItems.classList.toggle("clicked");
}

navLinks.forEach(link => {
   link.addEventListener("click", ()=> {
      return getMenuToggle();
      

   })
})
