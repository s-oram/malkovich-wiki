(function($){
    //http://stackoverflow.com/a/4709890/395461
    //https://learn.jquery.com/plugins/basic-plugin-creation/
    $.fn.AjaxForm_OnSubmit = function(SubmitHandler){
        if ($(this).is("form") == false) return this;
        var form = this;



        function ShowSpinner(){
            $(form).find("button[type=submit] img.spinner").wait(100).slideToggle();
        }

        function HideSpinner(){
            $(form).find("button[type=submit] img.spinner").wait(100).stop().slideToggle();
        }

        function EnableSubmitButton(){
            $(form).find("button[type=submit]").removeAttr('disabled');
        }

        function DisableSubmitButton(){
            $(form).find("button[type=submit]").attr('disabled', 'disabled');
        }

        $.fn.AjaxForm_RequestFinished = function(){
            HideSpinner();
            EnableSubmitButton();
        };

        $.fn.AjaxForm_ShowSuccessMessage = function(msg){
            var FormSuccessMessage = $(this).find("div.form-success-message");
            FormSuccessMessage.html(msg);
            FormSuccessMessage.slideDown(300);
            FormSuccessMessage.removeClass("hidden");
        };

        $.fn.AjaxForm_ShowErrorMessage = function(msg){
            var FormErrorMessage = $(this).find("div.form-error-message");
            FormErrorMessage.html(msg);
            FormErrorMessage.slideDown(300);
            FormErrorMessage.removeClass("hidden");
        };

        $.fn.AjaxForm_HideMessages = function(){
            var FormSuccessMessage = $(this).find("div.form-success-message");
            var FormErrorMessage = $(this).find("div.form-error-message");
            FormSuccessMessage.fadeOut(300);
            FormErrorMessage.fadeOut(300);
        };

        $.fn.AjaxForm_HideInputs = function(){
            var FormInputs = $(this).find("div.form-group");
            FormInputs.fadeOut(150);
        };

        $(this).submit(function(e){
            e.preventDefault();
            ShowSpinner();
            DisableSubmitButton();
            $(form).AjaxForm_HideMessages();
            if (SubmitHandler != null) SubmitHandler(form);
        });

        return this;
    };
}(jQuery));
