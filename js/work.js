const searchbar = $(".searchbar");
const searchicon = $(".search-icon");
const resultswrapper = document.getElementById("wrapper-results");


// Search functionality provided for both Enter key and search icon.
searchicon.on("click", (e) => {
        // first remove previous search results if existent.
        if(UITrafficController.resultsExist) {
        while (resultswrapper.firstChild) {
            resultswrapper.firstChild.remove();
        }
    }
        activate_query(searchbar.val()).then(() => {
            assign_images();
        })
    })

searchbar.on("keypress", (e) => {
    // if key = Enter
    if(e.keyCode == 13) {
        // first remove previous search results if existent.
        if(UITrafficController.resultsExist) {
        while (resultswrapper.firstChild) {
            resultswrapper.firstChild.remove();
        }
    }
        activate_query(searchbar.val()).then(() => {
            assign_images();
        })
    }
})

// Contains properties I would like to monitor for changes
UITrafficController = {
    resultsExist: false
}

/* Currently, this monitors if UITrafficController.resultsExist changes. If so, 
call resultsExistChanged function.*/
var UITrafficControllerProxy = new Proxy(UITrafficController, {
    set: function(obj, key, value) {
        // replace with switch statement when more properties must be monitored
        if(key == "resultsExist") {
            UITrafficController[key] = value;
            resultsExistChanged();
        }
    }
});

/* Makes sure the (.intro-text) is hidden when results exist; (.intro-text) is shown when results do not
 exist. */
 function resultsExistChanged() {
    if (UITrafficController.resultsExist) $(".intro-text").hide();
    else if (!UITrafficControllerProxy.resultsExist) $(".intro-text").show();
}

/* when the searchbar is actively being used and no results exist yet, hide the intro-text.
   when the searchbar is unfocused, no results exist, show the intro-text.*/
$(searchbar).on("focus", () => {
        if(!UITrafficController.resultsExist) $(".intro-text").hide();
})

$(searchbar).on("blur", () => {
    if(!UITrafficController.resultsExist) $(".intro-text").show();
})


// Function that gets 20 images(max available) from local API. 
function activate_query(topic) {

    return new Promise((resolve) => {
    
        const query_url = `https://joshuasegal-imagesearch.herokuapp.com/${topic}`;

    
        $.get(query_url, function(response) {
            results = JSON.parse(response);
    });

    resolve();
}); 
}

// Essentially creates image elements and later assigns URL sources to those images. 
function assign_images() {
    // Get rid of .intro-text if still shown through Proxy object. 
    UITrafficControllerProxy.resultsExist = true;

    setTimeout(() => {
        for(var i = 0; i < results.length; i++) {
            searchResultElement(results[i]);
        }
    }, 700)
}

/* This function takes in a parameter as an image source. It creates a image element and assigns 
 the parameter's value to the element.*/
function searchResultElement(src) {
    result = document.createElement("img");
    
    result.classList.add("result");

    result.src = src;

    resultswrapper.appendChild(result);
}

