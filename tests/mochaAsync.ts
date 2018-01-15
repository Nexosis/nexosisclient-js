
export let mochaAsync = function (fn) {
    return (done) => {
        fn.call().then(done, (err) => { done(err) });
    };
};

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isComplete(status: string) {
    return ['Completed', 'Failed', 'Cancelled'].indexOf(status) > -1;
}
