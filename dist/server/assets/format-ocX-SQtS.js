//#region src/lib/format.ts
var COUNTRY_NAMES = {
	KE: "Kenya",
	UG: "Uganda",
	TZ: "Tanzania",
	RW: "Rwanda",
	GH: "Ghana",
	NG: "Nigeria"
};
var COUNTRY_DIAL = {
	KE: "+254",
	UG: "+256",
	TZ: "+255",
	RW: "+250",
	GH: "+233",
	NG: "+234"
};
function formatMoney(amount, currency) {
	if (amount == null) return "—";
	const n = typeof amount === "bigint" ? Number(amount) : amount;
	try {
		return new Intl.NumberFormat("en", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(n);
	} catch {
		return `${currency} ${n.toLocaleString()}`;
	}
}
function formatDate(d) {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
function formatDateTime(d) {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
//#endregion
export { formatMoney as a, formatDateTime as i, COUNTRY_NAMES as n, formatDate as r, COUNTRY_DIAL as t };
