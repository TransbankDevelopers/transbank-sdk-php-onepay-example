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
<h3>Transacción anulada!</h3>
<table>
    <tr>
        <td>OCC: </td>
        <td>{{ $refundResponse->getOcc() }} </td>
    </tr>
    <tr>
        <td>External Unique Number:</td>
        <td>{{ $refundResponse->getExternalUniqueNumber() }} </td>
    </tr>
    <tr>
        <td>Código de reversa:</td>
        <td> {{ $refundResponse->getReverseCode() }}</td>
    </tr>
    <tr>
        <td>Issued At:</td>
        <td>{{ $refundResponse->getIssuedAt() }}</td>
    </tr>
    <tr>
        <td>Firma:</td>
        <td> {{ $refundResponse->getSignature() }} </td>
    </tr>
</table>
</body>
</html>
