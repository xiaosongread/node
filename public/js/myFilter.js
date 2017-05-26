swig.init({ filters: require('myfilters') });
exports.myfilter = function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}