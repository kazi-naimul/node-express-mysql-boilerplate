const userConstant = {
 
    STATUS_ACTIVE: 1,
    STATUS_INACTIVE: 0,
    STATUS_REMOVED: 2,
};

const branchStatus={
    STATUS_INACTIVE :0,
    STATUS_ACTIVE:1
}

const businessStatus={
    STATUS_INACTIVE :0
}

const verificationCodeConstant = {
    TYPE_EMAIL_VERIFICATION: 1,
    TYPE_RESET_PASSWORD: 2,
    STATUS_NOT_USED: 0,
    STATUS_USED: 1,
};

module.exports = {
    userConstant,
    verificationCodeConstant,
    branchStatus,
    businessStatus
};
