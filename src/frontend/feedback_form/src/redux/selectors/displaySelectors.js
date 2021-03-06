export const getDisplayState = store => store.display;

export const getSectionsNotCompleted = store => getDisplayState(store) ? getDisplayState(store).sectionsNotCompleted : false;

export const getDataSaved = store => getDisplayState(store) ? getDisplayState(store).dataSaved : {displayMessage: false, success: false, lastWidget: false};

export const getIsLoading = store => getDisplayState(store) ? getDisplayState(store).loading : false;

export const getDataFetchError = store => getDisplayState(store) ? getDisplayState(store).showDataFetchError : false;