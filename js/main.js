/**
 * Created by andriivandakurov on 10/31/13.
 */
(function(){
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  var skullArr  = Snap.selectAll('.skull'),
      skulDomElArr = document.querySelectorAll('.skull'),
      isChrome = window.chrome || navigator.userAgent.indexOf('Chrome') > -1,
      isSafari = navigator.userAgent.indexOf("Safari") > -1,
      Loop = function(target){
        var self = this;

        this.jawOpen = function(){
          target.animate({
            transform: "t-0,5r0"
          }, 500, function(){
            requestAnimFrame( self.jawClose );
          });
        };

        this.jawClose = function(){
          target.animate({
            transform: "t0,-15r0"
          }, 100, mina.elastic, function(){
            requestAnimFrame( self.jawOpen );
          });
        };

        this.rotateArrows = function(el){
          el.animate({
            transform: "t0,0r360"
          }, 10000, mina.elastic);
        };

        this.addMask = function(target, x, y, r){
          if(!isChrome && !isSafari){
            var maskRadial = target.circle(x, y, r);
            maskRadial.attr({fill:'#000'});
            target.attr({
              mask: maskRadial
            });
            maskRadial.attr({fill: "r()#652b21-#000"});
          }else{
            target.attr({ opacity: 0.2 });
          }
        };

        this.addBlur = function(target,wr){
          if(!isChrome && !isSafari){
            var f = target.filter(Snap.filter.blur(5, 10));
            wr.selectAll('.filtered').forEach(function(el,i){
              el.attr({ filter: f });
            });
          }else{
            target.attr({ opacity: 0.6 });
          }
        }

      };

  Snap.load("svg/skull.svg", function (f) {
    var skull = f.select('.skull-swg'),
        jawBottom,
        arrows,
        actions;

    skullArr.forEach(function(el,i){
      var skullClone = skull.clone();

      (function(el,skullClone){

        jawBottom = skullClone.select('.jaw-bottom');
        arrows = skullClone.selectAll('.eye');

        actions = new Loop(jawBottom);
        actions.jawOpen();

        el.append(skullClone);

        if(skulDomElArr[i].classList.contains('skull-bg-2')){
          actions.addMask(skullClone, 50, 50, 70);
        }

        if(skulDomElArr[i].classList.contains('skull-bg-1')){
          skullClone.attr({ opacity: 0.6 });
          actions.addBlur(skullClone, el);
        }

        arrows.forEach(function(el,i){
          actions.rotateArrows(el);
        });

      })(el,skullClone);
    });

  });
})();

