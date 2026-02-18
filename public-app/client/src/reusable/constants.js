export const HTTP_RESPONSE = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}

export const HTTP_METHODS = {
    GET : 'GET',
    POST : 'POST',
    PUT : 'PUT',
    DELETE : 'DELETE'
}

export const API_URLS = {
    E_VOUCHER_GIFTLIST : {
        getBrandbyproductcode : '/voucher/getBrandbyproductcode?id=',
        updateBrandStatus : '/voucher/updateBrandStatus',
        getBrands : '/voucher/getBrands',
        getStocksByID : '/voucher/getStocks?voucherBrandId=',
        getAllBrandNames : '/voucher/getAllBrandsName'
    },

    DS_PRODUCTS : {
        getRedeemProducts : '/dsProducts/getReedemProduct'
    },

    PENDING_REQUEST_LIST : {
        getPendingVouchersList : '/voucher/getPendingVoucher',
        pendingVouchersSearch : '/voucher/searchPendingVoucherRequest?search=',
        approvePendingVoucher : '/voucher/approvePullRequest',
        rejectPendingVoucher : '/voucher/rejectRequest',
    },

    REJECT_REQUEST_LIST : {
        getRejectedVouchersList : '/voucher/getRejectVoucher',
        rejectedVouchersSearch : '/voucher/searchRejectVoucherRequest?search=',
    },

    APPROVED_REQUEST_LIST : {
        getAcceptedVoucher : '/voucher/getAcceptVoucher',
        approvedVoucherSearch : '/voucher/searchApproveVoucherRequest?search=',
        getRequestById : '/voucher/getRequestById?id=',
        resendVoucher : '/voucher/resendVoucher?requestId=',
        resendCheck : '/voucher/disableResendButton?id='
    },

    ZILLION_LIST : {
        getZillionList : '/voucher/getTransactionList?store='
    },

    ORDER_REDEEM_LIST : {
        getOrderRedeemList : '/points/getOrderRedeemRule?store=',
        searchOrderRedeemList : '/points/searchApiOrderRedeem?search_value='
    },

    GIFT_MANAGEMENT : {
        fetchGifts : '/gift/fetchGifts',
        updateGift : '/gift/putGift',
        createGift : '/gift/createGift',
        deleteGift : '/gift/deleteGift?giftId=',  
    }
}