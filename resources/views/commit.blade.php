<!DOCTYPE html>
<!--[if lt IE 7 ]><html lang="en" class="no-js ie6"><![endif]-->
<!--[if IE 7 ]><html lang="en" class="no-js ie7"><![endif]-->
<!--[if IE 8 ]><html lang="en" class="no-js ie8"><![endif]-->
<!--[if IE 9 ]><html lang="en" class="no-js ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="en" class="no-js"><!--<![endif]-->
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="utf-8">
</head>
<body>
<table>
    <tr>
        <td>OCC:</td>
        <td>{{ $transactionCommitResponse->getOcc() }} </td>
    </tr>
    <tr>
        <td>Número de carro:</td>
        <td>{{ $externalUniqueNumber }} </td>
    </tr>
    <tr>
        <td>Código de autorización:</td>
        <td> {{ $transactionCommitResponse->getAuthorizationCode() }}</td>
    </tr>
    <tr>
        <td>Orden de compra:</td>
        <td>{{ $transactionCommitResponse->getBuyOrder() }}</td>
    </tr>
    <tr>
        <td>Descripción:</td>
        <td> {{ $transactionCommitResponse->getDescription() }}</td>
    </tr>
    <tr>
        <td>Monto compra:</td>
        <td>{{ $transactionCommitResponse->getAmount() }}</td>
    </tr>
    <tr>
        <td>Numero de cuotas:</td>
        <td>{{ $transactionCommitResponse->getInstallmentsNumber() }}</td>
    </tr>
    <tr>
        <td>Monto cuota:</td>
        <td>{{ $transactionCommitResponse->getInstallmentsAmount() }}</td>
    </tr>
    <tr>
        <td>Fecha:</td>
        <td> {{ $transactionCommitResponse->getIssuedAt() }} </td>
    </tr>
    <tr>
        <td>Anulación</td>
        <td>
            <a href='/refund/?amount={{urlencode($transactionCommitResponse->getAmount())}}&occ={{urlencode($transactionCommitResponse->getOcc())}}&externalUniqueNumber={{urlencode($externalUniqueNumber)}}&authorizationCode={{urlencode($transactionCommitResponse->getAuthorizationCode())}}'
                            >Anular esta compra</a>
        </td>
    </tr>
</table>
</body>
</html>
