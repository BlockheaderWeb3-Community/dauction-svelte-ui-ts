export const arrayIsNotEqual = (arr1: any[], arr2: any[]) => {
	if ((Array.isArray(arr1) && arr1.join()) !== (Array.isArray(arr2) && arr2.join())) {
		return true;
	}
	return false;
};