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
    $.ajax({
        type: 'GET',
        url: './Content/files/mint_config.xml',
        //url: 'https://yamwaffle.github.io/serenity_mint/Content/files/mint_config.xml',
        dataType: 'xml',    
        success: function(xml) {
            var $collections = $(xml).find("collections");
            var currentHour = (new Date()).getHours();

            $collections.each(function(){
                var name = $(this).find('name').text(),
                    cost = $(this).find('cost').text(),
                    total = $(this).find('total').text(),
                    layout = $(this).find('layout').text(),
                    folderName = $(this).find('foldername').text(),
                    $backgrounds = $(this).find("backgrounds"),
                    $characters = $(this).find("characters");

                // sets the layout of the mint info and character
                if(layout == "right") {
                    $(".character-right").css("display", "none");
                } else {
                    $(".character-left").css("display", "none");
                }


                // sets the background according to user's system time
                $backgrounds.each(function(){
                    var numberOfBackgrounds = $(this).children("background").length;

                    if (numberOfBackgrounds > 1) {
                        var $background = $(this).find('background');

                        $background.each(function(){
                            var startTime = parseInt($(this).find('starttime').text()),
                            endTime = parseInt($(this).find('endtime').text()),
                            fileName = $(this).find('filename').text();
    
                            if (endTime < startTime) {
                                endTime = endTime + 24;
                            }
    
                            // updates background according to user system time of day
                            if (currentHour >= startTime && currentHour < endTime) {
                                setBackground("url('./Content/images/" + folderName + "/" + fileName + "')");
                            }
                        });
                    } else {
                        // just set the one background
                        var fileName = $(this).find('filename').text();
                        setBackground("url('./Content/images/" + folderName + "/" + fileName + "')");
                    }
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
        },
        error: function(err){
            alert("error occurred reading xml: " + err);
        }
    });
});


function setBackground(filename){
    $(".collection").css("background-image",filename);
}


function setCharacter(filename){
    $(".character").attr("src", filename);
}