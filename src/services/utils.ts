import { ethers } from "ethers"

export function formatUsdt(amount : bigint) {
    const formattedAmount = ethers.formatUnits(amount, 6);

    const formattedWithThousands = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(parseFloat(formattedAmount));

    return formattedWithThousands;
}