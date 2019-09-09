import * as signalR from "@aspnet/signalr";
import deleteImg from '../../images/delete.png';

const ContentType = { 
    TEXT : "Text",
    NUMBER : "Number",
    JSON : "JSON"
}

var connection = null;
var storeFunc = null;
var isConnected = false;
var isAdvanceView = false;

export function Init() {
    //Connect Button Events
    var connectBtnClass = document.getElementsByClassName('connectbtn');
    for (var i = 0; i < connectBtnClass.length; i++) {
        connectBtnClass[i].addEventListener('click',
            function () {
                OnConnect();
            },
            false);
    }

    //Disconnect Button Events
    var disconnectBtnClass = document.getElementsByClassName('disconnectbtn');
    for (var i = 0; i < disconnectBtnClass.length; i++) {
        disconnectBtnClass[i].addEventListener('click',
            function () {
                OnDisConnect();
            },
            false);
    }

    //Send Payload Button Events
    var sendBtnClass = document.getElementsByClassName('btn-send-payload');
    for (var i = 0; i < disconnectBtnClass.length; i++) {
        sendBtnClass[i].addEventListener('click',
            function () {
                SendPayload();
            },
            false);
    }

    NotConnected();
    Test();

}

export function Test() {

    var navLinkClass = document.getElementsByClassName('nav-link');
    for (var i = 0; i < navLinkClass.length; i++) {
        navLinkClass[i].addEventListener('click',
            function () {
                console.log(this.getAttribute('data-tab-type'));
                OnTabChange(this.getAttribute('data-tab-type'));
            },
            false);
    }
}

export function OnTabChange(tabName) {
    debugger;
    if (tabName == 'basic') {
        //document.getElementById('protocol-support').style = 'display:none';
        isAdvanceView = false;
        AdvanceViewElements(isAdvanceView);
    }
    else {
        isAdvanceView = true;
        AdvanceViewElements(isAdvanceView);
        // if (isConnected) {
        //     isAdvanceView = true;
        //     //document.getElementById('protocol-support').style = 'display:block';
        //     AdvanceViewElements(isAdvanceView);
        // }
    }
}

export function AdvanceViewElements(enable) {
    if(enable === true) {
        document.getElementById('protocol-support').style = 'display:block';
    } 
    else {
        document.getElementById('protocol-support').style = 'display:none';
    }
}

export function AddArguments() {
    //Add Arguments Button Events
    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].addEventListener('click', AddArgumentsCallBack, false);
    }
}

export function AddArgumentsCallBack() {

    var parentDiv = document.getElementsByClassName('method-arguments');

    for (var i = 0; i < parentDiv.length; i++) {

        var divElement = document.createElement('div');
        //divElement.setAttribute('class', 'form-group form-inline args-container');
        divElement.setAttribute('class', 'container args-container');
        //divElement.setAttribute('style', 'border:1px solid #cecece');

        var hr = document.createElement('hr');
        hr.setAttribute('class', 'style13');

        divElement.appendChild(GetTextBoxElement());
        divElement.appendChild(GetSelectElement());
        divElement.appendChild(GetImageElement());
        divElement.append(document.createElement('br'))
        divElement.appendChild(hr);
        parentDiv[i].appendChild(divElement);
    }
}

export function GetSelectElement() {
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');


    var selectElement = document.createElement('select');
    selectElement.setAttribute('class', 'req-content-type form-control');

    var optionTxt = document.createElement('option');
    var optionNum = document.createElement('option');
    var optionJsonObj = document.createElement('option');

    optionTxt.value = ContentType.TEXT
    optionTxt.text = "Text";
    selectElement.add(optionTxt, null);

    optionNum.value = ContentType.NUMBER
    optionNum.text = "Number";
    selectElement.add(optionNum, null);

    optionJsonObj.value = ContentType.JSON;
    optionJsonObj.text = "JSON";
    selectElement.add(optionJsonObj, null);

    div.appendChild(selectElement);

    return div;
}

export function GetTextBoxElement() {

    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');

    var inputTxtElement = document.createElement('textarea');
    inputTxtElement.setAttribute("row", "1");
    inputTxtElement.setAttribute("value", "");
    inputTxtElement.setAttribute("class", "form-control req-arg-txt");
    inputTxtElement.setAttribute("placeholder", "Request Payload");

    div.appendChild(inputTxtElement);
    return div;
}

export function GetImageElement() {
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');

    var imgElement = document.createElement('img');
    imgElement.src = deleteImg;
    // inputTxtElement.src = require('../../images/delete.png');
    imgElement.addEventListener('click', function() {
        console.log('Delete Button');
        this.parentElement.parentElement.remove();
    });
    div.appendChild(imgElement);
    return div;
}

