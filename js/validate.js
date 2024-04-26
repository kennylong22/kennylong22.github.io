$(function() {
    $("#form").validate({
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            if (element.attr("name") == "name"
                || element.attr("name") == "email"
                || element.attr("name") == "message") {
                error.prependTo(element.parent());
            }
        },
        success: function(label) {
            label.parent().removeClass("error-parent");
        },
        highlight: function(element, errorClass) {
            $(element).parent().addClass("error-parent");
            $(element).parent().find(".error").fadeOut(function() {
                $(this).fadeIn();
            });
        },
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true
            },
            message: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please include either the name of either yourself, or your company",
                minlength: "Your name must consist of at least 2 characters"
            },
            email: {
                required: "Please provide an email address",
                minlength: "Your email must be at least 5 characters long"
            },
            message: {
                required: "Please enter your message"
            }
        }
    });
});