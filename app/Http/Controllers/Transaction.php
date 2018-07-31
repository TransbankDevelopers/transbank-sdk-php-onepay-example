<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Transbank\Onepay\OnepayBase;
use Transbank\Onepay\ShoppingCart;
use Transbank\Onepay\Item;
use Transbank\Onepay\Transaction;
use Transbank\Onepay\Options;
use Transbank\Onepay\Refund;

class TransactionController extends Controller
{

    public function sendTransaction(Request $request)
    {
       OnepayBase::setCurrentIntegrationType("TEST");
       $jsonData = json_decode('{"items":[{"amount":36000,"quantity": 1,"description":"Fresh Strawberries"},{"amount":16000,"quantity":1,"description":"Lightweight Jacket"}]}', true);
       $shoppingCart = ShoppingCart::fromJSON($jsonData);

       # If OnepayBase::setApiKey() and/or Onepay::setSharedSecret()
       # haven't been called, the SDK will take the values from the
       # ONEPAY_API_KEY and ONEPAY_SHARED_SECRET environment variables

       $transactionCreateResponse = Transaction::create($shoppingCart);
       return json_encode($transactionCreateResponse);
    }

    public function commit(Request $request)
    {
        $occ = $request->input("occ");
        $externalUniqueNumber = $request->input("externalUniqueNumber");

        # You can also set the ApiKey & sharedSecret to use on OnepayBase
        OnepayBase::setSharedSecret(env("ONEPAY_SHARED_SECRET"));
        OnepayBase::setApiKey(env("ONEPAY_API_KEY"));

        $transactionCommitResponse = Transaction::commit($occ, $externalUniqueNumber);

        return view('commit', ["transactionCommitResponse" => $transactionCommitResponse,
                               "externalUniqueNumber" => $externalUniqueNumber]);
    }

    public function refund(Request $request)
    {


       # Additionally you can use the Options object to override your
       # ONEPAY_API_KEY and ONEPAY_SHARED_SECRET. In this example we have used
       # the same values
       $options = new Options(
        env("ONEPAY_API_KEY"),
        env("ONEPAY_SHARED_SECRET")
      );
        $amount = $request->query('amount');
        $occ = $request->query('occ');
        $externalUniqueNumber = $request->query('externalUniqueNumber');
        $authorizationCode = $request->query('authorizationCode');

        $refundResponse = Refund::create($amount, $occ, $externalUniqueNumber,
                                        $authorizationCode, $options);

        return view('refund', ["refundResponse" => $refundResponse]);
    }
}