export function ReadArguments() {
    var requestArgs = new Array();
    var argsContainers = document.querySelectorAll('.args-container');
    console.log(argsContainers);
    
    if (argsContainers.length == 0) {
        return requestArgs;
    }

    argsContainers.forEach((el) => {
        var textBox = el.querySelector('.req-arg-txt').value;
        var selectList = el.querySelector('.req-content-type').value;

        if(textBox !== "") {
            requestArgs.push({cType: selectList, data: textBox });
        }
    });

    return requestArgs;
}

export function ReadAndFormatArguments() {
    var args = ReadArguments();
    var requestArguments = new Array();

    args.forEach((d) => {
        if(d.cType == ContentType.NUMBER) {
            requestArguments.push(Number(d.data));
        } 
        else if(d.cType == ContentType.JSON) {
            requestArguments.push(JSON.parse(d.data));
        }
        else if(d.cType == ContentType.TEXT) {
            requestArguments.push(d.data);
        }
    });

    return requestArguments;
}

export function NotConnected() {
    console.log("notConnected");
    var onConnectClass = document.getElementsByClassName('onconnect');
    var tests = function () {
        console.log('btn connect');
    };

    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "none";
    }
}

export function buildConnection(url) {
    // var option = {
    //     accessTokenFactory: () => 'YOUR ACCESS TOKEN TOKEN HERE'
    //   };
    var option = {
        
      };



    connection = new signalR.HubConnectionBuilder()
                    .withUrl(url, option)
                    .build();
}

export function start() {

    connection
        .start()
        .then(function () {
            console.log('Connected');
            //document.querySelector("#txt-output-area").value +=  "Connected..." + '\n'
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
}

export function connectToServer(url) {
    buildConnection(url);
    start();
}

export function OnConnect() {
    var url = document.getElementById("inputUrl").value;
    connectToServer(url);
    console.log("OnConnect");
    isConnected = true;
    var onConnectClass = document.getElementsByClassName('onconnect');
    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "block";
    }

    AdvanceViewElements(isAdvanceView);
    //Hide Connect Button
    DisableElementByClassName('connectbtn')

    //Receive Data
    //Reading the raw response
    storeFunc = connection.processIncomingData;
    connection.processIncomingData = function (data) {
        console.log('111111111111xxxxxxxxxxxx'+ data);
        storeFunc.call(connection, data);
    }
    connection.on("ReceiveData", function (data) {
        document.querySelector("#inputResponseData").value += JSON.stringify(data) + '\n';
    });

    AddArguments();
}

export function SetConnectionProtocol()
{
    // var anyCheckbox = document.getElementById("txt-chk-any");

    // if(anyCheckbox.checked === true)
    // {
    //     return;
    // }

    //Start work from here.
    var counter = 0;
    var elements = document.querySelectorAll(".lst-con-protocol");

    for(var i = 0; i < elements.length; i++)
    {
        if(elements[i].value === "ws" && elements[i].checked !== true)
        {
            console.log("WebSocket disabled");
            WebSocket = undefined;
            counter++;
        }
        else if(elements[i].value === "sse" && elements[i].checked !== true)
        {
            console.log("Server Sent Event disabled");
            EventSource = undefined;
            counter++;
        }
        else if(elements[i].value === "lp" && elements[i].checked !== true)
        {
            //console.log("Server Sent Event disabled");
            //EventSource = undefined;
            counter++;
        }
    }


    // if(counter === 0)
    // {
    //     anyCheckbox.checked = true;
    // }
    // else
    // {
    //     anyCheckbox.checked = false;
    // }
}

export function DisableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true;
    }
}

export function EnableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = false;
    }
}

export function OnDisConnect() {
    console.log("OnDisConnect");
    isConnected = false;
    Disconnect();
    var onDisConnectClass = document.getElementsByClassName('disconnectbtn');
    var addEventOnDisconnect = function () {
        console.log('btn disconnect');
    };

    for (var i = 0; i < onDisConnectClass.length; i++) {
        onDisConnectClass[i].style.display = "block";
    }

    Reset();
    EnableElementByClassName('connectbtn');
    NotConnected();
}

export function Reset() {
    //Clear Server Method Text
    document.getElementById('inputServerMethod').value = "";

    
    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].removeEventListener('click', AddArgumentsCallBack, false);
    }
    document.getElementById('method-arguments').innerHTML = "";
    inputResponseData.value = "";
}

export function Disconnect() {
    connection.stop()
        .then(function () {
            console.log('Disconnected');
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
}

export function SendPayload() {

    var methodName = document.getElementById("inputServerMethod").value;
    var methodArguments = new Array();

    methodArguments = ReadAndFormatArguments();

    connection.invoke(methodName, ...methodArguments)
        .catch(function (err) {
            return console.log(err);
        });
}