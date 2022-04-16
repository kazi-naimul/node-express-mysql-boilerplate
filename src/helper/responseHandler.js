const logError = (err) => {
    console.error(err);
};

const logErrorMiddleware = (err, req, res, next) => {
    logError(err);
    next(err);
};

const returnError = (statusCode, message) => {
    return {
        statusCode,
        response: {
            status: false,
            code: statusCode,
            message,
        },
    };
};
const returnSuccess = (statusCode, message, data = {}) => {
    return {
        statusCode,
        response: {
            status: true,
            code: statusCode,
            message,
            data,
        },
    };
};

const getPaginationData = (rows, page, limit) => {
    const { count: totalItems, rows: data } = rows;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        data,
        totalPages,
        currentPage,
    };
};

module.exports = {
    logError,
    logErrorMiddleware,
    returnError,
    returnSuccess,
    getPaginationData,
};
