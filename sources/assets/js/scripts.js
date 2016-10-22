/*jshint multistr: true */
window.ondomContentLoaded = (function() {
    var xmlhttp = new XMLHttpRequest(),
        url = "assets/json/cart.json";


    console.log(url);


    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            myFunction(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


    function myFunction(response) {
        var cart = JSON.parse(response),
            productsInCart = cart.productsInCart,
            i, cartItemsList = "",
            subTotal, discount, estimatedTotal, itemTotalPrice, pricearray = [];

        console.log(productsInCart);

        function formatPrice(n) {
            return n > 9 ? "" + n : "0" + n; }

        for (i = 0; i < productsInCart.length; i++) {
            var productId = productsInCart[i].p_id.toUpperCase(),
                productName = productsInCart[i].p_name.toUpperCase(),
                productVariation = productsInCart[i].p_variation.toUpperCase(),
                originalPrice = productsInCart[i].p_originalprice.toFixed(2),
                formatedOrgPrice = formatPrice(originalPrice),
                productPrice = productsInCart[i].p_price.toFixed(2),
                formatedProPrice = formatPrice(productPrice),
                selectedColor = productsInCart[i].p_selected_color.name,
                colorSliced = selectedColor.slice(1),
                formatedColor = selectedColor.charAt(0).toUpperCase() + colorSliced,
                selectedSize = productsInCart[i].p_selected_size.code.toUpperCase(),
                productStyle = productsInCart[i].p_style.toUpperCase(),
                currency = productsInCart[i].c_currency.toUpperCase(),
                quantity = productsInCart[i].p_quantity;


            cartItemsList += '<div class="cart-items clearfix">\
                    <div class="col-xs-12 col-sm-4 col-md-2 text-center"><img src="assets/images/T' + (i + 1) + '.jpg" width="151" height="154" alt="" /></div>\
                    <div class="col-xs-10 col-xs-offset-1  col-sm-offset-0 col-sm-8 col-md-10">\
                        <div class="row">\
                            <div class="col-md-6 item-short-desc">\
                                <h3 class="no-margin text-uppercase">' + productVariation + ' ' + productName + '</h3>\
                                <p class="no-margin">Style #: ' + productStyle + '</p>\
                                <p class="no-margin">Colour: ' + formatedColor + '</p>\
                            </div>\
                            <div class="clearfix visible-xs visible-sm">\
                                <div class="col-xs-1">Size: </div>\
                                <div class="col-xs-1">' + selectedSize + '</div>\
                            </div>\
                            <div class="clearfix visible-xs visible-sm item-qnty">\
                                <div class="col-xs-2">QTY: </div>\
                                <input type="text" class="text-center col-xs-2" id="Qty" value="' + quantity + '">\
                            </div>\
                            <div class="clearfix visible-xs visible-sm item-price"><div class="col-xs-5">';

            if (formatedOrgPrice !== formatedProPrice) {
                cartItemsList += '<sup>' + currency + '</sup> <h3><s>' + formatedOrgPrice + '</s></h3><br>';
            }
            cartItemsList += '<sup>' + currency + '</sup> <h3>' + formatedProPrice + '</h3></div>\
                            </div>\
                            <div class="col-md-6 hidden-xs hidden-sm">\
                                <div class="row">\
                                    <div style="" class="col-md-4 text-center clearfix item-size">\
                                        <div class="visible-xs visible-sm col-xs-1">Size: </div>\
                                        <div class="col-xs-1 col-md-12">' + selectedSize + '</div>\
                                    </div>\
                                    <div class="col-md-4 text-center clearfix item-qnty"><div class="visible-xs visible-sm col-xs-1">QTY: </div>\
                                        <input type="text" class="form-control text-center col-xs-1" id="Qty" value="' + quantity + '">\
                                    </div><div class="col-md-4 text-center clearfix col-xs-2 item-price">';

            if (formatedOrgPrice !== formatedProPrice) {
                cartItemsList += '<sup>' + currency + '</sup> <h3><s>' + formatedOrgPrice + '</s></h3><br>';
            }
            cartItemsList += '<sup>' + currency + '</sup> <h3>' + formatedProPrice + '</h3></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-md-6 col-lg-6">\
                                <div class="edit-items">\
                                    <a href="?p_id' + productId + '" class="btn btn-default">Edit</a>\
                                    <a href="?p_id' + productId + '" class="btn btn-default"><span></span>Remove</a>\
                                    <a href="?p_id' + productId + '" class="btn btn-default">Save for later</a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>';

        }


        for (j = 0; j < productsInCart.length; j++) {
            var pricearray = [];
            var itemTotalPrice = productsInCart[j].p_quantity * productsInCart[j].p_price;
            pricearray = pricearray.push(itemTotalPrice);

            console.log(itemTotalPrice);
        }
        document.getElementById('itemsInCart').innerHTML = cartItemsList;
        totalItems = $(".cart-items").length;
        $('.total-items').html($('<div/>', { class: 'total-items' }).html(totalItems + ' items' + pricearray));
    }


})();
