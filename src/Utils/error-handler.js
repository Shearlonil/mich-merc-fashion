const handleErrMsg = (ex) => {
	return {
		msg: ex?.response?.data?.message ? 
			//	in case ex.response.data.message is an array/object of error messages
			( typeof(ex.response.data.message) === 'object' ? buildString(ex.response.data.message) : ex.response.data.message ) 
			: ex?.response?.data ? ex.response.data : ex?.response ? ex.response : ex,
		status: ex.response?.status ? ex.response.status : "Unknown"
	}
};

const buildString = (arr) => {
	let str = '';
	arr.forEach(element => str += element + '.\n');
	return str;
}

export default handleErrMsg;