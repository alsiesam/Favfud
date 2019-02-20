export function secondsToHms(d) {
    //console.log(d);
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second " : " seconds ") : "";
    var final = hDisplay + mDisplay + sDisplay;
    return final.trim(); 
}

export function getIngredients(recipe) {
    var ingredient_list = recipe.ingredients;
    var delimiter = "$";
    var ingredient_arr = ingredient_list.split(delimiter).map(function(e){return e.trim();});
    return ingredient_arr;
}

export function arr_diff(a1, a2) {
    var result = {};
    var more = a1.filter(function(i) {return a2.indexOf(i) < 0;});
    var less = a2.filter(function(i) {return a1.indexOf(i) < 0;});
    result["more"] = more;
    result["less"] = less;
    return result;
}