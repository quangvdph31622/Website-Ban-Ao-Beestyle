// số cấp tối đa 1 danh mục
export const MAX_CATEGORY_LEVEL: number = 3;


export const FORMAT_NUMBER_WITH_COMMAS: RegExp = /\B(?=(\d{3})+(?!\d))/g;


export const PARSER_NUMBER_WITH_COMMAS_TO_NUMBER: RegExp = /\$\s?|(,*)/g;

// ngưỡng giá trị hóa đơn được free ship
export const FREE_SHIPPING_THRESHOLD: number = 500000;