(function (lib) {
    var content = lib.extendNamespace("content");
    content.Spy = function() {
        var eventTypes = {
            songData : null,
            songLike : null
        };
        var eventDivs = {};

        function fireEvent(event, data) {
            var element = eventDivs[event].get(0);
            element.innerText = data;
            console.log(event);
            element.dispatchEvent(eventTypes[event]);
        }

        function createEvent(name) {
            var customEvent = document.createEvent('Event');
            customEvent.initEvent(name, false, false); 
            eventTypes[e] = customEvent;
        }

        function getEventDiv(name) {
            eventDivs[name] = $('#pr_' + name);
        }

        function getUrlParams(string) {
            var parts = string.split("?");
            var keyVals = parts[1].split("&");
            var obj = {};
            for(var i = 0; i < keyVals.length; i++) {
                var pieces = keyVals[i].split("=");
                obj[pieces[0]] = pieces[1];
            }
            return obj;
        }

        for(var e in eventTypes) {
            if(eventTypes.hasOwnProperty(e)) {
                createEvent(e);
                getEventDiv(e);
            }
        }

        $('body').ajaxComplete(function(e, data, request) {
            if(request.url.substr(0, 29) == "http://www.pandora.com/radio/") {
                console.log(arguments);
                var params = getUrlParams(request.url);
                if(params.method === "getFragment" || params.method === "getFirstFragment") {
                    console.log("firing event");
                    fireEvent("songData", data.responseText);
                } else if(params.method == "addFeedback" && params.arg3 == "true") {
                    fireEvent("songLike", params.arg2);
                }
            }
        });
        window.spy = [eventTypes, eventDivs];
    };
})(PandoraRipper);
    
