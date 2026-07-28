import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/app.loans.$id.tsx
var $$splitComponentImporter = () => import("./app.loans._id-DyJdO_JU.js");
var Route = createFileRoute("/_authenticated/app/loans/$id")({
	head: () => ({ meta: [{ title: "Loan — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
