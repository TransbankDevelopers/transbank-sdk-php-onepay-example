// Create an immediately invoked functional expression to wrap our code
(function () {
    let root = this;

    // MQTT
    let SOCKET_CREDENTIALS_URL = 'https://w7t4h1avwk.execute-api.us-east-2.amazonaws.com/dev/onepayjs/auth/keys';

    let utils = new Utils();
    let httpUtil = new HttpUtil();

    root.Onepay = function (transaction) {
        this.transaction = transaction;
        console.log(this.transaction);
        if (!this.transaction) {
            console.log("transaction does not exist in object param");
            return;
        }
        if (!this.transaction["qrCodeAsBase64"]) {
            console.log("qrCodeAsBase64 does not exist in object param");
            return;
        }
        if (!this.transaction["ott"]) {
            console.log("ott does not exist in object param");
            return;
        }

        this.qrCodeAsBase64 = transaction.qrCodeAsBase64;
    };

    Onepay.prototype.drawQrImage = function (htmlTagId) {
        let onepay = this;
        let socketSubscribePromise = new Promise((resolve, reject) => {
            let socket = new OnepayWebSocket(onepay.transaction);
            socket.connect(() =>{resolve()});
        });
        socketSubscribePromise.then(function () {
            let qrImage = new Image();
            qrImage.src = " data:image/png;charset=utf-8;base64," + onepay.qrCodeAsBase64;
            let html = document.getElementById(htmlTagId);
            html.innerHTML = "";
            html.appendChild(qrImage);
        });
    };

    function OnepayWebSocket (transaction) {
        this.transaction = transaction;
    }

    OnepayWebSocket.prototype.getCredentials = function (callback) {
        console.log("getting aws credentials");
        let httpRequest = httpUtil.getHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    let data = {};
                    try {
                        data = JSON.parse(httpRequest.responseText);
                        callback(data);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }

        };
        httpRequest.open("GET", SOCKET_CREDENTIALS_URL);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send();
    };

    OnepayWebSocket.prototype.connect = function (onSubscribe) {
        console.log("connecting to websocket");
        let onepayWebSocket = this;
        this.getCredentials(function (data) {
            data["clientId"] = utils.createUuidv4();
            data["endpoint"] = data.iotEndpoint;
            data["regionName"] = data.region;

            let client = new MQTTClient(data);
            client.on("connected", function () {
                console.log("websocket is now connected");
                client.subscribe(String(onepayWebSocket.transaction.ott));
            });
            client.on("subscribeSucess", function () {
               console.log("client has been subscribed");
                onSubscribe();
            });
            client.on("messageArrived", function (msg) {
               console.log("new message has arrived");
                onepayWebSocket.handleEvents(msg, client, onepayWebSocket.transaction.paymentStatusHandler);
            });
            client.on("connetionLost", function () {
                console.log("websocket has been disconnected");
            });
            client.connect();
        });
    };

    OnepayWebSocket.prototype.handleEvents = function (msg, client, paymentStatusHandler) {
        console.log("new event listened");
        let message = new ReceivedMsg(msg);
        console.log(message);

        let data = {};
        let status = null;
        let description = null;

        try {
            data = JSON.parse(message.content);
            status = data.status;
            description = data.description;
        } catch (e) {
            console.log("json parser has failed");
            console.log(e);
        }

        switch (status) {
            case "OTT_ASSIGNED":
                console.log("OTT_ASSIGNED");
                try {
                    paymentStatusHandler.ottAssigned();
                } catch (e) {}
                break;
            case "AUTHORIZED":
                console.log("AUTHORIZED");
                try {
                    paymentStatusHandler.authorized(this.transaction.occ, this.transaction.externalUniqueNumber);
                } catch (e) {}
                client.disconnect();
                break;
            case "REJECTED_BY_USER":
                console.log("REJECTED_BY_USER");

                client.disconnect();
                break;
            case "AUTHORIZATION_ERROR":
                console.log("AUTHORIZATION_ERROR");

                client.disconnect();
                break;
            default:
                console.log("default catch");

                client.disconnect();
                break;
        }
    };


    function Utils () {}

    Utils.prototype.createUuidv4 = function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
            return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
    };

    Utils.prototype.getHttpRequest = function () {
        if (window.XMLHttpRequest)
            return new XMLHttpRequest();

        return ActiveXObject("Microsoft.XMLHTTP");
    };













    /**
     * wrapper of received paho message
     * @class
     * @param {Paho.MQTT.Message} msg
     */
    function ReceivedMsg(msg) {
        this.msg = msg;
        this.content = msg.payloadString;
    }

    /**
     * AWS IOT MQTT Client
     * @class MQTTClient
     * @param {Object} options - the client options
     * @param {string} options.endpoint
     * @param {string} options.regionName
     * @param {string} options.accessKey
     * @param {string} options.secretKey
     * @param {string} options.clientId
     * @param {string} options.sessionToken
     */
    function MQTTClient(options) {
        this.options = options;

        this.endpoint = this.computeUrl();
        console.log(this.endpoint);
        this.clientId = options.clientId;
        this.name = this.clientId + '@' + options.endpoint;
        this.connected = false;
        this.client = new Paho.MQTT.Client(this.endpoint, this.clientId);
        this.listeners = {};
        var self = this;
        this.client.onConnectionLost = function () {
            self.emit('connectionLost');
            self.connected = false;
        };
        this.client.onMessageArrived = function (msg) {
            self.emit('messageArrived', msg);
        };
        this.on('connected', function () {
            self.connected = true;
        });
    };

    /**
     * compute the url for websocket connection
     * @private
     *
     * @method     MQTTClient#computeUrl
     * @return     {string}  the websocket url
     */
    MQTTClient.prototype.computeUrl = function () {
        // must use utc time
        var time = moment.utc();
        var dateStamp = time.format('YYYYMMDD');
        var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
        var service = 'iotdevicegateway';
        var region = this.options.regionName;
        var secretKey = this.options.secretKey;
        var accessKey = this.options.accessKey;
        var algorithm = 'AWS4-HMAC-SHA256';
        var method = 'GET';
        var canonicalUri = '/mqtt';
        var host = this.options.endpoint;

        var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
        var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
        canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
        canonicalQuerystring += '&X-Amz-Date=' + amzdate;
        canonicalQuerystring += '&X-Amz-Expires=86400';
        canonicalQuerystring += '&X-Amz-SignedHeaders=host';

        var canonicalHeaders = 'host:' + host + '\n';
        var payloadHash = SigV4Utils.sha256('');
        var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

        var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
        var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
        var signature = SigV4Utils.sign(signingKey, stringToSign);

        canonicalQuerystring += '&X-Amz-Signature=' + signature;
        canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(this.options.sessionToken);
        var requestUrl = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
        return requestUrl;
    };

    /**
     * listen to client event, supported events are connected, connectionLost,
     * messageArrived(event parameter is of type Paho.MQTT.Message), publishFailed,
     * subscribeSucess and subscribeFailed
     * @method     MQTTClient#on
     * @param      {string}  event
     * @param      {Function}  handler
     */
    MQTTClient.prototype.on = function (event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);
    };

    /** emit event
     *
     * @method MQTTClient#emit
     * @param {string}  event
     * @param {...any} args - event parameters
     */
    MQTTClient.prototype.emit = function (event) {
        var listeners = this.listeners[event];
        if (listeners) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                listener.apply(null, args);
            }
        }
    };

    /**
     * connect to AWS, should call this method before publish/subscribe
     * @method MQTTClient#connect
     */
    MQTTClient.prototype.connect = function () {
        var self = this;
        var connectOptions = {
            onSuccess: function () {
                self.emit('connected');
            },
            useSSL: true,
            timeout: 3,
            mqttVersion: 4,
            onFailure: function () {
                self.emit('connectionLost');
            }
        };
        this.client.connect(connectOptions);
    };

    /**
     * disconnect
     * @method MQTTClient#disconnect
     */
    MQTTClient.prototype.disconnect = function () {
        this.client.disconnect();
    };

    /**
     * publish a message
     * @method     MQTTClient#publish
     * @param      {string}  topic
     * @param      {string}  payload
     */
    MQTTClient.prototype.publish = function (topic, payload) {
        try {
            var message = new Paho.MQTT.Message(payload);
            message.destinationName = topic;
            this.client.send(message);
        } catch (e) {
            this.emit('publishFailed', e);
        }
    };

    /**
     * subscribe to a topic
     * @method     MQTTClient#subscribe
     * @param      {string}  topic
     */
    MQTTClient.prototype.subscribe = function (topic) {
        var self = this;
        try {
            this.client.subscribe(topic, {
                onSuccess: function () {
                    self.emit('subscribeSucess');
                },
                onFailure: function () {
                    self.emit('subscribeFailed');
                }
            });
        } catch (e) {
            this.emit('subscribeFailed', e);
        }

    };



    /**
     * utilities to do sigv4
     * @class SigV4Utils
     */
    function SigV4Utils() {
    }

    SigV4Utils.sign = function (key, msg) {
        var hash = CryptoJS.HmacSHA256(msg, key);
        return hash.toString(CryptoJS.enc.Hex);
    };

    SigV4Utils.sha256 = function (msg) {
        var hash = CryptoJS.SHA256(msg);
        return hash.toString(CryptoJS.enc.Hex);
    };

    SigV4Utils.getSignatureKey = function (key, dateStamp, regionName, serviceName) {
        var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
        var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
        var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
        var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
        return kSigning;
    };
}());


function HttpUtil () {}

HttpUtil.prototype.getHttpRequest = function () {
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();

    return ActiveXObject("Microsoft.XMLHTTP");
};

HttpUtil.prototype.sendPostRedirect = function (destination, params) {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = destination;

    Object.keys(params).forEach(function (key) {
        let param = document.createElement("input");
        param.type = "hidden";
        param.name = key;
        param.value = params[key];
        console.log(param);
        form.appendChild(param);
    });
    //if (destination) return;

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.name = "submitButton";
    submit.style.display = "none";

    form.appendChild(submit);
    document.body.appendChild(form);
    form.submit();
};
