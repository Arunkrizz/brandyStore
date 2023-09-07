/**
 * Created by Hassan Elhawry.
 */

$(function() {
    
    $("[placeholder]").focus(function() {
        $(this).attr("data-text", $(this).attr("placeholder"));
        $(this).attr("placeholder", "");
        $(this).parent().find("i").css({
            "left": "20px",
            "color": "#57b846",
            "z-index": "2252"
        });
        $(this).css({ "padding-left": "47px", "border-color": "#DDD" });

    }).blur(function() {
        $(this).attr("placeholder", $(this).attr("data-text"));
        $(this).parent().find("i").css({
            "left": "35px",

        });
        $(this).css("padding-left", "65px")
    });



    var userError = true,

        passError = true;

    //Check Eorro On Submit
    $('.user').blur(function() {

        if ($(this).val().length < 4) {

            $(this).css('border', '1px solid #F00');
            $(this).parent().find("i").css("color", "#F00");
            userError = true;

        } else {

            $(this).css('border', '1px solid #080');
            userError = false;
        }
    })

    $('.pass').blur(function() {

        if ($(this).val().length == '') {

            $(this).css('border', '1px solid #F00');
            $(this).parent().find("i").css("color", "#F00");
            passError = true;

        } else {

            $(this).css('border', '1px solid #080');
            passError = false;
        }
    })


    $('.login-form').submit(function(e) {

        if (userError === true || passError === true) {

            e.preventDefault();
            $('.user , .pass').blur();
            $(this).find(".ic").css({
                "color": "red"
            });

        }
    });
});
