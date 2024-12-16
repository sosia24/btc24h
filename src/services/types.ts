
/*
AQUI VAI AS ESTRUTURAS DE DADOS
export type nftQueue = {
    user:string,
    next:bigint,
    prev:bigint,
    index:bigint,
    batchLevel:bigint,
    dollarsClaimed:bigint,
    nextPaied: boolean,
}
*/
export type UserDonation = {
    balance:bigint,
    startedTimestamp:bigint,
    totalClaimed:bigint,
    totalDonated:bigint,
    maxUnilevel:bigint,
    unilevelReached:bigint,
}

export type queueData = {
    user:string,
    index:bigint,
    batchLevel:bigint,
    nextPaied: boolean,
}