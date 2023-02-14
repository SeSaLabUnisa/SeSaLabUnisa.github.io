const editions = ["2023", "2021", "2019", "2017", "2016", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2003"];
const old_editions = ["2021", "2019", "2017", "2016", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2003"];

$(document).ready(function () {
    populateseries();
    year = getyear();
    $("title").append(" " + year);
    $("#series-link-" + year).addClass("active");
    if (old_editions.includes(year)) {
        // the default page for older editions will be populated
        $("#registration").remove();
        $("#registration-menu").remove();
        // fill page with info about the edition
        $.getJSON('https://sesalabunisa.github.io/assets/db/issse/' + year + '.json', fillinfo);
    }
    else {
        window.location.replace("https://sesalabunisa.github.io/ISSSE-" + year + "/");
    }
});


function fillinfo(jsoninfo) {
    // get all the information and fill the spaces
    // there is a html element with the right style
    // it has to be (optionally cloned and) filled with info
    $("#issse-edition-number-span").append(jsoninfo.edition);
    $('#issse-edition-year-span').append(jsoninfo.year);
    $('#issse-date-span').append(formatdate(jsoninfo.startdate, jsoninfo.enddate) + " " + jsoninfo.year);
    $('#issse-venue-span').append(jsoninfo.venue);
    $("#issse-about-paragraph").append(jsoninfo.intro);
    fillprogram(jsoninfo.lectures);
    fillorganization(jsoninfo.organization);
    fillsupporters(jsoninfo.supporters);
}


function fillprogram(jsontalks) {
    div = $("#talk-list");
    ptitle = div.children(".talk-title")[0];
    pspeaker = div.children(".talk-speaker")[0];
    jsontalks.forEach(talk => {
        newtitle = ptitle.cloneNode(true);
        newtitle.textContent = talk.title;
        div.append(newtitle);
        newspeaker = pspeaker.cloneNode(true);
        newspeaker.textContent = talk.name + " " + talk.surname + ", " + talk.affiliation;
        div.append(newspeaker);
    });
    ptitle.remove();
    pspeaker.remove();
}


function fillorganization(jsonorganization) {
    div = $("#organizers-list");
    ptitle = div.children(".organizers-title")[0];
    pmember = div.children(".organizers-member")[0];
    for (const [key, value] of Object.entries(jsonorganization)) {
        newtitle = ptitle.cloneNode(true);
        newtitle.textContent = key;
        div.append(newtitle);
        value.forEach(member => {
            newmember = pmember.cloneNode(true);
            newmember.textContent = member.name + " " + member.surname + ", " + member.affiliation;
            div.append(newmember);
        });
    }
    ptitle.remove();
    pmember.remove();
}


function fillsupporters(jsonsupporters) {
    div = $("#organizers-list");
    newtitle = div.children(".organizers-title")[0].cloneNode(true);
    newtitle.textContent = "Supporters";
    div.append(newtitle);
    pmember = div.children(".organizers-member")[0];
    jsonsupporters.forEach(supporter => {
        newmember = pmember.cloneNode(true);
        newmember.textContent = supporter.name;
        div.append(newmember);
    });
}


function formatdate(startdate, enddate) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    str = "";
    if (startdate.month == enddate.month) {
        return str + startdate.day + " - " + enddate.day + " " + months[startdate.month - 1];
    }
    else {
        return str + startdate.day + " " + months[startdate.month - 1] + " - " + enddate.day + " " + months[enddate.month - 1];
    }
}


function getyear() {
    urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('year')) {
        var y = urlParams.get('year');
        if (editions.includes(y)) {
            return y;
        }
    }
    // default page: about last edition
    return editions[0];
}


function populateseries() {
    ul = $("#series-dropdown");
    li = $("#series-li-");
    editions.forEach(edyear => {
        newli = li.clone(true);
        newli.attr("id", newli.attr("id") + edyear);
        newa = newli.children("a");
        newa.attr("id", newa.attr("id") + edyear);
        newa.attr("href", newa.attr("href") + edyear);
        newa.text(edyear);
        ul.append(newli);
    });
    li.remove();
}
