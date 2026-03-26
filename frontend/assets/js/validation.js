window.validators = {
  required(value, label) {
    if (value === undefined || value === null || value === '') {
      throw new Error(`حقل ${label} مطلوب`);
    }
  },
  nonNegativeNumber(value, label) {
    const n = Number(value);
    if (isNaN(n) || n < 0) throw new Error(`حقل ${label} يجب أن يكون رقم موجب أو صفر`);
  }
};
