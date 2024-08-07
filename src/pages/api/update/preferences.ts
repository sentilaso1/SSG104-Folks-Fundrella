import type { APIRoute } from "astro";
import { db, auth } from "../../../database/databaseUtils";
import type { Enums } from "../../../database/database.types";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
    const formData = await request.formData();

    const defaultAccount = formData.get("default_account")?.toString();
    const defaultTheme = formData.get("default_theme")?.toString();
    const currency = formData.get("currency")?.toString();

    const userId = await auth.user.getId();
    if (!userId) {
        return new Response(
            "Could not retrieve the User ID", { status: 500 }
        );
    }

    const { data, error } = await db.update.preferences(
        userId,
        {
            default_account: defaultAccount,
            default_theme: defaultTheme as Enums<"Theme">,
            currency: currency
        }
    );

    if (error) {
        return new Response(
            "Could not update the given preferences\n" + error.message,
            { status: 500 }
        );
    }

    cookies.set("theme", data[0].default_theme, { path: "/" });

    return redirect("/dashboard/settings");
}
