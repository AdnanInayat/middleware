exports.convert = function(amount, selected_currency){
    var result = 0;
    if(selected_currency == 0){
        result = amount * 1.11;
    }
    if(selected_currency == 1){
        result = amount * 0.86;
    }
    return result;
}