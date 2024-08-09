"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const encode_1 = require("../utils/encode");
const cloudinary_1 = require("../utils/cloudinary");
exports.default = {
    single(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((req === null || req === void 0 ? void 0 : req.file) === undefined) {
                return res.status(400).send({
                    message: "No file uploaded",
                    data: null,
                });
            }
            const dataURI = (0, encode_1.toDataURI)(req.file);
            try {
                const result = yield (0, cloudinary_1.handleUpload)(dataURI);
                res.status(200).send({ message: "File uploaded", data: result });
            }
            catch (error) {
                const _err = error;
                res
                    .status(400)
                    .send({ message: "Error uploading file", data: _err.message });
            }
        });
    },
    multiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (req.files === undefined || ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                return res.status(400).send({
                    message: "No files uploaded",
                    data: null,
                });
            }
            const files = req.files;
            const dataURIs = files === null || files === void 0 ? void 0 : files.map((file) => (0, encode_1.toDataURI)(file)).map(cloudinary_1.handleUpload);
            try {
                const results = yield Promise.all(dataURIs);
                res.status(200).send({ message: "Files uploaded", data: results });
            }
            catch (error) {
                const _err = error;
                res
                    .status(400)
                    .send({ message: "Error uploading files", data: _err.message });
            }
            res.status(200).send({ message: "Files uploaded", data: files });
        });
    },
};
