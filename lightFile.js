'use strict';

var lightFile = (function() {

  if ( !document.addEventListener ) {
    return function() {};
  }

  return function(file) {

    var selector = file.selector || 'input[type="file"]',
        customClass = file.customClass || 'lightFile',
        buttonText = file.buttonText || 'Выбрать файл',
        deleteText = file.deleteText || 'Удалить',
        targets = document.querySelectorAll(selector),
        template, templateLists, targetsHeight, targetsClasses, targetsItems;

    for (var i = 0, ilen = targets.length; i < ilen; i += 1) {

      targets[i].className += ' ' + customClass + '__hidden';

      template = createTemplate(targets[i].cloneNode(true));

      template.querySelector('.' + customClass + '__hidden').addEventListener('change', changeState, false);
      template.querySelector('.' + customClass + '__delete').addEventListener('click', deleteChosen, false);
      targets[i].parentNode.replaceChild(template, targets[i]);
    }


    function createTemplate(elem) {
      
      var template = document.createElement('div'),
          markup = '<label class="' + customClass + '__in"> \
          <span class="' + customClass + '__button">'+ buttonText +'</span>\
          <p class="' + customClass + '__text"></p>\
          </label>\
          <span class="' + customClass + '__delete">'+ deleteText +'</span>';
      template.className += customClass + ' ';
      template.insertAdjacentHTML("beforeEnd", markup);
      template.querySelector('.' + customClass + '__in').appendChild(elem);
      return template;
    }

    function changeState(event) {
      var target = event.target,
          parent = findParent(target),
          targetValue = target.value;

      if (targetValue.indexOf('C:\\fakepath\\') >= 0) {
        targetValue = targetValue.slice(12);
      }
      target.parentNode.querySelector('.' + customClass + '__text').innerHTML = targetValue;

      if (targetValue.length > 0) {
        if (parent.className.indexOf(customClass + '_chosen') >= 0) return;
        parent.className += customClass + '_chosen';
      } else {
        parent.className = parent.className.replace(new RegExp(' ' + customClass + '_chosen', 'g'), ' ');
      }
    }

    function deleteChosen(event) {
      var parent = event.target.parentNode,
          elem = parent.querySelector('.' + customClass + '__hidden'),
          clone = elem.cloneNode(true);

      parent.querySelector('.' + customClass + '__text').innerHTML = '';
      clone.value = '';
      clone.addEventListener('change', changeState, false);
      elem.parentNode.replaceChild(clone, elem);
      
      parent.className = parent.className.replace(new RegExp(' ' + customClass + '_chosen', 'g'), ' ');
    }

    function findParent(elem) {
      while ( elem.className.indexOf(customClass + ' ') < 0 ) {
        
        elem = elem.parentNode;
      }
      return elem;
    }
  }

}());