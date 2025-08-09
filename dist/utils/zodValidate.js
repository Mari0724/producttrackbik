"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidate = void 0;
const zodValidate = (schema, data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const error = result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("; ");
        return { success: false, error };
    }
    return { success: true, data: result.data };
};
exports.zodValidate = zodValidate;
