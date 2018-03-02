var body = document.querySelector('body')
var main = document.querySelector('#main')
var html = document.querySelector('html')
var scrollBounds = document.querySelector('#scrollBounds')
var header = document.querySelector('header')
var title = document.querySelector('header h1')
var footer = document.querySelector('footer')
var overlay = document.querySelector('#overlay')

title.defaultSize = window.getComputedStyle(title).fontSize;

var sections = []
sections.push(document.querySelector('#banner'))
sections.push(document.querySelector('#services'))
sections.push(document.querySelector('#testimonials'))
sections.push(document.querySelector('#benefits'))
sections.push(document.querySelector('#team'))

var freeScroll = document.querySelector("#freeScroll")
var scrollTarget = document.querySelector("#scrollTarget")

var current = 0;               //current div index;
var target = 0;                //target div index 
var waitForEnable = false;    //the delay period after the animation is done
var allowScroll = true        //just the overall allowance of scrolling
var targetHeight = 0;         //the 

window.onload = init

var scrollBar = (function(){
  var bar = 0;
  var element;
  var container;

  function adjustBarRatio(newHeight){
    if (!newHeight){
      newHeight = 0;
    }
    var scaleHeight = scrollArea.getCurHeight();
    if(scaleHeight<1){
      scaleHeight = 1;
    }
    var barHeight = scrollArea.getTotalHeight()/newHeight;
    element.style.height = ((scaleHeight/scrollArea.getTotalHeight()) * 100) + '%'
  }

  function initialize(){
    element = document.querySelector('#scrollBar');
    container = document.querySelector('#scrollBounds');
    element.classList.remove("invis")
    container.style.marginLeft = 15 + "px";
    header.style.top = 0 + 'px';
    adjustBarRatio();
  }

  return{
    init : function(){
      initialize();
    }, 

    resize : function(height){
      adjustBarRatio(height);
    }
  };
})(); 

window.onresize = function(){
  scrollBar.resize(window.innerHeight);

  if(current <= sections.length){
    //this might not even be necessary
    // window.scrollTo(0, sections[current].offsetTop);
    // allowScroll = false
  }  

  // if(window.innerHeight < 640){
  //   shrinkHeader();
  // } else {
  //   growHeader();
  // }
}

var headerArea = (function(){

  function shrinkHeader(){
    header.classList.add('mini')
    header.classList.add('darkHalfOpac')
    footer.classList.add('darkHalfOpac')
    title.style.fontSize = 30 + 'px';
  }

  function growHeader(){
    header.classList.remove('mini')
    header.classList.remove('darkHalfOpac')
    footer.classList.remove('darkHalfOpac')
    title.style.fontSize = title.defaultSize
  }

  return {
    grow : function(){
      growHeader();
    },
    shrink: function(){
      shrinkHeader();
    }
  }
})();

