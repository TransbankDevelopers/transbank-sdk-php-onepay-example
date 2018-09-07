function showLoadingImage() {
    var html = document.getElementById("qr");
    html.innerHTML = "";
    var loading = new Image(200, 200);
    loading.src = "./images/loading.gif";
    html.appendChild(loading);
}

function doQrDirecto() {
    showLoadingImage();
    $.ajax({
        type: "POST",
        url: "/api/transaction",
        async: true,
        success: function(data) {
            // convert json to object
            var transaction = JSON.parse(data);
            transaction["paymentStatusHandler"] = {
                ottAssigned: function () {
                    // callback transacción asinada
                    console.log("Transacción asignada.");
                    showLoadingImage();
                },
                authorized: function (occ, externalUniqueNumber) {
                    // callback transacción autorizada
                    console.log("occ : " + occ);
                    console.log("externalUniqueNumber : " + externalUniqueNumber);
                    var params = {
                        occ: occ,
                        externalUniqueNumber: externalUniqueNumber
                    };
                    sendGetRedirect("/commit", params);
                },
                canceled: function () {
                    // callback rejected by user
                    console.log("transacción cancelada por el usuario");
                    onepay.drawQrImage("qr");
                },
                authorizationError: function () {
                    // cacllback authorization error
                    console.log("error de autorizacion");
                },
                unknown: function () {
                    // callback to any unknown status recived
                    console.log("estado desconocido");
                }
            };
            var onepay = new Onepay(transaction);
            onepay.drawQrImage("qr");
        },
        error: function (data) {
            console.log("something is going wrong");
        }
    });
}

function sendGetRedirect (destination, params) {
    let keys = Object.keys(params);
    let urlParams = keys.map(function (param) {
        return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
    }).join('&');
    window.location = destination + '?' + urlParams;
}

function doCheckout() {
    var options = {
        endpoint: '/api/transaction',
        commerceLogo: 'https://cdn.rawgit.com/TransbankDevelopers/transbank-sdk-php-onepay-example/014ea5c2/public/images/icons/logo-01.png',
        callbackUrl: '/commit'
    };

    Onepay.checkout(options);
}

