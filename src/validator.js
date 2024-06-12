export function validateInput(inputConfigArray, inputArgs) {
    const inputArgsArray = Array.from(inputArgs);

    const uniqueToArr1 = inputConfigArray.filter(element => !inputArgsArray.includes(element));
    const uniqueToArr2 = inputArgsArray.filter(element => !inputConfigArray.includes(element));

    if(uniqueToArr2.length > 0 || uniqueToArr1.length > 0) {
        console.log('Missing inputs', uniqueToArr1);
        console.log('Unknown inputs', uniqueToArr2);
        process.exit(1);
    }
}