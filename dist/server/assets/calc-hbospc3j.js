//#region src/lib/loans/calc.ts
function computeLoan(principal, ratePct, termDays) {
	const interest = Math.round(principal * ratePct / 100);
	return {
		principal,
		interest,
		total: principal + interest,
		dueDate: new Date(Date.now() + termDays * 86400 * 1e3).toISOString().slice(0, 10)
	};
}
//#endregion
export { computeLoan as t };
