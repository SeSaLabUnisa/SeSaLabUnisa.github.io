$(document).ready(function () {
    var pagelang = $('html').attr('lang');
    $.getJSON('../assets/db/tags.json', function (jdata) {
        var str1 = '<div class="col-lg-3 col-md-4 col-sm-6" data-aos="zoom-out" data-aos-delay="700">';
        var str2 = '<div class="research-box d-flex align-items-center"><h3>';
        var str3 = '</h3></div></div>';
        jdata.forEach(function (item, index, array) {
            $('#topics').append($(str1 + str2 + item["name"][pagelang] + str3));
        })
    });
});

function startSurvey() {
    console.log("START!");
}

$('.thesis-form').on('submit', function () {
    console.log("submitted");
    alert('Form submitted!');
    return false;
});