var scrollArea = (function(){
  var timesScrolled = 0;
  var oldScrollPos;
  var scrollOffset = 0;
  var realScrollPos;
  var curHeight = 0;
  var direction = 0;
  var lastDirection = 0;
  var totalHeight = 490;

    
  function LerpPosition(from, to, frac) {
    var a;
    a = from + (frac) * (to - from);
    return a;
  }

  function getPrevSection(){
    var prev = current - 1;
    if(prev < 0){
      prev = 0;
    }
    return prev
  }

  function getNextSection(){ 
    var next = current + 1;
    if(next > sections.length - 1){
      next = sections.length - 1
    }
    return next;
  }

  function enableScroll(){ waitForEnable = false; allowScroll = true;}

  function stopScrolling(delay){ 
    main.style.overflow = "scroll"
    main.scrollTop = lockScroll;
    clearInterval(id); 
    current = target;
    waitForEnable = true;
    if(delay > 0 ){
      setTimeout(function(){ enableScroll() }, delay);
    } else {
      enableScroll()
    }
  }

  function getTargetHeight(){
    return targetHeight + 1 * direction
  }

  function scrollBody(frac, delay){

    if(curHeight > 50){ 
      headerArea.shrink();
    } else {
      headerArea.grow();
    } 
    // console.log(main.scrollTop)

    // main.style.overflow = "scroll"
    if(current > 0){
      main.style.overflow = 'hidden'
    // console.log(main.scrollTop)
    } else {
    }

    currentSideBar = sections[current].children[0]
    targetSideBar =   sections[target].children[0]

    if( targetSideBar ){
      if(direction == 1){
        if(currentSideBar){
          currentSideBar.classList.add('above')
        }
        if(targetSideBar.classList.contains('beneath')){
          targetSideBar.classList.remove('beneath')
        } else {
        }
      } else if( direction == -1){
        if(currentSideBar){
          currentSideBar.classList.add('beneath')
        }

        if(targetSideBar.classList.contains('above')){
          targetSideBar.classList.remove('above')
        }
      }
    } else if (currentSideBar){
      if(direction == 1){
        currentSideBar.classList.add('above')
      } else if( direction == -1){
        currentSideBar.classList.add('beneath')
      }
    } else {
      // console.log("Error")
    }

    if( (curHeight*direction ) >= ((targetHeight - (.05 * direction )) * direction) ){
      stopScrolling(delay)
      curHeight = targetHeight;

    } else {
      curHeight = LerpPosition( curHeight, getTargetHeight(), frac)
      scrollTarget.style.top = -curHeight + 'vh'
    } 

    scrollBar.resize(window.innerHeight);

    lastDirection = direction;
  }

  function startScrolling(frac, pause, delay){
    lockScroll = main.scrollTop;
    if(pause){
      allowScroll = false
    }

    id = setInterval(function(){scrollBody(frac, delay)}, .25);
  } 

  function adjustPosition(){
    var id;
    var mainLength = main.children.length-1
    var screenHeight = document.body.scrollHeight;
    var pageHeight = screenHeight * 8;
    var scrollPos = main.scrollTop;
    var curFrameOffset = 0;
    var lockScroll = 0; 

    timesScrolled++;

    if(allowScroll) {
          //make an infinitely scrolling div, then use a manaual scroll position to check if it's up or down
      if(scrollPos < screenHeight * 2){
        main.insertBefore(main.children[mainLength], main.children[0])
      }

      if(scrollPos > pageHeight - (screenHeight * 2)){
        main.appendChild(main.children[0])
      }

      //curFrameOffset is used to figure out if there's an offset that frame
      curFrameOffset = scrollPos - main.scrollTop;

      scrollOffset += curFrameOffset;
     
      realScrollPos = main.scrollTop + scrollOffset


      // console.log(main.scrollTop)
      if( oldScrollPos > realScrollPos){
        direction = -1;
      } else if ( oldScrollPos < realScrollPos ) {
        direction = 1;
      } else {
        // console.log("no direction")
        direction = 0;
      }


      if( realScrollPos >= Number.MAX_SAFE_INTEGER){
        //what are you even doing
      } else if ( realScrollPos <= Number.MIN_SAFE_INTEGER ){
        //wow
      } else {
      }

      // console.log(oldScrollPos + " " + realScrollPos + " " + direction)
      oldScrollPos = realScrollPos;


      if(waitForEnable){
        return;
      }

      if( curHeight < 1 ){
        curHeight = 1;
      }

      if( curHeight >= totalHeight ){
        curHeight = totalHeight;
      }

      if( ( targetHeight >= 0 && direction == 1 && targetHeight < totalHeight) || 
        ( targetHeight <= totalHeight && direction == -1 ) ){
        if(curHeight >= 400 /*|| 
          curHeight <= 10*/){
          targetHeight = curHeight + 2 * direction
          if(targetHeight<0){
            targetHeight = 0;
          }

          startScrolling(.25, true, 0);

          if(curHeight >= 400){
            footer.classList.add('fixedFooter')
          }
        } else {
          // stopScrolling(0)

          if(direction == 1){
            target = getNextSection()
          } else if (direction == -1){
            target = getPrevSection()
          } else {
            direction = lastDirection;
          }

          if(target >= 1){
            overlay.style.opacity = .75;
          } else {
            overlay.style.opacity = 0;
          }

          if (target == 4){
            team.classList.remove('normalSize')
          } else {
            team.classList.add('normalSize')
          }


          targetHeight = (target * 100)

          if(target<sections.length && (target >= 0 && target <=4 ) ){ //hide footer if not in freescroll
            startScrolling(.05, true, 400);
            if(footer.classList.contains('fixedFooter')){
              footer.classList.remove('fixedFooter')
            }
          }
        }
      }
    }
  }   

  return{
    init : function(){
      main.onscroll = function(){
       scrollArea.scroll();
      }
    },
    scroll: function(){
      adjustPosition();
    },
    getTotalHeight(){
      return totalHeight;
    },
    getCurHeight(){
      return curHeight;
    }
  };
})();

function init(){
  scrollArea.init(); 
  scrollBar.init(); 
  main.focus();
}