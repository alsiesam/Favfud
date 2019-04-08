import React from 'react';
import View from 'react-native';
import {Text, ActivityIndicator} from '@shoutem/ui';
import moment from "moment";

const API_HOST = 'http://django-fyp.herokuapp.com/';
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;
const GET_RECIPES_NUTRITION_URL = `${API_HOST}diary/query/recipe/dynamic`;
const GET_MEAL_URL = 'https://favfud-app.herokuapp.com/api/diary/meal/';
const GET_REPORT_URL = 'https://favfud-app.herokuapp.com/api/diary/report/';

const nutritionLimit = {
  energy: 2200/3,
  carb: 200/3,
  fat: 76.6/3,
  protein: 72/3,
};

const maxConsumptionPercentage=1.4;
const minConsumptionPercentage=0.6;
const maxConsumptionPercentage_l2=1.2;
const minConsumptionPercentage_l2=0.8;

export async function fetchMealRecordByToken(token, startDate=false, endDate=false) {
  try {
    var url = `${GET_MEAL_URL}?user_token=${token}`
    if (startDate && endDate) {
      url += ("&start_date=" + moment(startDate).format("YYYY-MM-DD"));
      url += ("&end_date=" + moment(endDate).format("YYYY-MM-DD"));
    }
    let response = await fetch(url);
    let responseJson = await response.json();
    //console.log(response);
    if (response.ok && responseJson.length>0) {
      return responseJson;
    } else {
      console.log("fetchMealRecordByToken Error");
      return false;
    }
  } catch(err) {
    console.log("fetchMealRecordByToken Error");
    console.log(err);
  }
}

export async function fetchReportByToken(token, startDate=false, endDate=false) {
  try {
    var url = `${GET_REPORT_URL}?user_token=${token}`
    if (startDate && endDate) {
      url += ("&start_date=" + moment(startDate).format("YYYY-MM-DD"));
      url += ("&end_date=" + moment(endDate).format("YYYY-MM-DD"));
    }
    //console.log(url);
    let response = await fetch(url);
    //console.log(response);
    if (response.ok) {
      let responseJson = await response.json();
      return responseJson;
    } else {
      console.log("fetchReportByToken");
      return false;
    }
  } catch(err) {
    console.log("fetchReportByToken");
    console.log(err);
  }
}

export function updateMealRecords(meal, mealRecords={}) {
  for (var i=0; i<meal.length; i++) {
    let item = meal[i];
    let ids = item.dish_ids.split(",");
    let servings = item.servings.split(",");
    let date = item.date;
    for (var j=0; j<ids.length; j++) {
      id = ids[j];
      serving = servings[j];
      if (mealRecords.hasOwnProperty(date)) {
        mealRecords[date][id] = serving;
      } else {
        mealRecords[date] =  {
          [id]: serving,
        };
      }
    }
  }
  return mealRecords;
}

export async function fetchMealRecipes(mealRecords, date) {
  let ids_str ='';
  let ids = Object.keys(mealRecords[date]);
  ids_str = ids.join(',')
  try {
    let response = await fetch(GET_MULTIPLE_RECIPES_URL, {
        headers: new Headers ({
            ids: ids_str
        }),
    });
    if (response.ok) {
      let responseJson = await response.json();
      return responseJson;
    } else {
      console.log("fetchMealRecipes Not ok");
      //console.log(response);
    }
  } catch(err) {
    console.log(err);
  }
}

export async function updateMealRecipes(date, mealRecords, mealRecipes={}){
  if(mealRecords[date].length != 0 && mealRecords[date] != undefined) {
    let responseJson = await fetchMealRecipes(mealRecords, date);
    return {[date]: responseJson};
  } else {
    return mealRecipes;
  }
}

export async function generateMealRecipes(mealRecords){
  let mealRecipes={};
  let dates = Object.keys(mealRecords).sort().reverse();
  let actions = [];
  for (let i = 0; i < dates.length; i++) {
    actions.push(updateMealRecipes(dates[i], mealRecords));
  }
  let new_mealRecipes = await Promise.all(actions);
  for (let i = 0; i < dates.length; i++) {
    mealRecipes = Object.assign(mealRecipes, new_mealRecipes[i]);
  }
  return mealRecipes;
}

export async function fetchRecipesWithNutrition(summary) {
  try {
    var url = `${GET_RECIPES_NUTRITION_URL}`

    if ((summary.more.length + summary.less.length) < 1) {
      summary = {
        more: summary.slightlyMore,
        less: summary.slightlyLess
      }
    }
    if ((summary.more.length + summary.less.length) < 1) {
      return {};
    }
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(summary)
    });
    let responseJson = await response.json();
    if (response.ok && responseJson.length>0) {
      return responseJson;
    } else {
      console.log("fetchRecipesWithNutrition Error");
      return false;
    }
  } catch(err) {
    console.log("fetchRecipesWithNutrition Error");
    console.log(err);
  }
}

export function generateReportInfo(mealRecords, mealRecipes, startDate=moment(today).subtract(7, 'days'), endDate=moment(today).subtract(1, 'days')){
  let new_reportInfo = {
    numOfDays: 0,
    numOfMeals: 0,
    energy: 0.0,
    fat: 0.0,
    carb: 0.0,
    protein: 0.0,
  };

  new_reportInfo.numOfDays = endDate.diff(startDate, 'days') + 1;
  let dates = Object.keys(mealRecipes);
  for (var i=0; i<dates.length; i++) {
    let date = dates[i];

    let dateInRange = true;
    if(moment(date).isBefore(startDate)){
      dateInRange =  false;
    } else if (moment(date).isAfter(endDate)) {
      dateInRange = false;
    }

    if(dateInRange) {
      let ids = Object.keys(mealRecords[date]);
      for (var j=0; j<mealRecipes[date].length; j++) {
        new_reportInfo.numOfMeals += 1;
        let dish = mealRecipes[date][j];
        let servings = mealRecords[date][dish.id];
        storeNutritionInfo(dish, servings, new_reportInfo);
      }
    }
  }
  return new_reportInfo;
}

