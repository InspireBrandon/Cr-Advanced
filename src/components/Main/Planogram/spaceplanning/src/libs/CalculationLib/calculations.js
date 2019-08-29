class Calculations {
  constructor(TotalDays, storeCount, usePotential) {
    this.TotalDays = 30;
    this.storeCount = storeCount;
    this.usePotential = usePotential;
  }

  Weekly_Sales_Units(sales_units) {
    console.log("CALC HANDLER - SALES UNITS", sales_units, this);

    if (sales_units == undefined || sales_units == null) {
      return "N/A"
    }

    if (parseFloat(sales_units) == 0) {
      return "N/A"
    }

    var calc = ((parseFloat(sales_units) / this.storeCount) / this.TotalDays) * 7;
    return calc.toFixed(2);
  }

  Weekly_Sales_Retail(sales_retail) {
    if (sales_retail == undefined || sales_retail == null) {
      return "N/A"
    }

    if (parseFloat(sales_retail) == 0) {
      return "N/A"
    }

    var calc = (parseFloat(sales_retail) / this.storeCount) / this.TotalDays * 7;
    return calc.toFixed(2);
  }

  Weekly_Sales_Cost(sales_cost) {
    if (sales_cost == undefined || sales_cost == null) {
      return "N/A"
    }

    if (parseFloat(sales_cost) == 0) {
      return "N/A"
    }
    var calc = (parseFloat(sales_cost) / this.storeCount) / this.TotalDays * 7;
    return calc.toFixed(2);
  }

  Weekly_Profit(sales_retail, sales_cost) {
    if (sales_retail == undefined || sales_retail == null || sales_cost == undefined || sales_cost == null) {
      return "N/A"
    }

    if (parseFloat(sales_retail) == 0 || parseFloat(sales_cost) == 0) {
      return "N/A"
    }

    var weekly_sales_retail = this.Weekly_Sales_Retail(sales_retail),
      weekly_sales_cost = this.Weekly_Sales_Cost(sales_cost);

    var calc = weekly_sales_retail - weekly_sales_cost;

    return calc.toFixed(2)
  }

  Weekly_Volume_Potential(sales_units, weighted_distribution) {
    if (sales_units == undefined || sales_units == null || weighted_distribution == undefined || weighted_distribution == null) {
      return "N/A"
    }

    if (parseFloat(sales_units) == 0 || parseFloat(weighted_distribution) == 0) {
      return "N/A";
    }

    var weekly_sales_units = this.Weekly_Sales_Units(sales_units);
    var calc = weekly_sales_units / weighted_distribution * 100;
    return calc.toFixed(2);
  }

  Weekly_Sales_Potential(sales_retail, weighted_distribution) {
    if (sales_retail == undefined || sales_retail == null || weighted_distribution == undefined || weighted_distribution == null) {
      return "N/A"
    }

    if (parseFloat(sales_retail) == 0 || parseFloat(weighted_distribution) == 0) {
      return "N/A";
    }

    var weekly_sales_retail = this.Weekly_Sales_Retail(sales_retail);
    var calc = weekly_sales_retail / weighted_distribution * 100;
    return calc.toFixed(2);
  }

  Days_Of_Supply_Potential(cube_capacity, sales_units) {
    console.log("[CALCULATIONS] DAYS OF SUPPLY", "CC", cube_capacity, "SU", sales_units);

    if (cube_capacity == undefined || cube_capacity == null || sales_units == undefined || sales_units == null) {
      return "N/A"
    }

    if (parseFloat(cube_capacity) <= 0 || parseFloat(sales_units) <= 0) {
      return "N/A"
    }
    var calc = cube_capacity / parseFloat(this.Weekly_Sales_Units(sales_units)) * 7;

    console.log("calc", calc);

    return calc.toFixed(2);
  }

  DOS_Item_Count_Over(DOS_Target) {

  }

  DOS_Item_Count_Under(DOS_Target) {}

  Item_Not_On_Shelf(products) {}

  Item_Discontinued(products) {}

  DOS_Target_Var() {}

  Count_Over_Var() {}

  Count_Under_Var() {}

  Not_On_Shelf_Var() {}

  Discontinued_Var() {}

  Item_Capacity() {}

  Days_Of_Supply() {}

  Eye_Level_Position() {}

  Item_Facings() {}

  Number_Of_Drops_Planogram() {}
}

export default Calculations;
