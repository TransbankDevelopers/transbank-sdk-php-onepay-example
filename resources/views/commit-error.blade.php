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
<h3>Ha ocurrido un error en tu pago:</h3>
<table>
    <tr>
        <td>OCC:</td>
        <td>{{ $occ }} </td>
    </tr>
    <tr>
        <td>Número de carro:</td>
        <td>{{ $externalUniqueNumber }} </td>
    </tr>
    <tr>
        <td>Status:</td>
        <td>{{ $status }} </td>
    </tr>
</table>
</body>
</html>
