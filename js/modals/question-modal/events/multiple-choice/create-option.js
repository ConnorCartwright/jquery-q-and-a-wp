
function createMultipleChoiceOption() {
   'use strict';

   console.log('in create mc option');

   var $templates = $('.qa-templates');
   var newOption = $('.modal .mc-text-option').length + 1;

   var input = '<input type="text" class="form-control wrong" placeholder="Option ' +
       newOption + ' Text">';

   var $option = $templates.find('.js-modal-question-mc .js-mc-options')
       .clone()
       .children();

   $option.find('.js-option').prepend(input);

   console.log('single create option:');
   console.log($option);

   return $option;
}

module.exports = createMultipleChoiceOption;