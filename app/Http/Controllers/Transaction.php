<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Transbank\Onepay\OnepayBase;
use Transbank\Onepay\ShoppingCart;
use Transbank\Onepay\Item;
use Transbank\Onepay\Transaction;
use Transbank\Onepay\Options;
use Transbank\Onepay\Refund;
use Transbank\OnePay\Exceptions\RefundCreateException;

class TransactionController extends Controller
{

    public function sendTransaction(Request $request)
    {
       $jsonData = json_decode('{"items":[{"amount":36000,"quantity": 1,"description":"Fresh Strawberries"},{"amount":16000,"quantity":1,"description":"Lightweight Jacket"}]}', true);
       $shoppingCart = ShoppingCart::fromJSON($jsonData);

       # If OnepayBase::setApiKey() and/or Onepay::setSharedSecret()
       # haven't been called, the SDK will take the values from the
       # ONEPAY_API_KEY and ONEPAY_SHARED_SECRET environment variables
       # In this project, these variables are set with demo keys in
       #the .env file on the projects root directory

       $transactionCreateResponse = Transaction::create($shoppingCart);

       $response = array();
       $response["occ"] = $transactionCreateResponse->getOcc();
       $response["ott"] = $transactionCreateResponse->getOtt();
       $response["externalUniqueNumber"] = $transactionCreateResponse->getExternalUniqueNumber();
       $response["qrCodeAsBase64"] = $transactionCreateResponse->getQrCodeAsBase64();
       $response["issuedAt"] = $transactionCreateResponse->getIssuedAt();
       $response["amount"] = $shoppingCart->getTotal();

       return json_encode($response);
    }

    public function commit(Request $request)
    {
        $status = $request->input("status");
        $occ = $request->input("occ");
        $externalUniqueNumber = $request->input("externalUniqueNumber");

        if (!empty($status) && strcasecmp($status,"PRE_AUTHORIZED") != 0) {
            return view('commit-error', ["occ" => $occ,
                "externalUniqueNumber" => $externalUniqueNumber,
                "status" => $status]);
        }

        $transactionCommitResponse = Transaction::commit($occ, $externalUniqueNumber);

        return view('commit', ["transactionCommitResponse" => $transactionCommitResponse,
                               "externalUniqueNumber" => $externalUniqueNumber]);
    }

    public function refund(Request $request)
    {
        $amount = $request->query('amount');
        $occ = $request->query('occ');
        $externalUniqueNumber = $request->query('externalUniqueNumber');
        $authorizationCode = $request->query('authorizationCode');

        try {
            $refundResponse = Refund::create($amount, $occ, $externalUniqueNumber,
                                             $authorizationCode);
        } catch(RefundCreateException $e) {
            return $e->getMessage();
        }

        return view('refund', ["refundResponse" => $refundResponse]);
    }
}
