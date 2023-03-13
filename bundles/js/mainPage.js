/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

+function ($) { "use strict";

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.prototype.close = function (e) {
        var $this    = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.hasClass('alert') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent.trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one($.support.transition.end, removeElement)
                .emulateTransitionEnd(150) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);


var tradeInPage = {
    startMe: function () {
        // Checkbox
        $('.check-box').find('.cheker').click(function() {
            var cbxWrapper = $(this).parents('.check-box');
            var cbx = cbxWrapper.find('input');

            if( cbx.is(':checked') ) {
                cbxWrapper.removeClass('active');
                cbx.removeAttr('checked');
            } else {
                cbxWrapper.addClass('active');
                cbx.attr('checked', true).prop('checked', true);
            }
            return false;
        });

        // Open_Personal-data-box
        $('.ev_data-agree .open-btn').click(function() {
            $(this).removeClass('active');
            if($(this).parents('.ev_data-agree').find('.data-agree_open-box').css('display') == 'block') {
                $(this).parents('.ev_data-agree').find('.data-agree_open-box').slideUp(300);
            }
            else{
                $(this).parents('.ev_data-agree').find('.data-agree_open-box').slideDown(300);
                $(this).addClass('active');
            }
            return false;
        });

        // file uploads
        (function () {
            $('.inputfile').each(function (i) {
                $MB_limit = 2;
                $maxFileSize = $MB_limit * 1024 * 1024;

                /*var uploadErrors = [];
                var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
                    uploadErrors.push('Filesize is too big');
                }
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                    data.submit();
                }*/

                var $input = $(this);
                $input.on('change', function (e) {
                    /*var fileName = e.target.value.split( '\\' ).pop();

                    if ( fileName ) {
                        console.log('fileName', fileName);
                    } else {
                        console.log('NO fileName');
                    }*/

                    var files = !!this.files ? this.files : [];
                    if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

                    var uploadErrors = [];
                    var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;

                    // if (/^image/.test( files[0].type)){ // only image file
                    if (acceptFileTypes.test(files[0].type)) { // only image file
                        var reader = new FileReader(); // instance of the FileReader
                        reader.readAsDataURL(files[0]); // read the local file

                        reader.onloadend = function() { // set image data
                            $input.siblings('img').attr('src', this.result).show();
                        }
                    } else {
                        uploadErrors.push('Файлът трябва да е снимка'); // Not an accepted file type
                    }

                    if(files[0].size > $maxFileSize) {
                        uploadErrors.push('Файлът е по-голям от ' + $MB_limit + 'МБ'); // Filesize is too big
                    }

                    if (uploadErrors.length > 0) {
                        alert(uploadErrors.join("\n"));
                    }
                });
            });
        })();
    }
};


$(document).ready(function () {

        function modalOnFirstVisit() {
            var $modal = $("#first-modal");

            if ($modal.length) {
                var $overlay = $('.modal-overlay');
                var timesVisible = $modal.attr('data-times-visible');
                // console.log('in');
                var popCount = sessionStorage.getItem('popupTimes') || 0;
                var popCounter = popCount;

                if (parseInt(popCount) < parseInt(timesVisible)) {
                    //var resStr = window.location.href;
                    //if(!resStr.match(/monthly-offer/)){
                    // console.log('if');
                    popCounter++;
                    $modal.fadeIn().css('display', 'block');
                    $overlay.fadeIn().css('display', 'block')
                        .on('click', function () {
                            $modal.fadeOut().css('display', 'none');
                            $overlay.fadeOut().css('display', 'none');
                        });
                    // $(document).click(function (e) {
                    //     if (e.target.id != 'first-modal') {
                    //         $("#first-modal").fadeOut().css('display', 'none');
                    //         $(".modal-overlay").fadeOut().css('display', 'none');
                    //         window.location = '/monthly-offer';
                    //     }
                    // });

                    sessionStorage.setItem('popupTimes', popCounter);

                    $modal.find('.closeButton').on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $overlay.click();
                    });
                }
                else {
                    //sessionStorage.setItem('popupTimes', 0);
                }
            }
        }

        modalOnFirstVisit();

        $('#app_trade_registrationYear').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd-mm-yy',
            yearRange: "-30:+2",
            onSelect: function (datetext) {
                $('.date').val(datetext);
            },
        });

        $('.agreeClick').on('click', function () {
            $(".input-box .agreePanel .termsPanel").css('display', 'block');
            $('.input-box .agreePanel .termsPanel .closeButton').on('click', function () {
                $(".input-box .agreePanel .termsPanel").css('display', 'none');
            });
        });

        if ($('body').hasClass('tradeInPage')) {
            tradeInPage.startMe();
        }

    } // callback function of $(document).ready()
); // $(document).ready()

