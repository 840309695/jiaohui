
function helpNewSearch() { }
helpNewSearch._path = '/dwr';

helpNewSearch.getSearchInfo = function(p0, callback) {
    DWREngine._execute(helpNewSearch._path, 'helpNewSearch', 'getSearchInfo', p0, callback);
}