export function storeNutritionInfo(dish, servings, new_reportInfo){
  new_reportInfo.carb += parseFloat(dish.chocdf.split("$")[0])*servings;
  new_reportInfo.energy += parseFloat(dish.enerc_kcal.split("$")[0])*servings;
  new_reportInfo.fat += parseFloat(dish.fat.split("$")[0])*servings;
  new_reportInfo.protein += parseFloat(dish.procnt.split("$")[0])*servings;
}

export function getConsumptionPerMeal(reportInfo) {
  var consumptionPerMeal = {
    energy: reportInfo.energy/reportInfo.numOfMeals,
    carb: reportInfo.carb/reportInfo.numOfMeals,
    fat: reportInfo.fat/reportInfo.numOfMeals,
    protein: reportInfo.protein/reportInfo.numOfMeals,
  };
  return consumptionPerMeal;
}

export function getNutritionLimit() {
  return nutritionLimit;
}

export function getConsumptionPercentage(nutrition, consumptionPerMeal, limit=nutritionLimit) {
  switch (nutrition) {
    case "energy":
      return(consumptionPerMeal.energy/limit.energy);
      break;
    case "carb":
      return(consumptionPerMeal.carb/limit.carb);
      break;;
    case "fat":
      return(consumptionPerMeal.fat/limit.fat);
      break;;
    case "protein":
      return(consumptionPerMeal.protein/limit.protein);
      break;
    default:
    return 0;
  }
}

export function generateSummary(consumptionPerMeal, limit=nutritionLimit) {
  var nutritionList = Object.keys(consumptionPerMeal);
  var summary = {
    more: [],
    less: [],
    slightlyMore: [],
    slightlyLess: [],
    noChange:[],
    text: "",
  };
  nutritionList.forEach(nutrition => {
    var consumptionPercentage = getConsumptionPercentage(nutrition, consumptionPerMeal, limit);
    if (consumptionPercentage<=minConsumptionPercentage) {
      summary.more.push(nutrition);
    } else if (consumptionPercentage>=maxConsumptionPercentage) {
      summary.less.push(nutrition);
    } else if (consumptionPercentage<=minConsumptionPercentage_l2) {
      summary.slightlyMore.push(nutrition);
    } else if (consumptionPercentage>=maxConsumptionPercentage_l2) {
      summary.slightlyLess.push(nutrition);
    } else {
      summary.noChange.push(nutrition);
    }
  });
  summary.text = generateSummaryText(summary);
  return summary;
}

function generateSummaryText(summary){
  var text="";
  var more_num = summary.more.length;
  var less_num = summary.less.length;
  var more_num_2 = summary.slightlyMore.length;
  var less_num_2 = summary.slightlyLess.length;
  for (var i=0; i<summary.more.length; i++) {

  }
  if((more_num+less_num)==0) {
    //text = "Your eating habbit is healthy. Keep it Up!";
    if((more_num_2+less_num_2)==0) {
      text = "Your eating habbit is healthy. Keep it Up!";
    } else if (less_num_2==0) {
      text = "You should eat food with more "+changeNutritionToText(summary.slightlyMore)+".";
    } else if (more_num_2==0) {
      text = "You should eat food with less "+changeNutritionToText(summary.slightlyLess)+".";
    } else {
      text = "You should eat food with more "+changeNutritionToText(summary.slightlyMore)+" and with less "+changeNutritionToText(summary.slightlyLess)+".";
    }
  } else if (less_num==0) {
    text = "You should eat food with more "+changeNutritionToText(summary.more)+".";
  } else if (more_num==0) {
    text = "You should eat food with less "+changeNutritionToText(summary.less)+".";
  } else {
    text = "You should eat food with more "+changeNutritionToText(summary.more)+" and with less "+changeNutritionToText(summary.less)+".";
  }
  return text;
}

function changeNutritionToText(nutritionList) {
  var length = nutritionList.length;
  if (length ==0){
    return "";
  } else {
    var text = "";
    for (var i=0; i<length; i++) {
      var word = nutritionList[i];
      if (word=="carb") {word = "carbohydrates";}
      if (i==length-1) {
       text += word;
      } else if (i==length-2) {
       text += word;
       text += " and ";
      }
       else {
        text += word;
        text += ", ";
      }
    }
    return text;
  }
}
/*
export async function getDiarySummary(token, startDate=moment(new Date).subtract(6, 'days'), endDate=moment(new Date)) {
  let responseJson = await fetchMealRecordByToken(token);
  let mealRecords = updateMealRecords(responseJson);
  let mealRecipes = await generateMealRecipes(mealRecords);
  let reportInfo = generateReportInfo(mealRecords, mealRecipes, startDate, endDate)
  let consumptionPerMeal = getConsumptionPerMeal(reportInfo)
  let summary = generateSummary(consumptionPerMeal);
  return summary;
}
*/
export async function getDiaryReport(token, startDate=moment(new Date).subtract(7, 'days'), endDate=moment(new Date).subtract(1, 'days')) {
  let reportData = await fetchReportByToken(token, startDate, endDate);
  if (reportData) {
    reportData.summary["text"] = generateSummaryText(reportData.summary);
    return reportData;
  } else {
    return false;
  }
}

export function getDiarySummaryWithReportInfo(reportInfo) {
  let consumptionPerMeal = getConsumptionPerMeal(reportInfo)
  let summary = generateSummary(consumptionPerMeal);
  return summary;
}
