$(document).ready(function () {
    var cryptoPaymentRates = JSON.parse($("#cryptopayment_type").attr("data-rates") || "{}");
    $("body").css("overflow-y", "auto");
    var selectedCryptoPaymentOption = $("#cryptopayment_type option:selected");
    var cryptoEmailInput = document.querySelector("#cryptopayment_email_address");
    var cvv2Input = document.querySelector("#oneclick_cvv2_field");
    $("#oneclick_cvv2").hide();
    $("#cryptopayment_input_type").text(selectedCryptoPaymentOption.text());
    var cryptoTokenAmount = $("#cryptopayment_tokens");

    function calculateCryptopaymentCost() {
        $("#cryptopaymentInstructions").show();
        if (cryptopayment_spending_limit_reached === "True") {
            $("input[type=submit]").attr('disabled', 'disabled');
            return
        }

        var tokens = Number(cryptoTokenAmount.val());
        var btcRate = parseFloat(cryptopayment_btc_rate);
        var coin = $("#cryptopayment_type option:selected");
        var coinRate = parseFloat(cryptoPaymentRates[coin.attr("value")]["rate_btc"]);

        var numberDecimalPlaces = 1000000;
        var cost = Math.round(tokens * .08 * btcRate / coinRate * numberDecimalPlaces) / numberDecimalPlaces;
        if (isNaN(cost)) {
            cost = "--";
        }

            $("#cryptopayment_tokens").focus();
            $("#cryptopayment_estimated_cost").text(cost);

        $("#cryptopayment_estimated_cost").prop("title", "~ " + cost);
        $("#cc_button").show();
    }
    function updateSubmit() {
        var ccSubmitBtn = $("#cc_button input");
        if ($("form")[0].checkValidity()) {
            ccSubmitBtn.prop('disabled', false);
        } else {
            ccSubmitBtn.prop('disabled', true);
        }
    }
    function updateForm(event) {
        $("#cryptopayment_email_address").prop('disabled', true);
        $("#cryptopayment_tokens").prop('disabled', true);
        $("#oneclick_cvv2_field").prop('disabled', true);
        var paymenttype = $("input[name=payMethod]:checked").val();
        $("#cc_button").hide();
        $("#oneclick_cvv2").hide();
        $("#ccInstructions").hide();
        $("#ccInstructionsEpoch").hide();
        $("#ccInstructionsSBW").hide();
        $("#ccInstructionsCcbill").hide();
        $("#creditcardOptions").show();
        $("#wireInstructions").hide();
        $("#referInstructions").hide();
        $("#ccInstructionsPaypalEpoch").hide();
        $("#cryptopaymentInstructions").hide();
        $("#alternativePaymentsInstructions").hide();
        var ccSubmitBtn = $("#cc_button input");

            ccSubmitBtn.val(gettext("Continue to payment page"));

        if (paymenttype == 'oneclick') {
            $("#cc_button").show();
            $("#ccInstructions").show();
            $("#oneclick_cvv2").show();
            $("#oneclick_cvv2_field").prop('disabled', false);

        } else if (paymenttype == 'creditcard') {
            $("#cc_button").show();
            $("#ccInstructions").show();
        } else if (paymenttype == 'creditcard') {
            $("#cc_button").show();
            $("#ccInstructions").show();
        } else if (["Sofort", "Ideal", "Paysafecard", "Poli", "Giropay"].indexOf(paymenttype) > -1) {
            $("#cc_button").show();
            $("#alternativePaymentsInstructions").show();
        } else if (paymenttype == 'wire') {
            $("#wireInstructions").show();
        } else if (paymenttype == 'creditcardepoch') {
            $("#ccInstructionsEpoch").show();
            $("#cc_button").show();
        } else if (paymenttype == 'epochoneclick') {
            $("#ccInstructionsEpoch").show();
            $("#cc_button").show();
        } else if (paymenttype == 'paypalepoch' || paymenttype == 'paypalepochoneclick') {
            $("#ccInstructionsPaypalEpoch").show();
            $("#cc_button").show();
        } else if (paymenttype == 'creditcardsbw' || paymenttype == 'sbwoneclick') {
            $("#ccInstructionsSBW").show();
            $("#cc_button").show();
        } else if (paymenttype == 'creditcardccbill') {
            $("#ccInstructionsCcbill").show();
            $("#cc_button").show();
        } else if (paymenttype == 'cryptopayment') {
            calculateCryptopaymentCost();
            $("#cryptopayment_email_address").prop('disabled', false);
            $("#cryptopayment_tokens").prop('disabled', false);
        } else if (paymenttype == 'refer') {
            $("#referInstructions").show();
        }
        if (event && event.target) {
            var tokens = $(event.target).data('tokens');
            if (tokens) {
                $("input[data-tokens='" + tokens + "']").attr('checked', 'checked');
            }
        }

    }
    var codes = [];
    var total_expected_pi_codes = 0;
    $(".products.epoch input[type='radio']").each(function(){
        if (this.value) {
            codes.push(this.value);
            total_expected_pi_codes++;
        }
    });
    if(total_expected_pi_codes > 0) {
        $.ajax({
            url: purchase_tokens_url,
            type: 'GET',
            data: {pi_codes: JSON.stringify(codes)},
            success: function (data) {
                if (data.total === total_expected_pi_codes) {
                    for (var key in data.prices) {
                        if (data.prices.hasOwnProperty(key)) {
                            var localPrice = data.prices[key];
                            localPrice = localPrice.replace(/^([\w]+)(.*)$/, '$2 $1');
                            $(".products.epoch .product-" + key + " span:first").html(localPrice);
                        }
                    }
                }
            },
            complete: function () {
                $(".epoch_loading").hide();
                $(".epochOptions").show();
            },
        });

    }
    $("#referrallinkcode").live('click', function () {
        $('#referrallinkcode').focus();
        $('#referrallinkcode').select();
    });

    function handleIframeCryptoForm(form){
        var postSuccess = false;
        var redirectUrl;
        var $cryptoFormWrapper = $(".cryptoFormWrapper");
        $.ajax({
            url: '../Blog/paymentpage.html' + '',
            type: 'POST',
            data: form.serialize(),
            success: function (data) {
                redirectUrl = data['redirect_url'];
                if (redirectUrl) {
                    postSuccess = true;
                    if (window.location !== window.parent.location) {
                        window.open(redirectUrl, '_blank', 'status=0,toolbar=0,menubar=0,directories=0,resizable=1,scrollbars=1,height=950,width=780');
                        window.parent.postMessage("close", "*");
                    } else {
                        window.location.href = redirectUrl;
                    }
                    return
                }
                window.parent.postMessage("crypto-error", "*");
                updateForm();
                $("input").removeAttr('readonly');
                var formErrors = data['errors'];
                if (formErrors !== undefined) {
                    var emailError = formErrors['email_field'];
                    if (emailError !== undefined && emailError.length > 0) {
                        $(".cryptoEmail.field").addClass("crypto-error");
                        $(".cryptoEmail .field-error").html(emailError[0]);
                    }
                    var typeError = formErrors['type_field'];
                    if (typeError !== undefined && typeError.length > 0) {
                        $(".cryptoType.field").addClass("crypto-error");
                        $(".cryptoType .field-error").html(typeError[0]);
                    }
                    var tokensError = formErrors['amount_field'];
                    if (tokensError !== undefined && tokensError.length > 0) {
                        $(".cryptoAmount").addClass("crypto-error");
                        $(".cryptoAmount .field-error").html(tokensError[0]);
                    }
                    var nonFieldError = formErrors['__all__'];
                    if (nonFieldError !== undefined && nonFieldError.length > 0) {
                        $cryptoFormWrapper.prepend($("<div>").addClass("message").html(nonFieldError[0]));
                    }
                    return
                }
                $cryptoFormWrapper.prepend($("<div>").addClass("message").html(
                    "Token purchases with contrib payment is currently unavailable. Please try again later."
                ));
            },
        });
    }

    $("form").submit(function (e) {
        var paymenttype = $("input[name=payMethod]:checked").val();
        $("input[type=submit]").val('Processing . . .');
        $("input").attr('readonly', 'readonly');
        $("input[type=submit]").attr('disabled', 'disabled');

        return true;
    });
    $("input[name=payMethod]").change(updateForm);
    $("input[name=productID]").change(updateForm);
    $("input[name=productIDEpoch]").change(updateForm);
    $("input[name=productIDPaypalEpoch]").change(updateForm);
    $("input[name=productIDCcbill]").change(updateForm);
    $("input[name=productIDSBW]").change(updateForm);
    $("input[name=productIDSofort]").change(updateForm);


    $("#cryptopayment_type").change(function() {
        var selectedCryptoPaymentOption = $("#cryptopayment_type option:selected");
        $("#cryptopayment_input_type").text(selectedCryptoPaymentOption.text());

            $("#cryptopayment_type_name").text(selectedCryptoPaymentOption.text());

        $(".cryptoType").removeClass("crypto-error");
    });
    $("#cryptopayment_type").change(calculateCryptopaymentCost);
    cryptoTokenAmount.keyup(calculateCryptopaymentCost);
    cryptoTokenAmount.change(function() {
        $(".cryptoAmount").removeClass("crypto-error");
        calculateCryptopaymentCost();
    });
    $(window).bind("load", function(event) {
        // this breaks if the user arrives at the page using the browser back button unless we fire it here
        updateForm();
        if (event.originalEvent.persisted) {
            $("input[type=submit]").val('Continue to payment page');
            $("input").prop('readonly', false);
            $("input[type=submit]").prop('disabled', false);
        }
    });


});
