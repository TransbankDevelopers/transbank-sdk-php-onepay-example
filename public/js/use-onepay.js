function showLoadingImage() {
    var html = document.getElementById("qr");
    html.innerHTML = "";
    var loading = new Image(200, 200);
    loading.src = "./images/loading.gif";
    html.appendChild(loading);
}

function sendPostRedirect(destination, params) {
    console.log("sendpost redirect")
    var form = document.createElement('form');

    form.method = 'POST';
    form.action = destination;

    Object.keys(params).forEach(function (key) {
        var  param = document.createElement('input');

        param.type = 'hidden';
        param.name = key;
        param.value = params[key];
        form.appendChild(param);
    });

    var submit = document.createElement('input');

    submit.type = 'submit';
    submit.name = 'submitButton';
    submit.style.display = 'none';

    form.appendChild(submit);
    document.body.appendChild(form);
    form.submit();
};


function transactionCreate() {
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
                    sendPostRedirect("/commit", params);
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

