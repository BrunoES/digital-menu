function formatFloat(value) {
    var valueDecimalFormatted = parseFloat(value).toFixed(2);
    return valueDecimalFormatted.replace('.', ',');
 };

 export default formatFloat;