import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercent } from '../../lib/format';

interface MortgageCalculatorProps {
  currentRate30Y?: number;
  currentRate15Y?: number;
}

interface CalculationResults {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  monthlyPrincipalInterest: number;
  monthlyTaxesInsurance: number;
  payoffDate: string;
  totalMonths: number;
}

interface ExtraPaymentComparison {
  standard: CalculationResults;
  withExtra: CalculationResults;
  savings: {
    totalInterestSaved: number;
    monthsSaved: number;
    yearsSaved: number;
    percentSaved: number;
  };
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  currentRate30Y,
  currentRate15Y
}) => {
  // Form inputs
  const [loanAmount, setLoanAmount] = useState(400000);
  const [interestRate, setInterestRate] = useState(currentRate30Y || 6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(8000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(200);
  const [includeExtras, setIncludeExtras] = useState(true);
  const [extraPayment, setExtraPayment] = useState(0);

  // Update rate when prop changes
  useEffect(() => {
    if (currentRate30Y && loanTerm === 30) {
      setInterestRate(currentRate30Y);
    } else if (currentRate15Y && loanTerm === 15) {
      setInterestRate(currentRate15Y);
    }
  }, [currentRate30Y, currentRate15Y, loanTerm]);

  // Calculate mortgage payment with optional extra payment
  const calculatePayment = (extraPrincipal: number = 0): CalculationResults => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Monthly principal & interest using standard mortgage formula
    const monthlyPrincipalInterest = 
      principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Monthly taxes and insurance
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPmi = pmi;
    const monthlyTaxesInsurance = monthlyPropertyTax + monthlyInsurance + monthlyPmi;

    // Calculate actual payoff time with extra payments
    let balance = principal;
    let totalInterestPaid = 0;
    let monthsToPayoff = 0;
    const maxMonths = numberOfPayments;

    // Simulate monthly payments
    while (balance > 0.01 && monthsToPayoff < maxMonths) {
      monthsToPayoff++;
      
      // Interest for this month
      const monthlyInterest = balance * monthlyRate;
      totalInterestPaid += monthlyInterest;
      
      // Principal payment (regular + extra)
      let principalPayment = monthlyPrincipalInterest - monthlyInterest + extraPrincipal;
      
      // Don't pay more principal than remaining balance
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;
    }

    // If no extra payments, use standard calculation
    if (extraPrincipal === 0) {
      totalInterestPaid = monthlyPrincipalInterest * numberOfPayments - principal;
      monthsToPayoff = numberOfPayments;
    }

    // Calculate payoff date
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
    const payoffDateString = payoffDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    // Total monthly payment including extras
    const monthlyPayment = monthlyPrincipalInterest + extraPrincipal + (includeExtras ? monthlyTaxesInsurance : 0);

    // Total payment over life of loan
    const totalPrincipalInterest = totalInterestPaid + principal;
    const totalExtras = includeExtras ? monthlyTaxesInsurance * monthsToPayoff : 0;
    const totalPayment = totalPrincipalInterest + totalExtras;

    return {
      monthlyPayment,
      totalInterest: totalInterestPaid,
      totalPayment,
      monthlyPrincipalInterest: monthlyPrincipalInterest + extraPrincipal,
      monthlyTaxesInsurance,
      payoffDate: payoffDateString,
      totalMonths: monthsToPayoff
    };
  };

  // Get comparison data for standard vs extra payments
  const getExtraPaymentComparison = (): ExtraPaymentComparison => {
    const standard = calculatePayment(0);
    const withExtra = calculatePayment(extraPayment);
    
    const totalInterestSaved = standard.totalInterest - withExtra.totalInterest;
    const monthsSaved = standard.totalMonths - withExtra.totalMonths;
    const yearsSaved = monthsSaved / 12;
    const percentSaved = (totalInterestSaved / standard.totalInterest) * 100;

    return {
      standard,
      withExtra,
      savings: {
        totalInterestSaved,
        monthsSaved,
        yearsSaved,
        percentSaved
      }
    };
  };

  const results = calculatePayment(extraPayment);
  const comparison = getExtraPaymentComparison();

  // Rate comparison (show how payment changes with rate changes)
  const getRateComparison = () => {
    const baseRate = interestRate;
    const rateChanges = [-1, -0.5, 0, 0.5, 1];

    return rateChanges.map(change => {
      const newRate = baseRate + change;
      const monthlyRate = newRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      const monthlyPI = 
        loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalMonthly = monthlyPI + (includeExtras ? results.monthlyTaxesInsurance : 0);
      const difference = totalMonthly - results.monthlyPayment;

      return {
        rate: newRate,
        monthlyPayment: totalMonthly,
        difference,
        isBase: change === 0
      };
    });
  };

  const rateComparisons = getRateComparison();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💰 Mortgage Payment Calculator
        </h2>
        <p className="text-gray-600">
          Calculate your monthly payment with current market rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Loan Details</h3>
          
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Price / Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="10000"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Quick Rate Buttons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quick Rate Selection
            </label>
            <div className="flex gap-2">
              {currentRate30Y && (
                <button
                  onClick={() => {
                    setInterestRate(currentRate30Y);
                    setLoanTerm(30);
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  30Y: {formatPercent(currentRate30Y)}
                </button>
              )}
              {currentRate15Y && (
                <button
                  onClick={() => {
                    setInterestRate(currentRate15Y);
                    setLoanTerm(15);
                  }}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  15Y: {formatPercent(currentRate15Y)}
                </button>
              )}
            </div>
          </div>

          {/* Extra Payment Input */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-green-800 mb-2">
              💰 Extra Principal Payment
            </h4>
            <div>
              <label className="block text-sm text-green-700 mb-1">
                Additional Monthly Payment Toward Principal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="50"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-green-600 mt-1">
                Any extra amount you pay toward the loan principal each month
              </p>
            </div>
          </div>

          {/* Taxes, Insurance, PMI */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-800">
                Additional Monthly Costs
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeExtras}
                  onChange={(e) => setIncludeExtras(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Include in payment</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Annual Home Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Monthly PMI
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={pmi}
                    onChange={(e) => setPmi(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Payment Breakdown</h3>
          
          {/* Main Monthly Payment */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Monthly Payment</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(results.monthlyPayment)}
              </p>
            </div>
          </div>

          {/* Payment Components */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Principal & Interest</span>
              <span className="font-semibold">{formatCurrency(results.monthlyPrincipalInterest)}</span>
            </div>
            
            {includeExtras && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Taxes, Insurance & PMI</span>
                <span className="font-semibold">{formatCurrency(results.monthlyTaxesInsurance)}</span>
              </div>
            )}
          </div>

          {/* Loan Summary */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-gray-800">Loan Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest Paid</span>
                <span className="font-medium text-red-600">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount Paid</span>
                <span className="font-medium">{formatCurrency(results.totalPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payoff Date</span>
                <span className="font-medium text-blue-600">{results.payoffDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Loan Duration</span>
                <span className="font-medium">{Math.round(results.totalMonths / 12 * 10) / 10} years</span>
              </div>
            </div>
          </div>

          {/* Extra Payment Impact Analysis */}
          {extraPayment > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-green-800 mb-3">💪 Extra Payment Impact</h4>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-green-700 mb-1">Total Interest Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(comparison.savings.totalInterestSaved)}
                    </p>
                    <p className="text-xs text-green-600">
                      ({comparison.savings.percentSaved.toFixed(1)}% reduction)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-green-700 font-medium">Time Saved</p>
                      <p className="text-lg font-bold text-green-600">
                        {Math.floor(comparison.savings.yearsSaved)} years
                      </p>
                      <p className="text-xs text-green-600">
                        {comparison.savings.monthsSaved} months
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-700 font-medium">New Payoff</p>
                      <p className="text-lg font-bold text-green-600">
                        {comparison.withExtra.payoffDate}
                      </p>
                      <p className="text-xs text-green-600">
                        vs {comparison.standard.payoffDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Without Extra Payment</h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly P&I:</span>
                      <span>{formatCurrency(comparison.standard.monthlyPrincipalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="text-red-600">{formatCurrency(comparison.standard.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payoff:</span>
                      <span>{comparison.standard.payoffDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="text-sm font-semibold text-green-700 mb-2">With ${extraPayment} Extra</h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly P&I:</span>
                      <span>{formatCurrency(comparison.withExtra.monthlyPrincipalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="text-green-600">{formatCurrency(comparison.withExtra.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payoff:</span>
                      <span>{comparison.withExtra.payoffDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Impact Analysis */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Rate Impact Analysis</h4>
            <div className="space-y-2">
              {rateComparisons.map((comparison, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded text-sm ${
                    comparison.isBase
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className={comparison.isBase ? 'font-semibold' : ''}>
                    {formatPercent(comparison.rate)} rate
                  </span>
                  <div className="text-right">
                    <div className={comparison.isBase ? 'font-semibold' : ''}>
                      {formatCurrency(comparison.monthlyPayment)}
                    </div>
                    {!comparison.isBase && (
                      <div className={`text-xs ${
                        comparison.difference > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {comparison.difference > 0 ? '+' : ''}{formatCurrency(comparison.difference)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-yellow-600">💡</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">
              Calculator Notes
            </h4>
            <div className="text-sm text-yellow-700 mt-1 space-y-1">
              <p>
                <strong>Payment Calculations:</strong> This calculator provides estimates based on the information provided. Actual mortgage payments may vary based on lender requirements, credit score, down payment, and other factors.
              </p>
              <p>
                <strong>Extra Payments:</strong> Additional principal payments can dramatically reduce total interest and loan duration. Results assume consistent extra payments throughout the loan term. Consult your lender about prepayment options and restrictions.
              </p>
              <p className="pt-1">
                Always consult with qualified mortgage professionals for accurate quotes and financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
