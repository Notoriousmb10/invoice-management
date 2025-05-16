function getFinancialYear(date) {
 const d = new Date(date);
 const year = d.getFullYear();
 const month = d.getMonth() + 1;
 return month < 4 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
}

module.exports = getFinancialYear;