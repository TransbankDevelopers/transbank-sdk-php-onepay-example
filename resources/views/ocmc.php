<?php
    if($_POST) var_dump($_POST);
    if($_GET) var_dump($_GET);
?>
<!DOCTYPE html>
<!--[if lt IE 7 ]><html lang="en" class="no-js ie6"><![endif]-->
<!--[if IE 7 ]><html lang="en" class="no-js ie7"><![endif]-->
<!--[if IE 8 ]><html lang="en" class="no-js ie8"><![endif]-->
<!--[if IE 9 ]><html lang="en" class="no-js ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="en" class="no-js"><!--<![endif]-->
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta charset="utf-8">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                var contextChange = function (url, params) {
                    console.log('contextChange');
                    var form = $('<form>');
                    form.attr('method', 'POST');
                    form.attr('action', url);

                    $.each(params, function (key, value) {
                        var input = $('<input>');
                        input.attr('type', 'hidden');
                        input.attr('name', key);
                        input.attr('value', value);
                        form.append(input);
                    });

                    var submitInput = $('<input>');
                    submitInput.attr('type', 'submit');
                    submitInput.attr('name', 'submitInput');
                    submitInput.attr('value', 'submitInput');
                    submitInput.css('display', 'none');

                    form.append(submitInput);

                    $('body').append(form);
                    form.submit();
                };


                $('#send').on('click', function(){
                    console.log('click');
                    var params = {'TBK_TOKEN': $('#token').val()};
//                    var url = 'https://webpay3gdesa.transbank.cl/filtroUnificado/bp_multicode_inscription.cgi';
                    var url = 'https://web2desa.test.transbank.cl:9443/webpayserver/bp_multicode_inscription.cgi';
                    contextChange(url, params);
                });
            });
        </script>
    </head>
    <body>
        <input id="token" type="text">
        <input id="send" type="button" value="Registrar medio de pago">
    </body>
</html>
