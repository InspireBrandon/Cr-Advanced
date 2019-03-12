import {
  ComponentResolver
} from "ag-grid-community";

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: Provide a simple means of generating a planogram name
// Author: Brandon Lange
// Date: 2019-02-05
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class PlanogramNamer {
  constructor() {

  }

  static generatePlanogramName(allPlanogramItems, clusterData) {
    // Declare all properties needed for name

    let planogramName = DefiniteString(clusterData.planogramName);
    let userPlanogramName = DefiniteString(clusterData.userPlanogramName);
    let storeName = DefiniteString(clusterData.storeName);
    let storeCluster = DefiniteString(clusterData.clusterName);
    // let categoryCluster = DefiniteString(clusterData.categoryCluster);
    let categoryCluster = "XXX";
    let departmentCluster = DefiniteString(clusterData.departmentCluster);
    let customCluster = DefiniteString(clusterData.customCluster);
    let userStoreName = DefiniteString(customCluster.userStoreName);
    let periodFrom = DefiniteString(customCluster.periodFrom);
    let periodTo = DefiniteString(customCluster.periodTo);
    let drops = DefiniteString(GetTotalDrops(allPlanogramItems));

    if(drops != "")
        drops = drops + " Module";

    let height = DefiniteString(GetHighestFixture(allPlanogramItems));
    let width = DefiniteString(GetTotalWidthFixture(allPlanogramItems));
    let dimensions = "";

    if(height != "" && width != "")
        dimensions = `${drops}(${(height / 100).toFixed(2)} m X ${(width / 100).toFixed(2)} m)`;

    let itemArr = [];
    itemArr.push(planogramName);
    itemArr.push(userPlanogramName);
    itemArr.push(storeName);
    itemArr.push(storeCluster);
    itemArr.push(categoryCluster);
    itemArr.push(departmentCluster);
    itemArr.push(customCluster);
    itemArr.push(userStoreName);
    itemArr.push(periodFrom);
    itemArr.push(periodTo);
    itemArr.push(dimensions);

    return ExcludeEmptyConcatenate(itemArr);
  }
}

function DefiniteString(item) {
  if (item == undefined || item == null) {
    return "";
  } else {
    return item;
  }
}

export default PlanogramNamer;

function ExcludeEmptyConcatenate(itemArr) {
  let retval = "";
  let itemInArr = false;

  console.log(itemArr)

  itemArr.forEach(el => {
    if (el != "") {
      if (itemInArr) {
        retval += " - ";
        retval += el;
      } else {
        itemInArr = true;
        retval += el;
      }
    }
  })

  return retval;
}

function GetTotalDrops(allPlanogramItems) {
  let totalDrops = 0;

  if (allPlanogramItems.length > 0) {
    allPlanogramItems.forEach(el => {
      if (el.Type == "GONDOLA" || el.Type == "OBSTRUCTION") {
        totalDrops++;
      }
    })
  }

  return totalDrops;
}

function GetHighestFixture(allPlanogramItems) {
  let highest = 0;

  if (allPlanogramItems.length > 0) {
    allPlanogramItems.forEach(el => {
      if (el.Type == "GONDOLA" || el.Type == "OBSTRUCTION") {
        if (el.Data.Data.height > highest)
          highest = el.Data.Data.height;
      }
    })
  }

  return highest;
}

function GetTotalWidthFixture(allPlanogramItems) {
  let totalWidth = 0;
  if (allPlanogramItems.length > 0) {
    allPlanogramItems.forEach(el => {
      if (el.Type == "GONDOLA" || el.Type == "OBSTRUCTION") {
        totalWidth += el.Data.Data.width;
      }
    })
  }

  return totalWidth;
}
