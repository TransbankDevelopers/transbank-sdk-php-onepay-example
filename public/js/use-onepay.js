function showLoadingImage() {
    let html = document.getElementById("qr");
    html.innerHTML = "";
    let loading = new Image(200, 200);
    loading.src = "./images/loading.gif";
    html.appendChild(loading);
}

function transactionCreate() {
    showLoadingImage();

    $.ajax({
        type: "POST",
        url: "/api/transaction",
        success: function(data) {
            // convert json to object
            let transaction = JSON.parse(data);
            transaction["paymentStatusHandler"] = {
                ottAssigned: function () {
                    // callback when transaction is assigned
                    console.log("Transacción asignada.");
                    showLoadingImage();
                },
                authorized: function (occ, externalUniqueNumber) {
                    // callback when the transaction is authorized by the user
                    console.log("occ : " + occ);
                    console.log("externalUniqueNumber : " + externalUniqueNumber);

                    let params = {
                        occ: occ,
                        externalUniqueNumber: externalUniqueNumber
                    };
                    let httpUtil = new HttpUtil();
                    httpUtil.sendPostRedirect("./commit", params);
                }
            };

            let onepay = new Onepay(transaction);
            onepay.drawQrImage("qr");
        },
        error: function (data) {
            console.log("something is going wrong");
        }
    });
}
