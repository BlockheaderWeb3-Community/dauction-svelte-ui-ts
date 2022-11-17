export const arrayIsNotEqual = (arr1: any[], arr2: any[]) => {
	if ((Array.isArray(arr1) && arr1.join()) !== (Array.isArray(arr2) && arr2.join())) {
		return true;
	}
	return false;
};

export const sortArrayofObjects = (array: any, key: any) => {
	return array.sort((a: any, b:any) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};
