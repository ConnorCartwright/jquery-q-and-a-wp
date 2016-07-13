
function bindMultipleChoiceEvents() {
   'use strict';

   var $qaPlugin = $('.q-and-a-plugin');

   $qaPlugin
       .on('click', '.modal .js-mc-add-option', function() {
         require('./events/multiple-choice/add-option')();
      })

       .on('click', '.modal .js-mc-remove-option', function() {
         require('./events/multiple-choice/remove-option')();
      })

       .on('click', '.correct-answer', function() {
         require('./events/multiple-choice/make-option-correct')($(this));
      });
}

function bindCodeAreaEvents() {
   'use strict';

   var $qaPlugin = $('.q-and-a-plugin');

   $qaPlugin
       .on('click', '.modal .js-add-input-output', function() {
         require('./events/input-output/add-pair')();
      })

       .on('click', '.modal .js-remove-input-output', function() {
         require('./events/input-output/remove-pair')();
      })

       .on('click', '.modal .js-input-output-button', function() {
         require('./events/input-output/button-click')($(this));
      })

       .on('keyup', '.modal .js-io-input', function() {
         require('./events/input-output/save-input')($(this).val());
      })

       .on('keyup', '.modal .js-io-output', function() {
         require('./events/input-output/save-output')($(this).val());
      });

   // $('.q-and-a-plugin').on('click', '.q-preview>button', function() {
   //     var row = $(this).closest('.questions')
   //     questionPreviewButtonClick(row.data('p-id'), row.data('p-title'))
   // })
}

function bindEvents() {
   'use strict';

   bindMultipleChoiceEvents();
   bindCodeAreaEvents();
}

module.exports = bindEvents;
