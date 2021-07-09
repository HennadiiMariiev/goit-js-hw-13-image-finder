window.onscroll = function () {
    if (pageYOffset >= 200) {
        document.querySelector('#backToTop').style.opacity = "1";
    } else {
 document.querySelector('#backToTop').style.opacity = "0";
    }
};

document.querySelector('#backToTop').onclick = function()
{
        window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
}