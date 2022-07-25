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
                    buttonColor = $(this).find('buttoncolor').text(),
                    buttonTextColor = $(this).find('buttontextcolor').text(),
                    gradientLightColor = $(this).find('gradientlight').text(),
                    gradientDarkColor = $(this).find('gradientdark').text(),
                    characterFadeIn = $(this).find('characterfadein').text() === 'true';
                    $backgrounds = $(this).find("backgrounds"),
                    $characters = $(this).find("characters");

                // sets the name of the collection in the mint area
                $(".title").text(name);
                $(".collection-name").text(name);

                // sets the cost of each NFT
                $(".collection-cost").text(cost);

                // sets the total number of NFTs available
                $(".collection-total").text(total);

                // sets the layout of the mint info and character
                if(layout == "right") {
                    $(".character-pos").addClass("order-sm-1");
                    $(".mint-info").addClass("text-align-right");
                    $(".mint-offset").addClass("offset-md-6");
                } else {
                    $(".character-pos").addClass("order-sm-5");
                    $(".mint-info").addClass("text-align-left");
                }

                // sets the gradient colors of the mint progress bar
                $(".mint-progress-bar").css("background-image", "linear-gradient(to right, " + gradientLightColor + ", " + gradientDarkColor + ")");

                // sets the color for the minting buttons
                $(".round-button").css("background-color", buttonColor);
                $(".round-button").css("color", buttonTextColor);
                $("#mint-button").css("background-color", buttonColor);
                $("#mint-button").css("color", buttonTextColor);

                // sets the background according to user's system time
                $backgrounds.each(function(){
                    var numberOfBackgrounds = $(this).children("background").length;

                    if (numberOfBackgrounds > 1) {
                        var $background = $(this).find('background');

                        $background.each(function(){
                            var startTime = parseInt($(this).find('starttime').text()),
                            endTime = parseInt($(this).find('endtime').text()),
                            fileName = $(this).find('filename').text();

                            var startTime24 = endTime < startTime ? startTime - 24 : startTime;
                            var endTime24 = endTime < startTime ? endTime + 24 : endTime;
    
                            // updates background according to user system time of day
                            if ((currentHour >= startTime && currentHour < endTime24) || (currentHour >= startTime24 && currentHour < endTime)) {
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

                    // addes fade in based on config
                    if (characterFadeIn) {
                        $(".character").addClass("active");
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
    $("body").css("background-image",filename);
}


function setCharacter(filename){
    $(".character").attr("src", filename);
}