export function formatPhoneNumber(input) {
    if (!input) return "";

    let cleaned = input.replace(/[^\d+]/g, "");
    cleaned = cleaned.replace(/\++/g, "+");

    if (cleaned.indexOf("+") > 0) {
        cleaned = cleaned.replace(/\+/g, "");
    }

    if (cleaned.startsWith("+")) {
        return cleaned.slice(0, 16);
    }

    if (cleaned.startsWith("0")) {
        cleaned = "+880" + cleaned.slice(1);
    } else if (cleaned.startsWith("1") && cleaned.length === 10) {
        cleaned = "+1" + cleaned;
    } else {
        cleaned = "+880" + cleaned;
    }

    return cleaned.slice(0, 16);
}
