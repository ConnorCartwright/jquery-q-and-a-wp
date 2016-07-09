$(function() {
   'use strict';

   function hintButtonClick($button) {
      if (!$button.hasClass('js-active')) {
         var $activeButton = $('.modal .js-hint.js-hint-active');
         var $hintsTextarea = $('.modal .js-hints-textarea');

         $activeButton
             .data('hint-text', $hintsTextarea.val())
             .removeClass('js-hint-active')
             .find('span')
             .text($activeButton.data('hint'));

         $hintsTextarea
            .val($button.data('hint-text'))
            .attr('placeholder', 'Hint ' + $button.data('hint'));

         $button
             .addClass('js-hint-active')
             .find('span')
             .text('Hint ' + $button.data('hint'));

         $hintsTextarea.focus();
      }
   }

   function createHints() {
      var $templates = $('.qa-templates');
      var hints = $templates.find('.js-modal-question .js-hints')
          .clone()
          .children();

      $('.modal').on('keyup', '.js-hints-textarea', function() {
         $('.hint.active').data('hint-text', $(this).val());
      });

      $('.modal').on('click', '.js-hint', function() {
         hintButtonClick($(this));
      });

      return hints;
   }

   function createMultipleChoiceOptions(n) {
      var $options = $('');
      var $templates = $('.qa-templates');

      var numOptions = $('.modal .mc-text-option').length;

      for(var i = 0; i < n; i++) {
         numOptions++;
         var input = '<input type="text" class="form-control wrong" id="q-mc-option-' + i + '" placeholder="Option ' +
             numOptions + ' Text">';

         var $option = $templates.find('.js-modal-question-mc .js-mc-options')
             .clone()
             .children();

         $option.find('.js-option').prepend(input);

         $options = $options.add($option);
      }

      return $options;
   }

   function createMultipleChoiceArea() {
      $('.js-question-type-area').attr('class', 'js-question-type-area multiple-choice');

      var $optionControl = $('.qa-templates .js-modal-question-mc .js-mc-add-remove')
          .clone()
          .children();

      return $optionControl.add(createMultipleChoiceOptions(4));
   }

   function correctButtonClick(button) {
      var input = button.closest('.input-group').find('input');

      if (input.hasClass('wrong')) {
         input.removeClass('wrong').addClass('correct');
         button.addClass('btn-success').removeClass('btn-default');
      } else {
         input.removeClass('correct').addClass('wrong');
         button.removeClass('btn-success').addClass('btn-default');
      }
   }

   function bindMultipleChoiceEvents() {
      var $qaPlugin = $('#q-and-a-plugin');

      $qaPlugin
         .on('click', '.modal .js-mc-add-option', function() {
            $('.modal .js-mc-text-option').last().after(createMultipleChoiceOptions(1));
         })

         .on('click', '.modal .js-mc-remove-option', function() {
            if ($('.modal .js-mc-text-option').length > 2) {
               $('.modal .js-mc-text-option').last().remove();
            }
         })

         .on('click', '.correct-answer', function() {
            correctButtonClick($(this));
         });
   }

   function createCodeArea() {
      var $templates = $('.qa-templates');
      var $editor = $('<div id="editor" class="code-editor mc-code">// Enter your code here</div>');

      $('.js-question-type-area').attr('class', 'js-question-type-area coding');

      var $io = $templates.find('.js-modal-question-code .js-io')
          .clone()
          .children();

      return $editor.add($io);
   }

   function inputOutputButtonClick($button) {
      if (!$button.hasClass('active')) {
         var $activeButton = $('.modal .js-io-active');
         var $inputOutputTextarea = $('.modal .js-io-input');
         var $output = $('.modal .js-io-output');

         $activeButton
             .data('input', $inputOutputTextarea.val())
             .data('output', $output.val())
             .removeClass('js-io-active')
             .find('span')
             .text($activeButton.data('io'));

         $inputOutputTextarea
             .val($button.data('input'))
             .attr('placeholder', 'Question Input ' + $button.data('io'));
         $output
             .val($button.data('output'))
             .attr('placeholder', 'Expected Output ' + $button.data('io'));

         $button
             .addClass('js-io-active')
             .find('span')
             .text('IO ' + $button.data('io'));

         $inputOutputTextarea.focus();
      }
   }

   function bindCodeAreaEvents() {
      var $qaPlugin = $('#q-and-a-plugin');

      $qaPlugin
         .on('click', '.modal .js-remove-io', function() {
            var $io = $('.modal .js-io-btn');

            if ($io.length > 3) {
               $io.last().remove();
            }
         })

         .on('click', '.modal .js-add-io', function() {
            var $inputOutputButtons = $('.modal .js-io-btn');
            var ioLength = $inputOutputButtons.length;

            if (ioLength < 8) {
               var count = ioLength + 1;
               var newIo = '<button type="button" class="btn btn-default js-io-btn" data-io="' + count + '">' +
                   '<span>' + count + '</span></button>';

               $inputOutputButtons
                  .last()
                  .after(newIo);
            }
         })

         .on('click', '.modal .js-io-btn', function() {
            inputOutputButtonClick($(this));
         })

         .on('keyup', '.modal .js-io-input', function() {
            $('.io.active').data('input', $(this).val());
         })

         .on('keyup', '.modal .js-io-output', function() {
            $('.io.active').data('output', $(this).val());
         });
   }

   function questionTypeChange(type) {
      $('.modal *').removeClass('error');

      switch(type) {
         case 'Multiple Choice':
            return createMultipleChoiceArea();
         default:
            return createCodeArea();
      }
   }

   function createQuestionForm() {
      var $templates = $('.qa-templates');

      var $questionForm = $templates
          .find('.js-modal-question .js-form')
           .clone()
           .children();

      var $typeSelect = $questionForm.find('#q-type-select');
      var $questionTypeArea = $questionForm.find('.js-question-type-area');

      $questionTypeArea.html(questionTypeChange($typeSelect.find('option:selected').text()));

      $typeSelect.on('change', function() {
         var type = $typeSelect.find('option:selected').text();

         if (type === 'Multiple Choice') {
            $questionTypeArea.html(questionTypeChange(type));
         } else if (!$('.js-question-type-area.coding').length) {
            $questionTypeArea.html(questionTypeChange(type));
            var editor = ace.edit('editor');

            editor.setTheme('ace/theme/monokai');
            editor.getSession().setMode('ace/mode/javascript');
         }
      });

      $questionForm.append(createHints());

      return $questionForm;
   }

   function addQuestionButtonClick(pageId) {
      var $modal = $('.modal');

      $modal
          .data('p-id', pageId)
          .addClass('question')
          .find('.modal-header h1')
            .text('Add Question')
            .end()
          .find('.modal-footer .btn-success')
            .addClass('js-create-question')
            .removeClass('js-edit-question')
            .text('Create');

      var $modalBody = $modal.find('.modal-body');

      $modalBody
          .empty()
          .html(createQuestionForm());

      $modal
          .fadeIn(600);
      $('body').css('overflow', 'hidden');
      resizeModalBody();
   }

   function editQuestionButtonClick(pageId) { // Needs question id
      $('.modal')
          .data('p-id', pageId)
          .addClass('question')
          .find('.modal-footer .btn-success')
          .addClass('edit-question')
          .removeClass('create-question');
   }

   function setupModal() {
      var $qaPlugin = $('#q-and-a-plugin');

      $qaPlugin
         .on('click', '.js-q-add>button', function() {
            addQuestionButtonClick($(this).closest('.questions').data('p-id'));
         })

         .on('click', '.js-q-edit>button', function() {
            editQuestionButtonClick($(this).closest('.questions').data('p-id'));
         });

      // $('#q-and-a-plugin').on('click', '.q-preview>button', function() {
      //     var row = $(this).closest('.questions');
      //     questionPreviewButtonClick(row.data('p-id'), row.data('p-title'));
      // });

      bindMultipleChoiceEvents();
      bindCodeAreaEvents();
   }

   setupModal();

   function validateMultipleChoice() {
      if (!$('.modal .mc-text-option .form-control.wrong').length) {
         $('.modal .mc-option-change').after('<span class="error-text">There must be at least one <em>wrong</em> answer!</span>');

         return false;
      } else if ($('.modal .mc-text-option .form-control.wrong').length === $('.modal .mc-text-option').length) {
         $('.modal .mc-option-change').after('<span class="error-text">There must be at least one <em>correct</em> answer!</span>');

         return false;
      } else {
         // Loop through each of the fields, each
         return true;
      }
   }

   function validateCodeArea() {
      // Var $questionCode;
      var passed = true;

      // $questionCode = ace.edit('editor').getValue(); deal with later, length?

      $('.io').each(function() {
         if (!$(this).data('input') || !$(this).data('output')) {
            $(this).addClass('error');

            if (passed) {
               passed = false;
            }
         }
      });

      return passed;
   }

   function validateHints() {
      var passed = true;

      $('.modal .hint').each(function() {
         if ($(this).data('hint-text')) {
            if ($(this).data('hint-text').length < 20) {
               $(this).addClass('error');

               if (passed) {
                  passed = false;
               }
            }
         } else {
            $(this).addClass('error');

            if (passed) {
               passed = false;
            }
         }
      });

      return passed;
   }

   function validateQuestionForm() {
      $('.modal *').removeClass('error');
      $('.modal .error-text').remove();

      var passed = true;

      var $questionName = $('.modal #q-name-input');

      if ($questionName.val().length < 10) {
         $questionName.addClass('error');
         passed = false;
      }

      var $questionStatement = $('.modal #q-statement-input');

      if ($questionStatement.val().length < 50) {
         $questionStatement.addClass('error');
         passed = false;
      }

      var $questionType = $('.modal #q-type-select').find('option:selected').text();

      if ($questionType === 'Multiple Choice') {
         passed = validateMultipleChoice() ? passed : false;
      } else {
         passed = validateCodeArea() ? passed : false;
      }

      validateHints();
   }

   $('#q-and-a-plugin').on('click', ' .modal .js-create-question', function() {
      validateQuestionForm();
   });
});
