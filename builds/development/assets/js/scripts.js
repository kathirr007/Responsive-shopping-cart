/*jshint multistr: true */
window.onload = (function() {
    var xmlhttp = new XMLHttpRequest(),
        url = "assets/json/cart.json",
        currency = "";


    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            myFunction(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
        function formatPrice(n) { return n > 9 ? "" + n : "0" + n; }


        function sum(itemPrices){
             
         if (toString.call(itemPrices) !== "[object Array]")
            return false;
            var total =  0;
            for(i=0; i<itemPrices.length; i++)
              {                  
                if(isNaN(itemPrices[i])){
                continue;
                 }
                  total += Number(itemPrices[i]);
               }
             return total;
            }
        function calcDiscount(subTotal, totalQnty){
            var discount = 0;
            if (totalQnty == 3) {
                discount = ((subTotal/100)*5);
            } else if (totalQnty > 3 && totalQnty <= 6) {
                discount = ((subTotal/100)*10);
            } else if (totalQnty >= 7 ) {
                discount = ((subTotal/100)*25);
            } else {
                discount = 0;
            }
            return discount;
        }
        function calcShipping(subTotal){
            var shipping = 0;
            if (subTotal >= 50) {
                shipping = 0;
            } else if (subTotal < 50 ) {
                shipping = ((subTotal/100)*5);
            } else {
                shipping = ((subTotal/100)*5);
            }
            return shipping;
        }        


    function myFunction(response) {
        var cart = JSON.parse(response),
            productsInCart = cart.productsInCart,
            i, cartItemsList = "",
            subTotal, discount, estimatedTotal, shipping, shippingPrice="", subTotalPrice="", discountPrice="", estimatedTotalPrice="", pricearray = [], quantityarray = [];

console.log(productsInCart);

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
                // currency = productsInCart[i].c_currency.toUpperCase(),
                quantity = productsInCart[i].p_quantity;
                productsInCart[i].testVariable = productsInCart[i].p_quantity*productsInCart[i].p_price;
                pricearray.push(productPrice*quantity);
                quantityarray.push(quantity);

            window.currency = productsInCart[i].c_currency.toUpperCase();

            cartItemsList += '<div class="cart-items clearfix">\
                    <div class="col-xs-12 col-sm-4 col-md-2 text-center"><img src="assets/images/T' + (i + 1) + '.jpg" width="151" height="154" alt="" /></div>\
                    <div class="col-xs-10 col-xs-offset-1  col-sm-offset-0 col-sm-8 col-md-10">\
                        <div class="row">\
                            <div class="col-md-6 item-short-desc">\
                                <h3 class="no-margin text-uppercase">' + productVariation + ' ' + productName + '</h3>\
                                <p class="no-margin">Style #: <strong>' + productStyle + '</strong></p>\
                                <p class="no-margin">Colour: <strong>' + formatedColor + '</strong></p>\
                            </div>\
                            <div class="clearfix visible-xs visible-sm">\
                                <div class="col-xs-1">Size: </div>\
                                <div class="col-xs-1"><strong>' + selectedSize + '</strong></div>\
                            </div>\
                            <div class="clearfix visible-xs visible-sm item-qnty">\
                                <div class="col-xs-3">QTY: </div>\
                                <input type="text" class="text-center col-xs-2" id="Qty" value="' + quantity + '">\
                            </div>\
                            <div class="clearfix visible-xs visible-sm item-price"><div class="col-xs-6">';

            if (formatedOrgPrice !== formatedProPrice) {
                cartItemsList += '<sup>' + window.currency + '</sup> <h3><s>' + formatedOrgPrice + '</s></h3><br>';
            }
            cartItemsList += '<sup>' + window.currency + '</sup> <h3>' + formatedProPrice + '</h3></div>\
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
                cartItemsList += '<sup>' + window.currency + '</sup> <h3><s>' + formatedOrgPrice + '</s></h3><br>';
            }
            cartItemsList += '<sup>' + window.currency + '</sup> <h3>' + formatedProPrice + '</h3></div>\
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





subTotal = sum(pricearray);
formatedsubTotal = formatPrice(sum(pricearray).toFixed(2));
totalQnty = sum(quantityarray);
discount = calcDiscount(subTotal, totalQnty);
formateddiscount = formatPrice(calcDiscount(subTotal, totalQnty).toFixed(2));
shipping = calcShipping(subTotal);
formatedshipping = formatPrice(calcShipping(subTotal).toFixed(2));
estimatedTotal = subTotal - discount + shipping;
formatedestimatedTotal = formatPrice((estimatedTotal).toFixed(2));
subTotalPrice += '<sup>'+window.currency+' </sup><h3>'+formatedsubTotal+'</h3>';
discountPrice += '<h3>- </h3><sup> '+window.currency+' </sup><h3>'+formateddiscount+'</h3>';
estimatedTotalPrice += '<sup>'+window.currency+' </sup><h3>'+formatedestimatedTotal+'</h3>';
if (shipping === 0){
    shippingPrice += 'FREE';
} else {
    shippingPrice += '<sup>'+window.currency+' </sup><h3>'+formatedshipping+'</h3>';
}

        document.getElementById('itemsInCart').innerHTML = cartItemsList;
        document.getElementById('subTotal').innerHTML = subTotalPrice;
        document.getElementById('discountTotal').innerHTML = discountPrice;
        document.getElementById('shippingTotal').innerHTML = shippingPrice;
        document.getElementById('estimatedTotal').innerHTML = estimatedTotalPrice;
        totalItems = $(".cart-items").length;
        $('.total-items').html($('<div/>', { class: 'total-items' }).html(totalItems + ' items'));
    }


})();
