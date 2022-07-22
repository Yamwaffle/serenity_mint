var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

$(document).ready(function()
{
    // toggles the mobile menu when clicked
    $(".nav-link").each(function() {
        $(this).click(function() {
            $(".navbar-toggler").trigger("click");
        })
    });

    // reads from mint_config.xml and stores data
    //var xmlDoc = $.parseXML("<collections> <collection> <name>mūz alias: the dream girl</name> <cost>0.06</cost>  <total>1000</total>  <layout>right</layout>  <foldername>dream_girl</foldername> <backgrounds>   <background> <filename>background_1.jpg</filename> <starttime>5</starttime>  <endtime>13</endtime>  </background> <background> <filename>background_2.jpg</filename> <starttime>13</starttime> <endtime>21</endtime> </background> <background> <filename>background_3.jpg</filename> <starttime>21</starttime> <endtime>5</endtime> </background> </backgrounds> <characters>   <character> <filename>dream_1.png</filename> </character> <character> <filename>dream_2.png</filename> </character> <character> <filename>dream_3.png</filename> </character> <character> <filename>dream_4.png</filename> </character> </characters> </collection> </collections>");
    var xmlDoc = $.parseXML("../files/mint_config.xml");
    var $xml = $(xmlDoc);

    var $collections = $xml.find("collections");
    var currentHour = (new Date()).getHours();

    $collections.each(function(){
        var name = $(this).find('name').text(),
            cost = $(this).find('cost').text(),
            total = $(this).find('total').text(),
            layout = $(this).find('layout').text(),
            folderName = $(this).find('foldername').text(),
            $backgrounds = $(this).find("backgrounds"),
            $characters = $(this).find("characters");


        // sets the background according to user's system time
        $backgrounds.each(function(){

            var $background = $(this).find('background');

            $background.each(function(){
                var startTime = parseInt($(this).find('starttime').text()),
                endTime = parseInt($(this).find('endtime').text()),
                fileName = $(this).find('filename').text();

                // checks if there's no start or end time (which means only 1 background)
                if(isNaN(startTime)) {
                    setBackground("url('./Content/images/" + folderName + "/" + fileName + "')");
                }

                if (endTime < startTime) {
                    endTime = endTime + 24;
                }

                // updates background according to user system time of day
                if (currentHour >= startTime && currentHour < endTime) {
                    setBackground("url('./Content/images/" + folderName + "/" + fileName + "')");
                }
            });
        });

        
        // randomly chooses character to display (if more than one)
        $characters.each(function(){
            var numberOfCharacters = $(this).children("character").length;

            // if there are multiple to choose from
            if (numberOfCharacters > 1) {
                var randomCharacter = Math.floor(Math.random() * numberOfCharacters) + 1;
                var currentCount = 1;
                $characters.find("character").each(function() {
                    if(currentCount === randomCharacter)
                    {
                        // set character
                        var fileName = $(this).find('filename').text();
                        setCharacter("./Content/images/" + folderName + "/" + fileName);
                        return false;
                    } else {
                        currentCount++;
                    }
                });

            } else {
                // just set the one character
                var fileName = $(this).find('filename').text();
                setCharacter("./Content/images/" + folderName + "/" + fileName);
            }
        });
    });

});


function setBackground(filename){
    $("#collection").css("background-image",filename);
}


function setCharacter(filename){
    $("#character").attr("src", filename);
}