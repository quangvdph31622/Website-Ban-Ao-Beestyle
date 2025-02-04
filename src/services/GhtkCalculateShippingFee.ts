import httpInstance from "@/utils/HttpInstance";

export const URL_API_GHTK = {
    calculateShippingFee: "/ghtk/calculate-fee", // API tính phí vận chuyển
};


export const ghtkCalculateShippingFee = async (params: Record<string, any>) => {
    const response = await httpInstance.post(URL_API_GHTK.calculateShippingFee, params);
    return response.data;
};

// /**
//  * Lấy danh sách tỉnh thành từ GHN
//  * @returns Dữ liệu các tỉnh thành
//  */
// export const getProvinces = async () => {
//   try {
//     const response = await httpInstance.get(URL_API_GHN.getProvinces);
//     console.log("Dữ liệu tỉnh thành:", response.data.data);
//     return response.data.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách tỉnh thành GHN:", error);
//     throw error;
//   }
// };

// /**
//  * Lấy danh sách quận huyện từ GHN
//  * @param provinceId ID tỉnh thành cần lấy quận huyện
//  * @returns Dữ liệu các quận huyện
//  */
// export const getDistricts = async (provinceId: number) => {
//   try {
//     const response = await httpInstance.post(URL_API_GHN.getDistricts, {
//       provinceId,
//     });
//     console.log("Dữ liệu quận huyện:", response.data.data);
//     return response.data.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách quận huyện GHN:", error);
//     throw error;
//   }
// };

// /**
//  * Tính phí vận chuyển từ GHN
//  * @param params Thông tin yêu cầu tính phí vận chuyển
//  * @returns Dữ liệu phí vận chuyển
//  */
