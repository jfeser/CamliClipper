chrome.contextMenus.create({
    id: "myContextMenu",
    title: "Save to Camlistore",
    contexts: ["image", "video"]
});

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    var gotRef = false;
    var referer = null;
    for(var n in details.requestHeaders){
        gotRef = details.requestHeaders[n].name.toLowerCase() == "x-referer";
        if(gotRef){
            referer = details.requestHeaders[n].value;
            details.requestHeaders.splice(n, 1);
            break;
        }
    }
    if(!gotRef) { return {}; }

    gotRef = false;
    for(n in details.requestHeaders){
        gotRef = details.requestHeaders[n].name.toLowerCase() == "referer";
        if(gotRef){
            details.requestHeaders[n].value = referer;
            break;
        }
    }
    if(!gotRef){
        details.requestHeaders.push({
            name:"Referer", value:referer
        });
    }
    return {requestHeaders:details.requestHeaders};
},{
    urls:["http://*/"]
},[
    "requestHeaders",
    "blocking"
]);

// for future parameters / expansion see here: https://developer.chrome.com/extensions/contextMenus#type-ContextType
chrome.contextMenus.onClicked.addListener(function(info) {
    var url = 'popup.html' + '?imgSrc=' + encodeURIComponent(info.srcUrl) + '&referrer=' + encodeURIComponent(info.pageUrl);
    chrome.windows.create({ url: url, type: "popup", width: 500, height: 700 });
});
