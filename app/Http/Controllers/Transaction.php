<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Transbank;
use Transbank\OnePay;
use Transbank\ShoppingCart;
use Transbank\Item;
use Transbank\Transaction;
use Transbank\Options;
use Transbank\Refund;

class TransactionController extends Controller
{
    //
    public function sendTransaction(Request $request)
    {
       OnePay::setIntegrationType("TEST");
       $jsonData = json_decode('{"items":[{"amount":"36000","quantity":"1","description":"Fresh Strawberries"},{"amount":"16000","quantity":"1","description":"Lightweight Jacket"}]}', true);
       $shoppingCart = new ShoppingCart();

       foreach($jsonData["items"] as $item) {

        $description = $item["description"];
        $amount = (int)$item["amount"];
        $quantity = (int)$item["quantity"];

        OnePay::setCallbackUrl("fakeurl");
        // These last 2 will be set by default later
        $additionalData = null;
        $expire = 0;

        $itemModel = new Item($description, $quantity, $amount, $additionalData, $expire);
        $shoppingCart->add($itemModel);
       }

       $options = new Options(
           env("ONEPAY_API_KEY"),
           env("ONEPAY_APP_KEY"),
           env("ONEPAY_SHARED_SECRET")
       );

       $transactionCreateResponse = Transaction::create($shoppingCart, $options);
       # echo(var_dump($transactionCreateResponse));
       return json_encode($transactionCreateResponse);
    }

    public function commit(Request $request)
    {

        $occ = $request->input("occ");
        $externalUniqueNumber = $request->input("externalUniqueNumber");
        $options = new Options(
            env("ONEPAY_API_KEY"),
            env("ONEPAY_APP_KEY"),
            env("ONEPAY_SHARED_SECRET")
        );

        $transactionCommitResponse = json_encode(Transaction::commit($occ, $externalUniqueNumber, $options));
        return view('commit', ["transactionCommitResponse" => json_decode($transactionCommitResponse, true),
                               "externalUniqueNumber" => $externalUniqueNumber]);
    }

    public function refund(Request $request)
    {

        $amount = $request->query('amount');
        $occ = $request->query('occ');
        $externalUniqueNumber = $request->query('externalUniqueNumber');
        $authorizationCode = $request->query('authorizationCode');
        $options = new Options(
            env("ONEPAY_API_KEY"),
            env("ONEPAY_APP_KEY"),
            env("ONEPAY_SHARED_SECRET")
        );


        $refundRequest = Refund::create($amount, $occ, $externalUniqueNumber,
                                        $authorizationCode, $options);

        return json_encode($refundRequest);

    }

}
