$(function() {

    setup();
    addModals();

    function setup() {

        var $plugin_body = $( '<div class="plugin-body"></div>' );
        $plugin_body.append( '<h1>Learning Center Pages</h1>' );

        var $page_table = $('<div class="qa-tbl"></div>');

        var $table_header = $( '<div class="qa-tbl-row qa-tbl-hdr qa-stripe"></div>' );
        $table_header.append( '<div class="qa-page-id qa-center"><span>Page ID</span></div>' );
        $table_header.append( '<div class="qa-page-title"><span>Page Title</span></div>' );
        $table_header.append( '<div class="qa-page-q-count qa-center"><span>Question Count</span></div>' );
        $table_header.append( '<div class="qa-page-preview qa-center"><span>Preview</span></div>' );

        $page_table.append( $table_header );

        $page_table.append( getPageRows() );

        $plugin_body.append( $page_table );
        $( 'div#q-and-a-plugin' ).append( $plugin_body );
    }

    function getPageRows() {
        var $pageRows = $();
        for (var i = 0; i < wp_pages.length; i++) {
            var page = wp_pages[i];
            var $row = $( '<div class="qa-tbl-row qa-stripe page" data-p-id="' + page[0] + '" data-p-title="' + page[1] + '"></div>' );
            $row.append( '<div class="qa-page-id qa-center"><span>' + page[0] + '</span></div>' );
            $row.append( '<div class="qa-page-title"><span>' + page[1] + '</span></div>' );
            $row.append( '<div class="qa-page-q-count qa-center"><span> 0 </span></div>' );
            $row.append( '<div class="qa-page-preview qa-center"><button type="button" class="btn btn-success page-preview"><span class="glyphicon glyphicon-eye-open"></span><a href="' + page[2] + '" target="_blank" rel="noopener"></a></button></div>' );
            $pageRows = $pageRows.add($row);
        }
        return $pageRows;
    }

    function addModals() {
        $('div#q-and-a-plugin').append('<div id ="q-embed-preview-modal" class="modal"><div class="modal-content"><div class="modal-close"><span class="glyphicon glyphicon-remove"></span></div><div class="modal-header"><h1></h1></div><div class="modal-body"></div><div class="modal-footer"><div class="modal-footer-buttons"><button class="btn btn-default">Close</button><button class="btn btn-success">Save</button></div></div></div></div>');
        $('div#q-and-a-plugin').append('<div id ="q-add-edit-modal" class="modal"><div class="modal-content"><div class="modal-close"><span class="glyphicon glyphicon-remove"></span></div><div class="modal-header"><h1>New Question</h1></div><div class="modal-body"></div><div class="modal-footer"><div class="modal-footer-buttons"><button class="btn btn-default">Close</button><button class="btn btn-success">Save</button></div></div></div></div>');
    }

    // stop click of the preview opening/closing a row
    $('button.page-preview').click(function(e) {
        e.stopPropagation();
    });

    $('div.qa-tbl-row.page').on('click', function() {
        var page_id = $(this).data('p-id');
        var page_title = $(this).data('p-title');

        // if the questions for this page are open
        if ($(this).next().hasClass('questions')) {
            $('div.questions, div.blank-row').slideUp(400, function() {
                $(this).remove();
            });
        } else {

            $('div.questions, div.blank-row').remove();

            var questions = $('<div class="questions"></div></div>')
            var questionTable = $('<div class="qst-table"></div>');
            questionTable.append('<div class="qa-tbl-row qa-tbl-hdr"><div class="q-name"><span>Question Name</span></div><div class="q-embed qa-center"><span>Embed</span></div>' +
                '<div class="q-edit qa-center"><span>Edit</span></div><div class="q-preview qa-center"><span>Preview</span></div><div class="q-report qa-center"><span>View Report</span></div>' +
                '<div class="q-delete qa-center"><span>Delete</span></div></div>');

            for (var i = 0; i < 5; i++) {
                var question = $('<div class="qa-tbl-row question"></div>');
                question.append('<div class="q-name"><span>How to use $(#my-element).after</span></div>');

                var embedButton = $('<div class="q-embed qa-center"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-link"></span></button></td>');

                embedButton.find('button').on('click', function() {
                    questionEmbedButtonClick(page_id, page_title);
                });

                var editButton = $('<div class="q-edit qa-center"><button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></button></div>');

                editButton.find('button').on('click', function() {
                   questionEditButtonClick(); // and question_id
                });

                var previewButton = $('<div class="q-preview qa-center"><button type="button" class="btn btn-success"><span class="glyphicon glyphicon-eye-open"></span></button><div/>');

                previewButton.find('button').on('click', function() {
                   // questionPreviewButtonClick(page_id, page_title);
                });

                var reportButton = $('<div class="q-report qa-center"><button type="button" class="btn btn-info"><span class="glyphicon glyphicon-list-alt"></span></button></div>');

                reportButton.find('button').on('click', function() {
                    questionReportButtonClick(); // question id
                });

                var deleteButton = $('<div  class="q-delete qa-center"><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button></div>');

                deleteButton.find('button').on('click', function() {
                    questionDeleteButtonClick() // question_id
                });

                question.append(embedButton);
                question.append(editButton);
                question.append(previewButton);
                question.append(reportButton);
                question.append(deleteButton);
                questionTable.append(question);
            }


            var addButton = $('<div class="qa-tbl-row question"><div class="q-add"><button type="button" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></button></div>');

            addButton.find('button').on('click', function() {
               addQuestionButtonClick(page_id);
            });

            questionTable.append(addButton);
            var blankSpace = $('<div class="qa-tbl-row blank-row"></div>');
            $(this).after(questions);
            questions.append(questionTable).after(blankSpace);
            blankSpace.height(questions.height());
            questions.add(blankSpace).hide().slideDown(600);
        }
    });



    $('div.modal-close').add('div.modal-footer .btn-default').add('.modal').on('click', function() {
       $('div.modal').fadeOut(300);
    });

    // stop modal overlay close event
    $('div.modal-content').on('click', function(e) {
        e.stopPropagation();
    });

    function questionEmbedButtonClick(page_id, page_title) {
        var data = {
            action: 'embed_question',
            page_id: page_id
        };

        $.ajax({
            type: "post",
            dataType: "json",
            url: wp_ajax.ajax_url,
            data: data
        })
        .done(function(data) {
            console.log( "success - get edit page" );
        })
        .fail(function() {
            console.log( "error - get edit page" );
        })
        .always(function(data) {
            console.log('always - get edit page');
            console.log(data);

            $('div#q-embed-preview-modal').data('p-id', page_id);
            $('div#q-embed-preview-modal').data('p-title', page_title);
            $('div#q-embed-preview-modal').fadeIn(600);
            $('div#q-embed-preview-modal div.modal-header>h1').text(page_title + ': <iframe src="http://www.example.com"></iframe>');
            $('div#q-embed-preview-modal div.modal-body').empty().append(data.responseText);
        });
    }

    function questionEditButtonClick() { // question id
        // TO DO
    }

    // function questionPreviewButtonClick() {
    //     // TO DO - probably just an <a> link
    // }

    function questionReportButtonClick() { // question id
        // TO DO
    }

    function questionDeleteButtonClick() { // question id
        // TO DO
    }

    function addQuestionButtonClick(page_id) {
        $('div#q-add-edit-modal').data('p-id', page_id);
        var modal_body = $('div#q-add-edit-modal .modal-body');
        modal_body.empty();

        var question_form = $('<form></form>');

        var question_name = $('<fieldset class="form-group"> <label for="q-name-input">Question Name </label> <input type="text" id="q-name-input" class="form-control" placeholder="Question Name"></fieldset>');

        var question_type = $('<fieldset class="form-group"> <label for="q-type-select">Question Type </label></fieldset>');

        var type_select = $('<select class="form-control" id="q-type-select"><option>Multiple Choice Text</option><option>Multiple Choice Code</option>' +
            '<option>Bug Fix</option><option>Missing Code</option><option>Code Complete</option></select>');

        question_type.append(type_select);

        var question_statement = $('<fieldset class="form-group"> <label for="q-statement-input">Question Statement </label> <input type="text" id="q-statement-input" class="form-control" placeholder="Question Statement"></fieldset>');

        var type_area = $('<div class="question-type-area"></div>');

        $(type_select).on('change', function() {
            console.log('type change, selected option: ' + type_select.find('option:selected').text());
            type_area.html(questionTypeChange(type_select.find('option:selected').text()));
        });



        question_form.append(question_name.add(question_type).add(question_statement));
        type_area.html(questionTypeChange(type_select.find('option:selected').text()));
        question_form.append(type_area);

        modal_body.append(question_form);

        $('div#q-add-edit-modal').fadeIn(600);
    }

    // probably better to operate on the option text (if order changes)
    function questionTypeChange(type) {
        var modal_body = $('div#q-add-edit-modal .modal-body');
        switch (type) {
            case 'Multiple Choice Text':
                var r = $();
                var num_options = $('<fieldset class="form-group mc-num"><label for="q-num-options-select">No. Options </label><select class="form-control" id="q-num-options-select">' +
                    '<option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></fieldset><label">Set Options</label>');

                num_options.find('select').on('change', function() {
                    var new_count = $(this).find('option:selected').text();
                    var old_count = $('fieldset.mc-text-entry').length;

                    if ( new_count > old_count ) {
                        $('fieldset.mc-text-entry').last().after(createMultipleChoiceOptions(new_count - old_count))
                    }
                    else if ( new_count < old_count ) {
                        for (var i = 0; i < old_count - new_count; i++) {
                            $('fieldset.mc-text-entry').last().remove();
                        }
                    }
                });

                num_options.find('select').val(4);

                r = r.add(num_options).add(createMultipleChoiceOptions(4));

                return r;
                break;
            case 'Multiple Choice Code':
                return '';
                break;
            case 'Bug Fix':
            default:
                return '';
                break;
            case 'Missing Code':
                return '';
                break;
            case 'Complete Code':
                return '';
                break;
        }
    }

    function createMultipleChoiceOptions(n) {
        var r = $('');
        for (var i = 0; i < n; i++) {

            var option = $('<fieldset class="form-group mc-text-entry"><div class="input-group input"><input type="text" class="form-control" id="q-mc-option-' + i + '" placeholder="Option Text">' +
                '<div class="input-group-addon correct-answer"></div><div class="input-group-addon wrong-answer"></div></div></div></fieldset>');

            var correct_button = $('<button type="button" class="btn btn-default mc-correct-answer"><span class="glyphicon glyphicon-ok"></span></button>');
            var wrong_button = $('<button type="button" class="btn btn-default mc-wrong-answer"><span class="glyphicon glyphicon-remove"></span></button>');

            correct_button.on('click', function() {
                var input = $(this).closest('.input-group').find('input');

                if ($(this).hasClass('btn-success')) {
                    $(this).removeClass('btn-success').addClass('btn-default');
                    input.removeClass('correct');
                }
                else {
                    if (input.hasClass('wrong')) {
                        console.log('INPUT HAS CLASS WRONG');
                        input.removeClass('wrong');
                        $('.btn.mc-wrong-answer').removeClass('btn-danger').addClass('btn-default');
                    }
                    $(this).addClass('btn-success').removeClass('btn-default');
                    input.addClass('correct');
                }
            });

            wrong_button.on('click', function() {
                var input = $(this).closest('.input-group').find('input');

                if ($(this).hasClass('btn-danger')) {
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    input.removeClass('wrong');
                }
                else {
                    if (input.hasClass('correct')) {
                        console.log('INPUT HAS CLASS CORRECT');
                        input.removeClass('correct');
                        $('.btn.mc-correct-answer').removeClass('btn-success').addClass('btn-default');
                    }
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    input.addClass('wrong');
                }
            });

            option.find('.correct-answer').append(correct_button);
            option.find('.wrong-answer').append(wrong_button);

            r = r.add(option);
        }
        return r;
    }

    $('div#q-embed-preview-modal button.btn-success').on('click', function() {
        var page_id = $('div#q-embed-preview-modal').data('p-id');
        var page_title = $('div#q-embed-preview-modal').data('p-title');
        var page_content = $('div#q-embed-preview-modal textarea.wp-editor-area').val();

        var data = {
            action: 'update_page',
            page_id: page_id,
            page_content: page_content
        };

        $.ajax({
            type: "post",
            dataType: "json",
            url: wp_ajax.ajax_url,
            data: data
        })
        .done(function(data) {
            console.log( "success - update page" );
        })
        .fail(function() {
            console.log( "error - update page" );
        })
        .always(function(data) {
            console.log('always - update page');
            console.log(data);
            var $message = $('<div class="modal-message-overlay"><div class="modal-message-content"><h2>The ' + page_title +  ' page has been updated successfully!</h2></div></div>');

            $('div#q-embed-preview-modal .modal-content').append($message);
            $message.hide().fadeIn(1000, function() { setTimeout(function() { $message.fadeOut(800, function() { $message.remove(); }) }, 1200) });
        });
    });


});
