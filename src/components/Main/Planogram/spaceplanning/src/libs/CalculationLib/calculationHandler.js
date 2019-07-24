import calculations from './calculations';

class calculationHandler {
  constructor(daysBetween, storeCount) {
    this._calculations = new calculations(daysBetween, storeCount);
  }

  Calculate_Weekly_Sales_Units(units) {
    return this._calculations.Weekly_Sales_Units(units);
  }

  Calculate_Weekly_Sales_Retail(retail) {
    return this._calculations.Weekly_Sales_Retail(retail);
  }

  Calculate_Weekly_Sales_Cost(cost) {
    return this._calculations.Weekly_Sales_Cost(cost);
  }

  Calculate_Weekly_Profit(retail, cost) {
    return this._calculations.Weekly_Profit(retail, cost);
  }

  Calculate_Weekly_Volume_Potential(units, weighted_distribution) {
    return this._calculations.Weekly_Volume_Potential(units, weighted_distribution);
  }

  Calculate_Weekly_Sales_Potential(sales, weighted_distribution) {
    return this._calculations.Weekly_Sales_Potential(sales, weighted_distribution);
  }

  Calculate_Days_Of_Supply_Potential(cube_capacity, units) {
    return this._calculations.Days_Of_Supply_Potential(cube_capacity, units);
  }
}

export default calculationHandler;
